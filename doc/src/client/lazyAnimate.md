#### [LazyAnimate](#lazyAnimate)
```ts
class LazyAnimate {
    static loadDefault(): void;
    static details(...detailsElements: HTMLDetailsElement[]): void;
}
```

A lazy way to animate some content.

Example:

`main.js`
```js
const { LazyAnimate } = require('@lazy-toolbox/client');
LazyAnimate.loadDefault();
```
`index.html`
```html
<details animated shr_duration="300" shr_ease="ease-out" exp_duration="300" exp_ease="ease-out">
    <summary>A dummy title.</summary>
    <content>Some inner content that will have a smooth transition now.</content>
</details>
```