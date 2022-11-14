/**
 * Representation of a point on a graph.
 */
interface GraphPoint {
    /**
     * The value of the point.
     */
    value: number;
    /**
     * A label to name the point.
     */
    label: string;
    /**
     * The increased percentage on tangent graph.
     */
    increasePercent?: number;
}
/**
 * A non-visual graph to analyze variation in datas.
 */
export class LazyDataGraph {
    private _points: GraphPoint[];
    private isTan: boolean;
    /**
     * Create a new graph with some points.
     * @param {GraphPoint[]} datas An array of points on the graph.
     */
    constructor(...datas: GraphPoint[]) {
        this._points = [...datas];
        this.isTan = false;
    }
    /**
     * Get the points on the graph.
     */
    public get points(): GraphPoint[] {
        return [...this._points];
    }
    /**
     * Set the points on the graph.
     */
    public set points(pts: GraphPoint[]) {
        this._points = [...pts];
    }
    /**
     * Check if the graph is a tangent graph or a root graph.
     * @returns {boolean} True if the graph is a tangent graph.
     */
    public isTangentGraph(): boolean {
        return this.isTan;
    }
    /**
     * Get the tangent graph, showing the difference happening between each points and the increased / decreased percentage.
     * @returns {LazyDataGraph} The tangent graph.
     */
    public getTangentGraph(): LazyDataGraph {
        const tanGraph = new LazyDataGraph(...this.generateSlope());
        tanGraph.isTan = true;
        return tanGraph;
    }
    /**
     * Generate a bunch of tangent points from this graph.
     * @returns {GraphPoint[]} The tangent points array.
     */
    public generateSlope(): GraphPoint[] {
        if(this._points.length <= 1) {
            return [];
        }
        const lastI = this._points.length - 1;
        const slope: GraphPoint[] = [];
        for(let i = 0; i < lastI; i++) {
            const actual = this._points[i];
            const next = this._points[i + 1];
            const preSlope = next.value - actual.value;
            const result: GraphPoint = {
                value: preSlope,
                label: `${actual.label}-${next.label}`,
                increasePercent: preSlope / (actual.value != 0 ? actual.value : 1)
            };
            slope.push(result);
        }
        return slope;
    }
}