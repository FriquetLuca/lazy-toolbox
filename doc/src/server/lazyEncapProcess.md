#### [LazyEncapProcess](#lazyEncapProcess)
```ts
class LazyEncapProcess {
    get process();
    constructor(root: string, processPath: string, nodeType: string | string[] = 'node', logInfo: boolean = true, showDates: boolean = true);
    async start(inject?: (process: any) => Promise<void>): Promise<void>;
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
