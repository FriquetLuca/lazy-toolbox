![Lazy Toolbox](/doc/img/logo.png)

# Lazy Toolbox - Server

> A NodeJS toolbox made for a lazy development on server part.

Find the full project on [GitHub - Lazy Toolbox](https://github.com/FriquetLuca/lazy-toolbox).

Made to setup a server as fast as possible, the lazy toolbox is made so you have as few as possible to write to get things done.

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Server](#server)
	    - [LazyModLoader](#lazyModLoader)
	    - [LazyFS](#lazyFS)
	    - [LazyWatcher](#lazyWatcher)
	    - [LazyNetList](#lazyNetList)
	    - [LazyEncapProcess](#lazyEncapProcess)
	    - [LazyRouter](#lazyRouter)
	    - [LazySocket](#lazySocket)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i lazy-toolbox
```

## [Updates](#updates)

### v1.4.1 - Lazy release

New modifications were introduced:
- Add `clientID` in parameters for `onMessages`, `onConnect` and `onDisconnect` modules.

### v1.3.9 - LazySocket Sharing

New content were added:
- Add `getData`, `setData` and `deleteData` methods to `LazySocket`.
- Add `process` property to `LazyEncapProcess`.
- Add optional `inject` argument to `start` method in `LazyEncapProcess`.

New modifications were introduced:
- Change the `LazyEncapProcess`'s constructor.
- Change `client` parameters of type `Websocket.Websocket` to `clientID` of type `number` in disconnect socket module for `LazySocket` since the socket doesn't exist anymore at disconnect.

New patches were introduced:
- Patch `clientCount` method from `LazySocket` to make it faster.
- Patch eternal `created` event on `FileWatcher`.

### v1.3.0 - Project repack

Full project repack.
Deprecated all previous versions support, getting rid of all previous known bugs.


## [Documentation](#documentation)

This part explain all tools with examples if it's needed.

### [Server](#server)
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

#### [LazyFS](#lazyFS)
```ts
class LazyFS {
    static getAllInDir(p: string, a: string[] = []): string[];
    static getAllFilesInDir(p: string): string[];
    static getAllDirsInDir(p: string): string[];
    static deleteDirectory(directoryPath: string): void;
    static delete(anyPath: string): void;
    static async readFile(filePath: string, options?: { encoding?: null | undefined; flag?: string | undefined; } | null | undefined): Promise<Buffer>;
}
```

A lazy file stream for some lazy recursive functions.

Example:

`File explorer`:
```fileExplorer
- Root
    - FolderA
        - FolderC
        - script.js
    - FolderB
    - file.exe
```
`main.js`:
```js
const { LazyFS } = require('lazy-toolbox');
// Get everything inside a directory
const everything = LazyFS.getAllInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA
C:\Somewhere\...\Root\FolderA\FolderC
C:\Somewhere\...\Root\FolderA\script.js
C:\Somewhere\...\Root\FolderB
C:\Somewhere\...\Root\file.exe
*/
for(let path of everything) {
    console.log(path);
}
// Get all files inside a directory
const files = LazyFS.getAllFilesInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA\script.js
C:\Somewhere\...\Root\file.exe
*/
for(let path of files) {
    console.log(path);
}
// Get all directories inside a directory
const directories = LazyFS.getAllFilesInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA
C:\Somewhere\...\Root\FolderA\FolderC
C:\Somewhere\...\Root\FolderB
*/
for(let path of directories) {
    console.log(path);
}
// Delete the current directory, it's files and all it's sub-directories and sub-files.
LazyFS.deleteDirectory(__dirname);
// LazyFS.delete has the same behaviour as LazyFS.deleteDirectory
// except that LazyFS.delete don't care if it's a file or a directory it
// needs to remove.
```

#### [LazyModLoader](#lazyModLoader)

```ts
class LazyModLoader {
    constructor(root: string, moduleFolder: string = "./");
    load(): {[filePath: string]: any};
    static isClass(v: any): boolean;
    static isFunction(v: any): boolean;
    static isArray(v: any): boolean;
    static isObject(v: any): boolean;
    static isScalar(v: any): boolean;
}
```

A module loader to load modules inside a directory.
It loads all `.js` files. and `.mjs` files as modules.

Example:

`myModule.js`:
```js
module.exports = (name) => {
    console.log(`Hello ${name}.`);
};
```
`subMod/mySubModule.js`:
```js
class MyClass {
    constructor(name) {
        this.name = name;
        this.hello();
    }
    hello() {
        console.log(`Hello ${this.name}.`);
    }
}
module.exports = MyClass;
```
`main.js`:
```js
const { LazyModLoader } = require('lazy-toolbox');
// Create a module loader.
const modLoader = new LazyModLoader(__dirname, './');
// Load all modules
const loadedMods = modLoader.load();
// Get all modules relative path without the extension
for(let loadedMod in loadedMods) {
    // Get the actual module
    const actualLoadedMod = loadedMods[loadedMod];
    // Check if the module is a class
    if(LazyModLoader.isClass(actualLoadedMod)) {
        // Do something with the class
        const newMod = new actualLoadedMod('test');
    }
    // Check if the module is a function
    else if(LazyModLoader.isFunction(actualLoadedMod)) {
        // Do something with the function
        actualLoadedMod('test');
    }
}
```
#### [LazyNetList](#lazyNetList)
```ts
class LazyNetList {
   static internalIPv4(): string[];
   static externalIPv4(): string[];
   static IPv4(): string[];
}
```

A lazy way to access some network interfaces.

Example:

```js
const { LazyNetList } = require('lazy-toolbox');
// Get all IP v4 inside an array
const IPs = LazyNetList.IPv4();
// Get all internal IP v4 inside an array
const iIPs = LazyNetList.internalIPv4();
// Get all external IP v4 inside an array
const eIPs = LazyNetList.externalIPv4();
```

#### [LazyRouter](#lazyRouter)
```ts
class LazyRouter {
    // Last update at version: 1.1.2
    constructor(host: string, port: number, root: string, assetDir: string, db: any = undefined);
    async loadAssets(): Promise<void>;
    // Last update at version: 1.1.1
    async registerPaths(routesFolder: string): Promise<void>;
    // New on version: 1.1.1
    async loadStaticRoutes(route: string, staticDirectory: string): Promise<void>
    start(): void;
    // New on version: 1.1.2
    setDB(db: any): void;
}
```

A lazy routing setup for lazy people based on `fastify` and `@fastify/static`.

Example:

`File explorer`:
```fileExplorer
- Root
    - public
        - assets
            - img.png
    - routes
        - customRoute.js
    - app.js
```
`app.js`:
```js
const path = require('path');
const { LazyRouter } = require('lazy-toolbox');
// A little setup to make it async while loading all ours things.
const setupRouter = async () => {
    // Set a new router on the localhost, listening on port 3000.
    // The assets directory will be the static asset directory of the server.
    const newRouter = new LazyRouter('localhost', 3000, __dirname, './public/assets');
    // Load all assets static routes.
    // Note: The route name will always be ./assets/ on the server side.
    // localhost:3000/assets/
    // It's the equivalent of :
    // await this.loadStaticRoutes('/assets/', './public/assets');
    await newRouter.loadAssets();
    // Load all custom routes modules inside the routes folder
    await newRouter.registerPaths('./routes');
    // Registered routes:
    // localhost:3000/customRoute
    newRouter.start();
}
// Let's just run this.
setupRouter();
```
`routes/customRoute.js`:
```js
// Get the folder relative path as route
module.exports = (route, fastify, db) => {
    // A simple implementation for lazyness incarned.
    fastify.get(route, async (request, reply) => {
        // Setup your fastify route.
    });
}
```

#### [LazySocket](#lazySocket)
```ts
interface FolderMods {
    onConnect: string;
    onMessages: string;
    onDisconnect: string;
}
interface LazyClient {
    id: number;
}
class LazySocket {
    constructor(port: number, root: string, paths: FolderMods = { onConnect:'./onConnect', onMessages: './onMessages', onDisconnect: './onDisconnect' }, logInfo: boolean = true, showDates: boolean = true, db: any = undefined);
    connect(): void;
    sendToAll(packet: string, data: any): void;
    sendToAllExceptSender(packet: string, socket: WebSocket.WebSocket, data: any): void;
    clientCount(): number;
    getClient(socket: WebSocket.WebSocket): LazyClient;
    getServer(): WebSocket.Server<WebSocket.WebSocket>;
    setDB(db: any): void;
    getData(label: string): any;
    setData(label: string, data: any): void;
    deleteData(label: string): void;
    static sendToClient(packet: string, socket: WebSocket.WebSocket, data: any): void;
    static closeClient(socket: WebSocket.WebSocket): void;
}
```

A lazy socket implementation to handle websocket.
All the logic lies inside three folders that you can choose.
Functions are gonna be executed depending on the packet name given by a `LazyClient`.

Example:

`File explorer`:
```fileExplorer
- Root
    - onConnect
        - connect.js
    - onMessages
        - test_msg.js
    - onDisconnect
        - disconnect.js
    - app.js
```
`app.js`
```js
const { LazySocket } = require('lazy-toolbox');
// Create a websocket on port 6060
const socketServer = new LazySocket(6060, __dirname);
// Start all connections
socketServer.connect();
```
`onConnect/connect.js`
```js
// Executed whenever a client connect to the server.
module.exports = (server, clientSocket, db, clientID) => {
    // Do something when a client connect to the server.
};
```
`onMessages/test_msg.js`
```js
// This packet name is: test_msg
// If it was inside a folder called myFolder, then the
// packet would be called: myFolder/test_msg
module.exports = (server, clientSocket, data, db, clientID) => {
    // Send a packet from the server to all clients.
    server.sendToAll('message_for_all', {
        author: data.author,
        msg: data.msg
    });
};
```
`onDisconnect/disconnect.js`
```js
// Executed whenever a client disconnect from the server.
module.exports = (server, clientID, db) => {
    // Do something if a client disconnect from the server.
};
```
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

