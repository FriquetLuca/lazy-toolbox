#### [LazyModLoader](#lazyModLoader)

```ts
class LazyModLoader {
    constructor(root: string, moduleFolder: string = "./");
    load(): {[filePath: string]: any};
    static isClass(v: any): boolean;
    static isFunction(v: any): boolean;
    static isArray(v: any): boolean;
    static isObject(v: any): boolean;
    static isScalar(v: any): boolean;
}
```

A module loader to load modules inside a directory.
It loads all `.js` files. and `.mjs` files as modules.

Example:

`myModule.js`:
```js
module.exports = (name) => {
    console.log(`Hello ${name}.`);
};
```
`subMod/mySubModule.js`:
```js
class MyClass {
    constructor(name) {
        this.name = name;
        this.hello();
    }
    hello() {
        console.log(`Hello ${this.name}.`);
    }
}
module.exports = MyClass;
```
`main.js`:
```js
const { LazyModLoader } = require('lazy-toolbox');
// Create a module loader.
const modLoader = new LazyModLoader(__dirname, './');
// Load all modules
const loadedMods = modLoader.load();
// Get all modules relative path without the extension
for(let loadedMod in loadedMods) {
    // Get the actual module
    const actualLoadedMod = loadedMods[loadedMod];
    // Check if the module is a class
    if(LazyModLoader.isClass(actualLoadedMod)) {
        // Do something with the class
        const newMod = new actualLoadedMod('test');
    }
    // Check if the module is a function
    else if(LazyModLoader.isFunction(actualLoadedMod)) {
        // Do something with the function
        actualLoadedMod('test');
    }
}
```