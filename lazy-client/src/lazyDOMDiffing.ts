import { LazyReact } from "./lazyReact";
import { LazyView } from "./lazyView";
/**
 * A lazy handler for responsive components.
 */
export interface LazyHandler {
    /**
     * The data getter.
     * @param {any} obj The datas handled.
     * @param {any} prop The responsive property.
     * @returns {any}
     */
    get: (obj: any, prop: any) => any;
    /**
     * The data setter.
     * @param {any} obj The datas handled.
     * @param {any} prop The responsive property.
     * @param {any} value The new value.
     * @returns {boolean} Return true after the property was successfully set.
     */
    set: (obj: any, prop: any, value: any) => boolean;
    /**
     * The data delete.
     * @param {any} obj The datas handled.
     * @param {any} prop The responsive property.
     * @returns {boolean} Return true after the property was successfully deleted.
     */
    deleteProperty: (obj: any, prop: any) => boolean;
}
/**
 * A lazy way to achieve DOM Diffing
 */
export class LazyDOMDiffing {
    /**
     * Setup a debounce renderer.
     * @param {LazyReact} instance The instance of a lazy react component.
     */
    private static debounceRender(instance: LazyReact): void {
        // If there's a pending render, cancel it
        if (instance.debounce) {
            window.cancelAnimationFrame(instance.debounce);
        }
        // Setup the new render to run at the next animation frame
        instance.debounce = window.requestAnimationFrame(function () {
            instance.render();
        });
    };
    /**
     * A proxy handler for reactive components.
     * @param {LazyReact} instance The reactive instance.
     * @returns {LazyHandler} The handler associated with the reactive instance.
     */
    public static handler(instance: LazyReact): LazyHandler {
        return {
            get: function (obj: any, prop: any): any {
                if (['[object Object]', '[object Array]'].indexOf(Object.prototype.toString.call(obj[prop])) > -1) {
                    return new Proxy(obj[prop], LazyDOMDiffing.handler(instance));
                }
                return obj[prop];
            },
            set: function (obj: any, prop: any, value: any): boolean {
                obj[prop] = value;
                LazyDOMDiffing.debounceRender(instance);
                return true;
            },
            deleteProperty: function (obj: any, prop: any): boolean {
                delete obj[prop];
                LazyDOMDiffing.debounceRender(instance);
                return true;
    
            }
        };
    }
    /**
     * Compare the template to the UI and updates.
     * @param {Node} template The template HTML.
     * @param {Node} elem The UI HTML.
     */
    public static diff(template: Node, elem: Node): void {
        // Get arrays of child nodes
        const domNodes = Array.prototype.slice.call(elem.childNodes);
        const templateNodes = Array.prototype.slice.call(template.childNodes);
        // If extra elements in DOM, remove them
        let count = domNodes.length - templateNodes.length;
        if (count > 0) {
            for (; count > 0; count--) {
                domNodes[domNodes.length - count].parentNode.removeChild(domNodes[domNodes.length - count]);
            }
        }
        // Diff each item in the templateNodes
        templateNodes.forEach(function (node, index) {
            // If element doesn't exist, create it
            if (!domNodes[index]) {
                elem.appendChild(node.cloneNode(true));
                return;
            }
            // If element is not the same type, replace it with new element
            if (LazyView.getNodeType(node) !== LazyView.getNodeType(domNodes[index])) {
                domNodes[index].parentNode.replaceChild(node.cloneNode(true), domNodes[index]);
                return;
            }
            // If content is different, update it
            const templateContent = LazyView.getNodeContent(node);
            if (templateContent && templateContent !== LazyView.getNodeContent(domNodes[index])) {
                domNodes[index].textContent = templateContent;
            }
            // If target element should be empty, wipe it
            if (domNodes[index].childNodes.length > 0 && node.childNodes.length < 1) {
                domNodes[index].innerHTML = '';
                return;
            }
            // If element is empty and shouldn't be, build it up
            // This uses a document fragment to minimize reflows
            if (domNodes[index].childNodes.length < 1 && node.childNodes.length > 0) {
                const fragment = document.createDocumentFragment();
                LazyDOMDiffing.diff(node, fragment);
                domNodes[index].appendChild(fragment);
                return;
            }
            // If there are existing child elements that need to be modified, diff them
            if (node.childNodes.length > 0) {
                LazyDOMDiffing.diff(node, domNodes[index]);
            }
        });

    }
}