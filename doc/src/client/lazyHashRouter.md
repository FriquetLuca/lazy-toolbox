#### [LazyHashRouter](#lazyHashRouter)

```ts
interface getter {
    page: string | undefined;
    result: any;
}
class LazyHashRouter {
    static getAllUrlParams(url?: string): getter;
    static setAllUrlParams(page: string, object: {[name: string]: any}): string;
}
```

A lazy way to handle url parameters on a page.

Example:

```js
const { LazyHashRouter } = require('@lazy-toolbox/client');
const myObject = {
    id: 123,
    name: "Someone",
    family: [
        'sister', 'brother', 'son', 'mom', 'dad'
    ]
};
const actualPage = LazyHashRouter.getAllUrlParams();
if(actualPage.page !== "welcome") {
    const urlParams = LazyHashRouter.setAllUrlParams("welcome", myObject);
    window.location.href = `./${urlParams}`;
}
console.log(`Welcome ${actualPage.name}.`);
```
