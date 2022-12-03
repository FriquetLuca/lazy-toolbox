#### [LazyFile](#lazyFile)

```ts
class LazyFile {
    static saveAs(fileName: string, content: string = ""): void;
}
```

An easy way to manage file from a browser.

Example:

```js
const { LazyFile } = require('@lazy-toolbox/client');
// Save a file with a specific content.
LazyFile.saveAs('newFile.txt', 'This is some content for this file.');
```
