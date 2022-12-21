/**
 * A lazy HTMLTag object to represent an HTML tag.
 * @member {string} tag The HTML element tag name.
 * @member {string | undefined} id The id of the HTML element.
 * @member {string[] | undefined} class The classes of the HTML element.
 * @member {{[name: string]: string} | undefined} attributes The attributes of the HTML element.
 * @member {{[name: string]: EventListenerOrEventListenerObject} | undefined} eventListeners The event listeners of the HTML element.
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
     * The inner text of the element. Is applied after inner HTML.
     */
    innerText?: string;
    /**
     * The attributes of the HTML element.
     */
    attributes?: {[name: string]: string};
    /**
     * The event listeners of the HTML element.
     */
    eventListeners?: {[name: string]: EventListenerOrEventListenerObject};
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
    public static newTag(tagName: string, element?: HTMLTag): HTMLElement;
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
            if(element.innerText) {
                eventSection.innerText = element.innerText;
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
    /**
     * Query an HTML element to add an event listener on it.
     * @param {string} query The query to get the element.
     * @param {string} type The type of event to listen to.
     * @param {EventListenerOrEventListenerObject} listener An event listener function.
     * @param {undefined | boolean | AddEventListenerOptions} options The options argument sets listener-specific options.
     */
    public static onEvent(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    public static onEvent<K extends keyof HTMLElementEventMap>(query: string, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    public static onEvent(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        const currentElement = document.querySelector(query);
        currentElement?.addEventListener(type, listener, options);
    }
    /**
     * Query all HTML elements to add an event listener on them.
     * @param {string} query The query to get all elements.
     * @param {string} type The type of event to listen to.
     * @param {EventListenerOrEventListenerObject} listener An event listener function.
     * @param {undefined | boolean | AddEventListenerOptions} options The options argument sets listener-specific options.
     */
    public static onEventAll(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    public static onEventAll<K extends keyof HTMLElementEventMap>(query: string, type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    public static onEventAll(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
        const allElements = document.querySelectorAll(query);
        for(let currentElement of allElements) {
            currentElement.addEventListener(type, listener, options);
        }
    }
    /**
     *  Query an HTML elements to remove an event listener from it.
     * @param {string} query The query to get the element.
     * @param {string} type The type of event the listener listen to.
     * @param {EventListenerOrEventListenerObject} listener The event listener function.
     * @param {undefined | boolean | AddEventListenerOptions} options The options argument sets listener-specific options.
     */
    public static removeEvent(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    public static removeEvent(query: string, type: keyof ElementEventMap, listener: (this: Element, ev: Event) => any, options?: boolean | EventListenerOptions | undefined): void;
    public static removeEvent(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        const currentElement = document.querySelector(query);
        currentElement?.removeEventListener(type, listener, options);
    }
    /**
     *  Query all HTML elements to remove an event listener from them.
     * @param {string} query The query to get all elements.
     * @param {string} type The type of event the listener listen to.
     * @param {EventListenerOrEventListenerObject} listener The event listener function.
     * @param {undefined | boolean | AddEventListenerOptions} options The options argument sets listener-specific options.
     */
    public static removeEventAll(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    public static removeEventAll(query: string, type: keyof ElementEventMap, listener: (this: Element, ev: Event) => any, options?: boolean | EventListenerOptions | undefined): void;
    public static removeEventAll(query: string, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
        const allElements = document.querySelectorAll(query);
        for(const currentElement of allElements) {
            currentElement.removeEventListener(type, listener, options);
        }
    }
}