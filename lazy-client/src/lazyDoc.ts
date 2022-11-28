/**
 * A lazy HTMLTag object to represent an HTML tag.
 * @member {string} tag The HTML element tag name.
 * @member {string | undefined} id The id of the HTML element.
 * @member {string[] | undefined} class The classes of the HTML element.
 * @member {{[name: string]: string} | undefined} attributes The attributes of the HTML element.
 * @member {{[name: string]: (e: Event)=>void} | undefined} eventListeners The event listeners of the HTML element.
 */
interface HTMLTag {
    /**
     * The HTML element tag name.
     */
    tag: string;
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
     * A lazy way to create HTML element.
     * @param {HTMLTag} element The element to create.
     * @returns {HTMLElement} The HTML element created.
     */
    public static newTag(element: HTMLTag): HTMLElement {
        const eventSection = document.createElement(element.tag);
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
        return eventSection;
    }
}