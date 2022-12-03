#### [LazyTabularTextArea](#lazyTabularTextArea)

```ts
class LazyTabularTextArea {
    constructor(el: HTMLTextAreaElement, tabLength: number = 4);
}
```

Add support for tabulation in a text area.

Example:

```js
const { LazyTabularTextArea } = require('@lazy-toolbox/client');
// Add support for tabulation on a text area.
new LazyTabularTextArea(document.querySelector('.aTextArea'));
```
