#### [dateLogMS](#dateLogMs)
```ts
function dateLogMS(msg: any): string
```

Create a message with the time display up to the ms.
It will be showned as `[HH:MM:SS.DCM] MY_MESSAGE`.

Example:

```js
const { dateLogMS } = require('@friquet-luca/lazy-shared');
console.log(dateLogMS("Hello world")); // [10:37:12.123] Hello world
```
