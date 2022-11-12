#### [LazyEncapProcess](#lazyEncapProcess)
```ts
class LazyEncapProcess {
    constructor(root: string, processPath: string, logInfo: boolean = true, showDates: boolean = true);
    // Last update at version: 1.1.2
    async start(): Promise<void>;
    // Last update at version: 1.1.2
    async stop(): Promise<void>;
}
```

A lazy way to encapsulate a node process.

Example:

```js
const { LazyEncapProcess } = require('lazy-toolbox');
// Create a node process with the script `server.js`.
// By default, we get back on the console everything that happened on this node.
const newNodeProcess = new LazyEncapProcess(__dirname, 'server.js');
// Run the script in the background.
newNodeProcess.start();
```
