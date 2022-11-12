#### [LazyClient](#lazyClient)
```ts
class LazyClient {
    constructor(host: string, port: number);
    registerJSONSender(fns: { (f:(packet: string, obj: any) => any): void }[]): void;
    registerJSONReciever(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void;
    sendJSON(packet: string, obj: any): void;
}
```

A lazy socket client to setup a websocket communication.
Note: You can't use `_packet` as property name.

Example:

```js
const { LazyClient } = require('@lazy-toolbox/client');
// Create our client handler, listening to the host at a specific port.
const socketClient = new LazyClient('localhost', 6060);
// Register an array of all sender functions.
socketClient.registerJSONSender([
    (sender) => {
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
    }
]);
// Register a packet as key and a function as value.
// Whenever the sever send a packet contained in the keys,
// it will trigger the function associated with it.
socketClient.registerJSONReciever({
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
socketClient.sendJSON('newPacket', {
    prop: "some value",
    prop2: 1010
});
```
