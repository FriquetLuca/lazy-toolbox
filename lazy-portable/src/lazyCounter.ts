/**
 * A structure representing a required material.
 */
interface RequiredMaterial {
    /**
     * The material name.
     */
    name: string;
    /**
     * The quantity needed.
     */
    quantity?: number;
    /**
     * The price of the material.
     */
    price?: number;
}
/**
 * A structure representing a material that can be made.
 */
interface MaterialCounter {
    /**
     * Name of the material.
     */
    name: string;
    /**
     * Materials required to make this material.
     */
    required?: RequiredMaterial[];
    /**
     * The price of this material.
     */
    price: number;
}
/**
 * A lazy way to count in crafting structure.
 */
export class LazyCounter {
    /**
     * Compute the cost of a specific material.
     * @param {string} itemName The name of the material.
     * @param {MaterialCounter[]} materials The list of materials and what's required to make what.
     * @returns {number} The price it cost in total for the material.
     */
    public static fullPrice(itemName: string, ...materials: MaterialCounter[]): number {
        const currentItem = LazyCounter.findItem(itemName, materials);
        if(currentItem) {
            let price = currentItem.price;
            if(currentItem.required) {
                for(const itm of currentItem.required) {
                    if(itm.quantity) {
                        price += itm.quantity * LazyCounter.fullPrice(itm.name, ...materials);
                    } else {
                        price += LazyCounter.fullPrice(itm.name, ...materials);
                    }
                }
            }
            return price;
        }
        return 0;
    }
    /**
     * Get the full list of basic materials required for a desired material.
     * @param {string} itemName The name of the material.
     * @param {MaterialCounter[]} materials The list of materials and what's required to make what.
     * @returns {RequiredMaterial[]} The full list of basic materials required for a desired material.
     */
    public static allRowMaterials(itemName: string, ...materials: MaterialCounter[]): RequiredMaterial[] {
        const currentItem = LazyCounter.findItem(itemName, materials);
        if(currentItem) {
            if(currentItem.required && currentItem.required.length > 0) {
                const mapItem = new Map();
                for(const reqItm of currentItem.required) {
                    const rowMatItems = LazyCounter.allRowMaterials(reqItm.name, ...materials);
                    for(const matItm of rowMatItems) {
                        const mtQt = matItm?.quantity || 1;
                        if(mapItem.has(matItm.name)) {
                            mapItem.set(matItm.name, (reqItm.quantity ? reqItm.quantity * mtQt : mtQt) + mapItem.get(matItm.name));
                        } else {
                            mapItem.set(matItm.name, reqItm.quantity ? reqItm.quantity * mtQt : mtQt);
                        }
                    }
                }
                const result: RequiredMaterial[] = [];
                for(const mp of mapItem) {
                    result.push({
                        name: mp[0],
                        quantity: mp[1]
                    });
                }
                return result;
            }
            return [{
                name: currentItem.name,
                quantity: 1
            }];
        }
        return [];
    }
    private static findItem(itemName: string, items: MaterialCounter[]): MaterialCounter | undefined {
        for(let i = 0; i < items.length; i++) {
            if(items[i].name === itemName) {
                return items[i];
            }
        }
        return undefined;
    }
}