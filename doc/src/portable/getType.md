#### [getType](#getType)
```ts
function getType(parameter: any): string
```

Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.

Example:

```js
const { getType } = require('@friquet-luca/lazy-shared');
class Animal {
    constructor(name) {
        this.name = name;
    }
}
const x = Animal;
const y = [ 'a', 'b' ];
console.log(getType(x)); // class
console.log(getType(y)); // array
// Everything else is the same as typeof
```
