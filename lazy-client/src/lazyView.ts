/**
 * A bunch of lazy ways to handle some HTML injection or extraction.
 * @function replaceInsert Replace entirely an HTML <insert data="MyDataName">Just some HTML comment code</insert> to any value contained inside the `newHTMLContent`.
 * @function inject Inject a bunch of datas inside a HTML document.
 * @function toNode Convert some HTML content into a ChildNode (if possible). If there's multiple HTML elements, only the first one will be returned.
 * @function toNodeList Convert some HTML content to a NodeListOf<ChildNode>.
 * @function toArray Convert some HTML content to an array of ChildNode.
 * @function toText Convert an array of ChildNode to string.
 */
export class LazyView {
    /**
     * A div element for native DOM handling.
     */
    public static div: HTMLDivElement;
    /**
     * Get the innerHTML of the div element.
     * @returns The innerHTML of the div element.
     */
    private static extractHTML(): string {
        const result = LazyView.div.innerHTML;
        LazyView.div.innerHTML = '';
        return result;
    }
    /**
     * Replace entirely an HTML <insert data="MyDataName">Just some HTML comment code</insert> to any value contained inside the `newHTMLContent`.
     * @param {HTMLElement} actualElement An HTML element.
     * @param {string} targetElement The value's name contained inside an insert tag.
     * @param {string} newHTMLContent The content to inject.
     */
    public static replaceInsert(actualElement: HTMLElement, targetElement: string, newHTMLContent: string): void {
        while(true) {
            let i, tmp, elm, last;
            // find our target
            const target = actualElement.querySelector(`insert[data=${targetElement}]`); 
            if(!target) {
                break;
            }
            // create a temporary div or tr (to support tds)
            tmp = document.createElement(newHTMLContent.indexOf('<td')!=-1?'tr':'div');
            // fill that div with our html, this generates our children
            tmp.innerHTML = newHTMLContent;
            // step through the temporary div's children and insertBefore our target
            i = tmp.childNodes.length;
            last = target;
            if(target.parentNode) {
                while(i--){
                    target.parentNode.insertBefore((elm = tmp.childNodes[i]), last);
                    last = elm;
                }
                /// remove the target.
                target.parentNode.removeChild(target);
            }
        }
    }
    /**
     * Inject a bunch of datas inside a HTML document.
     * @param {string} htmlDoc The HTML document given as a string.
     * @param {{[name: string]: string}} toInject The data to inject inside the document.
     * @returns {string} The new HTML string with all the injections done.
     */
    public static inject(htmlDoc: string, toInject: {[name: string]: string}): string {
        LazyView.div.innerHTML = htmlDoc;
        for(const inject in toInject) {
            LazyView.replaceInsert(LazyView.div, inject, toInject[inject]);
        }
        return LazyView.extractHTML();
    }
    /**
     * Convert some HTML content into a ChildNode (if possible). If there's multiple HTML elements, only the first one will be returned.
     * @param {string} content The HTML to convert into a ChildNode.
     * @returns {ChildNode | null} The ChildNode made from the HTML string.
     */
    public static toNode(content: string): ChildNode | null {
        LazyView.div.innerHTML = content;
        const node = LazyView.div.firstChild;
        LazyView.div.innerHTML = '';
        return node;
    }
    /**
     * Convert some HTML content to a NodeListOf<ChildNode>.
     * @param {string} content The HTML to convert into a ChildNode.
     * @returns {NodeListOf<ChildNode>} The NodeListOf<ChildNode> made from the HTML string.
     */
    public static toNodeList(content: string): NodeListOf<ChildNode> {
        LazyView.div.innerHTML = content;
        const nodes = LazyView.div.childNodes;
        LazyView.div.innerHTML = '';
        return nodes;
    }
    /**
     * Convert some HTML content to an array of ChildNode.
     * @param {string} content The HTML to convert into a ChildNode.
     * @returns {ChildNode[]} The array of ChildNode made from the HTML string.
     */
    public static toArray(content: string): ChildNode[] {
        LazyView.div.innerHTML = content;
        const nodes = [...LazyView.div.childNodes];
        LazyView.div.innerHTML = '';
        return nodes;
    }
    /**
     * Convert an array of ChildNode to string.
     * @param {ChildNode[]} content The array of ChildNode to convert.
     * @returns {string} The string made with the array of ChildNode.
     */
    public static toText(content: ChildNode[]): string {
        for(const node of content) {
            LazyView.div.appendChild(node);
        }
        return LazyView.extractHTML();
    }
}
try {
    LazyView.div = document.createElement('div');
} catch(e) {}