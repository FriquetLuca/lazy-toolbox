#### [LazyInteractivity](#lazyInteractivity)
```ts
class LazyInteractivity {
    static loadDefault(): void;
    static dualstate(...inputsElements: HTMLInputElement[]): void;
    static tristate(...inputsElements: HTMLInputElement[]): void;
}
```

A lazy way to make interactive elements.

Example:

`main.js`
```js
const { LazyInteractivity } = require('@lazy-toolbox/client');
LazyInteractivity.loadDefault();
const dualstate = document.querySelector('input[dualstate]');
dualstate.addEventListener('change', (e) => {
    console.log(e.target.value);
});
const tristate = document.querySelector('input[tristate]');
tristate.addEventListener('change', (e) => {
    console.log(e.target.value);
});
```
`index.html`
```html
<!--Since it's a state, it will be triggering a onchange event if the state change-->
<input dualstate type="text">
<br>
<!--Since it's a state, it will be triggering a onchange event if the state change-->
<input tristate type="text">
```