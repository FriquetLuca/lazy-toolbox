import { LazyView } from "./lazyView";
import { LazyDOMDiffing } from "./lazyDOMDiffing";

/**
 * A lazy way to represent reactive components options.
 */
export interface LazyReactOptions {
    /**
     * Name of the component.
     */
    name: string;
    /**
     * The document query selector.
     */
    selector: string;
    /**
     * The responsive datas.
     */
    datas: {[label: string]: any};
    /**
     * A list of observers.
     */
    observers?: LazyReactComponent[];
    /**
     * The component renderer of the reactive component.
     * @param {{[label: string]: any}} data The responsive datas.
     * @returns {string} The HTML string representation of the component.
     */
    component: (data: {[label: string]: any}) => string;
    /**
     * The behaviours of the reactive component.
     */
    behaviours?: {[label: string]: any};
}
const _COMPONENTS: Map<string,any> = new Map();
class LazyReactSingletonFactory {
    private static instance: any;
    protected constructor() {}
    /**
     * Initialize a singleton reactive component.
     * @param {any[]} args Arguments for the component.
     * @returns {any} The new singleton created.
     */
    public static initializeComponent<T extends LazyReactSingletonFactory>(this: new (...args: any[]) => T, ...args: any[]): T {
        if (!LazyReactSingletonFactory.instance) {
            LazyReactSingletonFactory.instance = new (this as any)(...args);
            _COMPONENTS.set(typeof LazyReactSingletonFactory.instance, LazyReactSingletonFactory.instance);
        }
        return LazyReactSingletonFactory.instance;
    }
    /**
     * Create a component not tied to a singleton.
     * @param {any[]} args Arguments for the component.
     * @returns {T} The new component created.
     */
    public static createComponent<T extends LazyReactSingletonFactory>(this: new (...args: any[]) => T, ...args: any[]): T {
        return new (this as any)(...args);
    }
    /**
     * Get the instance of a singleton reactive component.
     * @returns 
     */
    public static getInstance<T extends LazyReactSingletonFactory>(): T {
        return LazyReactSingletonFactory.instance;
    }
}
/**
 * Manage the different components.
 */
export class LazyReactComponentManager {
    /**
     * Get the specified component if it exist as a singleton.
     * @param {string} componentName The name of the component to retrieve.
     * @returns {T | undefined} The singleton component.
     */
    public static getComponent<T extends LazyReactSingletonFactory>(componentName: string): T | undefined {
        return _COMPONENTS.get(componentName);
    }
    /**
     * Get the list of all singleton components existing.
     * @returns {string[]} The list of all singleton components existing.
     */
    public static getComponentList(): string[] {
        const result: string[] = [];
        for(const [compName,] of _COMPONENTS) {
            result.push(compName);
        }
        return result;
    }
}
/**
 * A lazy way to make reactive components.
 */
export abstract class LazyReactComponent extends LazyReactSingletonFactory {
    protected name: string;
    protected elem: any;
    protected subscribers: Set<LazyReactComponent>;
    /**
     * The component renderer of the reactive component.
     */
    public component: (data: {[label: string]: any}) => string;
    /**
     * The behaviours of the reactive component.
     */
    public behaviours: {[label: string]: any};
    /**
     * The rebounce number to keep track of rebounces.
     */
    public debounce: number | null;
    /**
     * The datas for the reactive component.
     */
    public datas: {[label: string]: any};
    /**
     * Create a reactive component.
     * @param {LazyReactOptions} options The options of the reactive component.
     */
    constructor(options: LazyReactOptions) {
        super();
        // Variables
        this.name = options.name;
        this.elem = document.querySelector(options.selector);
        let _datas = new Proxy(options.datas, LazyDOMDiffing.handler(this));
        this.component = options.component;
        this.debounce = null;
        this.datas = {};
        this.subscribers = new Set();
        this.behaviours = options.behaviours || {};
        if(options.observers) {
            for(const sub of options.observers) {
                this.subscribers.add(sub);
            }
        }
        // Define setter and getter for data
        Object.defineProperty(this, 'datas', {
            get: function () {
                return _datas;
            },
            set: function (data) {
                _datas = new Proxy(data, LazyDOMDiffing.handler(this));
                this.datas = data;
                this.debounce(this);
                return true;
            }
        });
    }
    /**
     * Subscribe a component to the component so if any changes happened, the notify method will be called.
     * @param {LazyReactComponent} node The component that want to subscribe for any changes on the component.
     */
    public subscribe(node: LazyReactComponent): void {
        if(!this.subscribers.has(node)) {
            this.subscribers.add(node);
        }
    }
    /**
     * A notification function used for interactivity between components.
     * @param {LazyReactComponent} component The component that notified us.
     */
    public abstract notification(component: LazyReactComponent): void | Promise<void>;
    /**
     * Unsubscribe a component to the subscribers, making it stop being triggered for any new updates on the component.
     * @param {LazyReactComponent} node The component that want to unsubscribe to the component.
     */
    public unsubscribe(node: LazyReactComponent): void {
        if(this.subscribers.has(node)) {
            this.subscribers.delete(node);
        }
    }
    /**
     * Render a UI from the component.
     */
    public render(): void {
        // Convert the template to HTML
        const templateHTML = LazyView.stringToHTML(this.component(this.datas));
        // Diff the DOM
        LazyDOMDiffing.diff(templateHTML, this.elem, this.behaviours);
        for(const subscriber of this.subscribers) {
            subscriber.notification(this);
        }
    };
}
