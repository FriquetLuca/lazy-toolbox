#### [LazyView](#lazyView)

```ts
class LazyView {
    static div: HTMLDivElement;
    static replaceInsert(actualElement: HTMLElement, targetElement: string, newHTMLContent: string): void;
    static getNodeContent(node: Node): string | null;
    static getNodeType(node: any): string;
    static inject(htmlDoc: string, toInject: {[name: string]: string}): string;
    static toNode(content: string): ChildNode | null;
    static toNodeList(content: string): NodeListOf<ChildNode>;
    static toArray(content: string): ChildNode[];
    static toText(content: ChildNode[]): string;
    static stringToHTML(str: string): HTMLElement;
}
```

A bunch of lazy ways to handle some HTML injection or extraction.

Example:

`index.html`:
```html
<div class="someDiv">
    <h1>A title<h1>
    <p>Some text
    <insert data="replaceUseless">
        Some HTML comments.
        <h2>YES A COMMENT !!! ... kinda.</h2>
    </insert>
    </p> I guess.
</div>
```
`main.js`:
```js
const { LazyView } = require('@lazy-toolbox/client');
const testView = document.querySelector('.someDiv');
LazyView.inject(testView, // Replace all insert[data='targetElement']
'replaceUseless', // Data to replace
'was replaced <span>!!</span>' // HTML to inject
);
/*
Result:
<div class="someDiv">
    <h1>A title<h1>
    <p>Some text
    was replaced <span>!!</span>
    </p> I guess.
</div>
*/
const result = LazyView.inject(testView.innerHTML, {
    'replaceUseless': 'was replaced <span>!!</span>'
}); // Same as before, but instead of modifying the DOM, we just
// get the HTML string back.

// Create a single child node from an HTML string.
const pTag = LazyView.toNode('<p>Hello world</p>');
document.body.appendChild(pTag);

// Create a bunch of child nodes from an HTML string.
const multiTag = LazyView.toNodeList('<p>Hello world2</p><p>Hello world 3</p>');
for(let tag of [...multiTag]) {
    document.body.appendChild(tag);
}

// Create a bunch of child nodes in an array from an HTML string.
// It's the equivalent of the previous [...multiTag].
const multiTagArray = LazyView.toArray('<p>Hello world2</p><p>Hello world 3</p>');

// Convert an array of child nodes back to an HTML string.
const multiTagArrayHTMLBack = LazyView.toText(multiTagArray);
```
