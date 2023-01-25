#### [LazyDOM](#lazyDOM)
```ts

```

Example:

```html
<div id="app"></div>
```

```js
const { LazyDOM } = require('@lazy-toolbox/client');

// Create a reactive component.
const app = LazyDOM.react({
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

// Observe changes in the DOM from the body of the document.
LazyDOM.observe(document.body, (elements: MutationRecord[]) => {
    for(const element of elements) {
        for(const currentNode of element.addedNodes) {
            // Show only new added node that is an HTML element
            if(currentNode.nodeType === Node.ELEMENT_NODE) {
                console.log(currentNode);
            }
        }
    }
});
// After 3 seconds, update the data and render a new UI
setTimeout(function () {
    app.todo.push('Task E');
}, 3000);
```