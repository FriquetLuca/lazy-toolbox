#### [LazyDoc](#lazyDoc)

```ts
interface HTMLTag {
    id?: string;
    class?: string[];
    childs?: HTMLElement[];
    // New on version: 0.0.7
    innerHTML?: string;
    attributes?: {[name: string]: string};
    eventListeners?: {[name: string]: (e: Event)=>void};
}
class LazyDoc {
    static newTag(tagName: string, element?: HTMLTag): HTMLElement;
    static newTag<K extends keyof HTMLElementTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementTagNameMap[K];
    static newTag<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementDeprecatedTagNameMap[K];
}
```

A lazy way to write `document.something`.

Example:

```js
const { LazyDoc } = require('@lazy-toolbox/client');
// document.createElement makes dev cry a lot.
// It's just an easy way to make it work.
// It could look ugly, but useful for a lot of cases.
const newDiv = LazyDoc.newTag({
    // The HTML element tag name
    tag: 'div',
    // Set the id
    id: 'uwu',
    // Set some classes
    class: [
        'className',
        'anotherClassName'
    ],
    // Add some childs if we want
    childs: [
        LazyDoc.newTag({tag: 'p'})
    ],
    // Set some attributes
    attributes: {
        'value': '0',
        'owo': 'uwu'
    },
    // Add some event listener if needed
    eventListeners: {
        'click': (e) => {
            console.log("Clicked on div!");
        }
    }
});
/*
Same as creating the element:
<div id="uwu" class="className anotherClassName" value="0" owo="uwu">
    <p></p>
</div>
*/
```
