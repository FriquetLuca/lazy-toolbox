#### [LazyReact](#lazyReact)
```ts
interface LazyReactOptions {
    selector: string;
    data: {[label: string]: any};
    component: (data: {[label: string]: any}) => string;
}
class LazyReact {
    component: (data: {[label: string]: any}) => string;
    debounce: number | null;
    data: {[label: string]: any};
    constructor(options: LazyReactOptions);
    render(): void;
}
```

A lazy way to make reactive components.

Example:

```js
const { LazyReact } = require('@lazy-toolbox/client');
const app = new LazyReact({
    selector: '#app',
    data: {
        head: 'Task to achieve',
        todo: ['Task A', 'Task B', 'Task C', 'Task D']
    },
    component: function (props) {
        return `
            <h1>${props.head}</h1>
            <ul>
                ${props.todo.map(function (tdo) {
                    return `<li>${tdo}</li>`;
                }).join('')}
            </ul>`;
    }
});
// Render a UI from the component.
app.render();
// After 3 seconds, update the data and render a new UI.
setTimeout(function () {
    app.data.todo.push('Task E');
}, 3000);
```