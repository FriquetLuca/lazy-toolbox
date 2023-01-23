import { LazyView } from "./lazyView";
import { LazyDOMDiffing } from "./lazyDOMDiffing";
/**
 * A lazy way to represent reactive components options.
 */
export interface LazyReactOptions {
    /**
     * The document query selector.
     */
    selector: string;
    /**
     * The responsive datas.
     */
    data: {[label: string]: any};
    /**
     * The component renderer of the reactive component.
     * @param {{[label: string]: any}} data The responsive datas.
     * @returns {string} The HTML string representation of the component.
     */
    component: (data: {[label: string]: any}) => string;
}
/**
 * A lazy way to make reactive components.
 */
export class LazyReact {
    private elem: any;
    /**
     * The component renderer of the reactive component.
     */
    public component: (data: {[label: string]: any}) => string;
    /**
     * The rebounce number to keep track of rebounces.
     */
    public debounce: number | null;
    /**
     * The datas for the reactive component.
     */
    public data: {[label: string]: any};
    /**
     * Create a reactive component.
     * @param {LazyReactOptions} options The options of the reactive component.
     */
    constructor(options: LazyReactOptions) {
        // Variables
        this.elem = document.querySelector(options.selector);
        let _data = new Proxy(options.data, LazyDOMDiffing.handler(this));
        this.component = options.component;
        this.debounce = null;
        this.data = {};
        // Define setter and getter for data
        Object.defineProperty(this, 'data', {
            get: function () {
                return _data;
            },
            set: function (data) {
                _data = new Proxy(data, LazyDOMDiffing.handler(this));
                this.debounce(this);
                return true;
            }
        });
    }
    /**
     * Render a UI from the component.
     */
    public render(): void {
        // Convert the template to HTML
        const templateHTML = LazyView.stringToHTML(this.component(this.data));
        // Diff the DOM
        LazyDOMDiffing.diff(templateHTML, this.elem);
    };
    /**
     * Load the component and retrieve directly the reactive datas.
     * @param {LazyReactOptions} options The options of the reactive component.
     * @returns {{[label: string]: any}} The reactive datas.
     */
    public static load(options: LazyReactOptions): {[label: string]: any} {
        const react = new LazyReact(options);
        react.render();
        return react.data;
    }
}
