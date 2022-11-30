/**
 * A lazy HTMLTag object to represent an HTML tag.
 * @member {string} tag The HTML element tag name.
 * @member {string | undefined} id The id of the HTML element.
 * @member {string[] | undefined} class The classes of the HTML element.
 * @member {{[name: string]: string} | undefined} attributes The attributes of the HTML element.
 * @member {{[name: string]: (e: Event)=>void} | undefined} eventListeners The event listeners of the HTML element.
 */
export interface HTMLTag {
    /**
     * The id of the HTML element.
     */
    id?: string;
    /**
     * The classes of the HTML element.
     */
    class?: string[];
    /**
     * The childs of the HTML element.
     */
    childs?: HTMLElement[];
    /**
     * The inner HTML of the element.
     */
    innerHTML?: string;
    /**
     * The attributes of the HTML element.
     */
    attributes?: {[name: string]: string};
    /**
     * The event listeners of the HTML element.
     */
    eventListeners?: {[name: string]: (e: Event)=>void};
}
/**
 * A lazy way to write document.something.
 */
export class LazyDoc {
    /**
     * Creates an instance of the element for the specified tag.
     * @param {string} tagName The name of an element.
     * @param {HTMLTag} element The content of the element.
     */
    public static newTag<K extends keyof HTMLElementTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementTagNameMap[K];
    public static newTag<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementDeprecatedTagNameMap[K];
    public static newTag(tagName: string, element?: HTMLTag): HTMLElement {
        const eventSection = document.createElement(tagName);
        if(element) {
            if(element.id) {
                eventSection.setAttribute('id', element.id);
            }
            if(element.class) {
                element.class.forEach(c => eventSection.classList.add(c));
            }
            if(element.attributes) {
                for(const att in element.attributes) {
                    eventSection.setAttribute(att, element.attributes[att]);
                }
            }
            if(element.innerHTML) {
                eventSection.innerHTML = element.innerHTML;
            }
            if(element.childs) {
                for(const child of element.childs) {
                    eventSection.appendChild(child);
                }
            }
            if(element.eventListeners) {
                for(const evt in element.eventListeners) {
                    eventSection.addEventListener(evt, element.eventListeners[evt]);
                }
            }
        }
        return eventSection;
    }
}