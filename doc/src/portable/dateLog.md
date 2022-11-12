#### [dateLog](#dateLog)
```ts
function dateLog(msg: any): string
```

Create a message with the time display up to the s.
It will be showned as `[HH:MM:SS] MY_MESSAGE`.

Example:

```js
const { dateLog } = require('@lazy-toolbox/portable');
console.log(dateLog("Hello world")); // [10:37:12] Hello world
```
