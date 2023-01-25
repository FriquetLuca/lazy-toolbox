import { LazyReactComponent, LazyReactOptions } from "./lazyReact";
/**
 * A lazy way to handle the DOM.
 */
export class LazyDOM {
    /**
     * Create an observer on a DOM object and execute the callback
     * @param {Node} obj The node to observe.
     * @param {(mutations: MutationRecord[], observer: MutationObserver) => void} callback The callback method for when the DOM has changed.
     */
    public static observe(obj: Node, callback: (mutations: MutationRecord[], observer: MutationObserver) => void): void {
        const observe = LazyDOM.observer();
        observe(obj, callback);
    }
    private static observer() {
        const wnd: any = window;
        const MutationObserver = wnd.MutationObserver || wnd.WebKitMutationObserver;
        return function(obj: any, callback: MutationCallback){
            if(!obj || obj.nodeType !== 1) {
                return;
            }
            if(MutationObserver){
                // define a new observer
                const mutationObserver = new MutationObserver(callback);
                // have the observer observe for changes in children
                mutationObserver.observe(obj, { childList:true, subtree:true });
                return mutationObserver;
            } else if(wnd.addEventListener){ // browser support fallback
                obj.addEventListener('DOMNodeInserted', callback, false);
                obj.addEventListener('DOMNodeRemoved', callback, false);
            }
        }
    }
}