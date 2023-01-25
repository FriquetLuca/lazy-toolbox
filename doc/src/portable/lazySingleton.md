#### [LazySingleton](#lazySingleton)
```ts
class LazySingleton {
    protected constructor();
    static instanceFactory<T extends LazySingleton>(this: new (...args: any[]) => T, ...args: any[]): T;
    static getInstance<T extends LazySingleton>(): T;
}
```

A lazy singleton representation to not bother about doing it at all nor ever.

Example:
```js
const { LazySingleton } = require('@lazy-toolbox/portable');
class ExampleSingleton extends LazySingleton {
    constructor(name) {
        super();
        this.name = name;
    }
    sayName() {
        return `My name is ${this.name}`;
    }
}
const myExampleSingleton = new ExampleSingleton.instanceFactory("Amazing");
console.log(myExampleSingleton.sayName(myExampleSingleton));
```