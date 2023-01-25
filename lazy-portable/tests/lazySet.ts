class LazySet {
    /**
     * Return the difference between two json object. If it's a value that differ between the two object then the difference will be given from `jsonB`.
     * This means that you can test `jsonA` as an initial state and `jsonB` as the next state, getting back all the changes that happened.
     * @param {{[label: string]: any}} jsonA Object A.
     * @param {{[label: string]: any}} jsonB Object B.
     * @returns {{[label: string]: any}} The difference object representation.
     */
    public static difference(jsonA: {[label: string]: any}, jsonB: {[label: string]: any}): {[label: string]: any} {
        const changes: {[label: string]: any} = {};
        for (const key in jsonB) {
            if (!jsonA.hasOwnProperty(key)) {
                changes[key] = jsonB[key];
            } else if (Array.isArray(jsonB[key])) {
                const nestedChanges = jsonB[key].filter((e: any) => !jsonA[key].includes(e));
                if (nestedChanges.length > 0) {
                    changes[key] = nestedChanges;
                }
            } else if (typeof jsonB[key] === "object") {
                const nestedChanges = LazySet.difference(jsonA[key], jsonB[key]);
                if (Object.keys(nestedChanges).length > 0) {
                    changes[key] = nestedChanges;
                }
            } else if (jsonA[key] !== jsonB[key]) {
                changes[key] = jsonB[key];
            }
        }
        return changes;
    }
    /**
     * Return an intersection of both objects.
     * This means that you can test `jsonA` and `jsonB`, taking only the values that are the same. In case of an array, it will take only the same shared value of the array.
     * @param {{[label: string]: any}} jsonA Object A.
     * @param {{[label: string]: any}} jsonB Object B.
     * @returns {{[label: string]: any}} The intersection object representation.
     */
    public static intersect(jsonA: {[label: string]: any}, jsonB: {[label: string]: any}): {[label: string]: any} {
        const changes: {[label: string]: any} = {};
        for (const key in jsonA) {
            if (jsonB.hasOwnProperty(key)) {
                if (Array.isArray(jsonA[key])) {
                    const nestedChanges = jsonA[key].filter((e: any) => jsonB[key].includes(e));
                    if (nestedChanges.length > 0) {
                        changes[key] = nestedChanges;
                    }
                } else if (typeof jsonA[key] === "object") {
                    const nestedChanges = LazySet.intersect(jsonA[key], jsonB[key]);
                    if (Object.keys(nestedChanges).length > 0) {
                        changes[key] = nestedChanges;
                    }
                } else if (jsonA[key] === jsonB[key]) {
                    changes[key] = jsonA[key];
                }
            }
        }
        return changes;
    }
    /**
     * Merge two json object. If a property from both object exist and has a different value, `jsonB` value will override `jsonA` value. In case of an array, it will merge them as a set. In case of an object, it will merge them.
     * @param {{[label: string]: any}} jsonA 
     * @param {{[label: string]: any}} jsonB 
     * @returns {{[label: string]: any}} 
     */
    public static union(jsonA: {[label: string]: any}, jsonB: {[label: string]: any}): {[label: string]: any} {
        let _union = {...jsonA};
        for (const key in jsonB) {
            if (Array.isArray(jsonB[key])) {
                _union[key] = [...new Set([...(_union[key] || []), ...jsonB[key]])];
            } else if (typeof jsonB[key] === "object") {
                _union[key] = LazySet.union(_union[key] || {}, jsonB[key]);
            } else {
                _union[key] = jsonB[key];
            }
        }
        return _union;
    }
}