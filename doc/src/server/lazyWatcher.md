#### [LazyWatcher](#lazyWatcher)
```ts
interface FileEvent {
    file: string;
    eventType: string;
}
class LazyWatcher {
    constructor(root: string, timeout: number = 200, excludePaths: string[] = [], excludeEventTypes: string[] = []);
    checkFileChanges(): FileEvent[];
    async watchFiles(fn: (events: FileEvent[]) => Promise<void>): Promise<void>;
    stop(): void;
    skipChanges(): void;
}
```

A lazy watcher that will watch files by not relying on `fs.watch` instability but instead on a timeout approach.

Example:

`manualWatcher.js`:
```js
const { LazyWatcher } = require('lazy-toolbox');
// Create a watcher, watching our directory
const newWatcher = new LazyWatcher(__dirname);
// Set a timeout to check any changes in the next minute.
setTimeout(() => {
    // Check every changes
    const changes = newWatcher.checkFileChanges();
    for(let changeEvent of changes) {
        console.log(`Event ${changeEvent.eventType} occured on: ${changeEvent.file}`);
    }
}, 60000); // Check changes after a minutes.
```
`timeoutWatcher.js`:
```js
const { LazyWatcher } = require('lazy-toolbox');
// Create a watcher, watching our directory with a timeout of 10s.
const newWatcher = new LazyWatcher(__dirname, 10000);
// Create a counter, just to show a use case of stop function
let i = 0;
// It will trigger every event that occured the next 10s, then it will wait again until it need to check for changes.
newWatcher.watchFiles(async (changes) => {
    if(i >= 10) {
        // Stop the watcher.
        newWatcher.stop();
    }
    // Show all events:
    for(let changeEvent of changes) {
        console.log(`Event ${changeEvent.eventType} occured on: ${changeEvent.file}`);
    }
    i++;
    // If you created some files in this function, it would have been useful to use
    // newWatcher.skipChanges();
    // So the watcher would just skip all your newly made files or modifications
    // for the next watch.
});
```
