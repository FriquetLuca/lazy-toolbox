#### [LazyDataGraph](#lazyDataGraph)
```ts
interface GraphPoint {
    value: number;
    label: string;
    increasePercent?: number;
    localMean?: number;
    localVariance?: number;
}
class LazyDataGraph {
    constructor(...datas: GraphPoint[]);
    get points(): GraphPoint[];
    set points(pts: GraphPoint[]);
    isTangentGraph(): boolean;
    getTangentGraph(): LazyDataGraph;
    generateSlope(): GraphPoint[];
}
```

A non-visual graph to analyze variation in datas.

Example:

```js
const { LazyDataGraph } = require('@lazy-toolbox/portable');
// Create the graph
const lazyGraph = new LazyDataGraph(
    // Set an ordered bunch of points
    {label:'d1', value:100},
    {label:'d2', value:100},
    {label:'d3', value:200},
    {label:'d4', value:150},
    {label:'d5', value:100}
);
// Generate the tangent of the graph to see the differentiation in the graph
const tangentGraph = lazyGraph.generateSlope();
// Just showing what was made on the way.
for(let tanPt of tangentGraph) {
    console.log(`- ${tanPt.label}: [value: ${tanPt.value}, increasePercent: ${tanPt.increasePercent}, localMean: ${tanPt.localMean}, localVariance: ${tanPt.localVariance}]`);
}
/* Result:
- d1-d2: [value: 0, increasePercent: 0.0 ]
- d2-d3: [value: 100, increasePercent: 2.0 ]
- d3-d4: [value: -50, increasePercent: -0.25 ]
- d4-d5: [value: -50, increasePercent: -0.33 ]
*/
```
