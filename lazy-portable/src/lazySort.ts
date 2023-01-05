interface RequiredOrder {
    name: string,
    content: any,
    required?: string[]
}
export class LazySort {
    public static byRequired(myDatas: RequiredOrder[], allMustExist: boolean = false) {
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