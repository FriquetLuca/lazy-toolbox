#### [LazyClient](#lazyClient)
```ts
class LazyClient {
    constructor(host: string, port: number);
    send(packet: string, obj: any): void.
    sender(f: { (f:(packet: string, obj: any) => any): void }): void;
    senders(...fns: { (f:(packet: string, obj: any) => any): void }[]): void;
    hook(packet: string, fn: (obj: any, websocket: WebSocket) => void): void;
    hooks(...hooking: {packet: string, fn: (obj: any, websocket: WebSocket) => void}[]): void;
    hookObject(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void;
    start(): void;
    disconnect(): void;
}
```

A lazy socket client to setup a websocket communication.
Note: You can't use `_packet` as property name.

Example:

```js
const { LazyClient } = require('@lazy-toolbox/client');
// Create our client handler, listening to the host at a specific port.
const socketClient = new LazyClient('localhost', 6060);
// Register a sender functions.
socketClient.sender((sender) => {
    const someTextArea = document.querySelector('.someClass');
    someDiv.addEventListener('keyup', (e) => {
        e.preventDefault();
        // Send a packet called newPacket and some value to the server.
        // This method is given to us by the LazyClient itself
        // when registering all our sender.
        sender('newPacket', {
            prop: "some value",
            prop2: 1010
        });
    });
});
// Register a packet as key and a function as value.
// Whenever the sever send a packet contained in the keys,
// it will trigger the function associated with it.
socketClient.hookObject({
    // Create a receiver that will execute a function everytime
    // the server send a packet called message.
    'message': (data) => {
        console.log(JSON.stringify(data)); // Show the data received
    },
    // Create a receiver that will execute a function everytime
    // the server send a packet called uwu.
    'uwu': () => { console.log("owo"); }
});
// Send a packet called newPacket to the server with a bunch of values.
socketClient.send('newPacket', {
    prop: "some value",
    prop2: 1010
});
```
