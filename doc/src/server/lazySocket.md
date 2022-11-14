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
module.exports = (server, clientSocket, db) => {
    // Do something when a client connect to the server.
};
```
`onMessages/test_msg.js`
```js
// This packet name is: test_msg
// If it was inside a folder called myFolder, then the
// packet would be called: myFolder/test_msg
module.exports = (server, clientSocket, data, db) => {
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
module.exports = (server, clientSocket, db) => {
    // Do something if a client disconnect from the server.
};
```