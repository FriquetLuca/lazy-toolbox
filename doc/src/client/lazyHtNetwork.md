#### [LazyHtNetwork](#lazyHtNetwork)

```ts
class LazyHtNetwork {
    // Last update at version: 1.1.0
    static async post(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void>;
    // Last update at version: 1.1.0
    static async postJSON(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void>;
    // Last update at version: 1.1.0
    static async getJSON(path: string, execute: (json: Promise<any>) => void = (e) => { }, error = (e: any) => console.error(e)): Promise<void>;
}
```

A lazy way to handle JS fetch API.

Example:

```js
// Everything in LazyHtNetwork is async, take that into account.
const { LazyHtNetwork } = require('@friquet-luca/lazy-portable');
// Post form datas (for PHP as example)
// Takes a callback from the server for anything.
LazyHtNetwork.post('http://somewhere.com/somethingToPost/', {
    'username': document.querySelector('.someInput').value
}, (json) => { // Server gave us datas back
    console.log(JSON.stringify(json));
});

// LazyHtNetwork.postJSON work the same but only post a .json file at the end, not an HTML form.
// It can't send picture or whatever blob datas could be needed.

// Get a JSON file somewhere.
LazyHtNetwork.getJSON('http://somewhere.com/jsonFileToGet/', (json) => {
    console.log(JSON.stringify(json)); // The json we got.
});
```
