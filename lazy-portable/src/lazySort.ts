/**
 * An interface representing a dependency object.
 */
export interface RequiredOrder {
    /**
     * Name of the dependency.
     */
    name: string,
    /**
     * The data content of the dependency.
     */
    content: any,
    /**
     * The required dependency of this dependency.
     */
    required?: string[]
}
/**
 * A lazy way to sort some datas.
 */
export class LazySort {
    /**
     * Order an array with a topological sort, taing the order by component requirement.
     * @param {RequiredOrder[]} myDatas An array containing all the required elements to sort.
     * @param {boolean} allMustExist A boolean to check if a required element doesn't exist, then the element shouldn't be present.
     * @returns {RequiredOrder[]} An array with the elements correctly ordered.
     */
    public static byRequired(myDatas: RequiredOrder[], allMustExist: boolean = false): RequiredOrder[] {
        const nodeMap: {[label: string]: RequiredOrder} = {};
        for (const data of myDatas) {
            nodeMap[data.name] = data;
        }
        const sorted: RequiredOrder[] = [];
        const visited = new Set();
        function visitNode(node: RequiredOrder) {
            if (!node || visited.has(node.name) || !nodeMap[node.name]) {
                return;
            }
            visited.add(node.name);
            for (const dependency of node.required || []) {
                visitNode(nodeMap[dependency]);
            }
            sorted.push(node);
        }
        for (const data of myDatas) {
            visitNode(data);
        }
        if(allMustExist) {
            for(let i = sorted.length - 1; i >= 0; i--) {
                const currentObjectRequire = sorted[i].required || [];
                for(const currentRequired of currentObjectRequire) {
                    if(!nodeMap[currentRequired]) {
                        if(nodeMap[sorted[i].name]) {
                            delete nodeMap[sorted[i].name];
                        }
                        delete sorted[i];
                        sorted.splice(i, 1);
                        i = sorted.length - 1;
                        break;
                    }
                }
            }
        }
        return sorted;
    }
}