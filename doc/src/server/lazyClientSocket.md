#### [LazyClientSocket](#lazyClientSocket)
```ts
class LazyClientSocket {
    get IsReconnected(): boolean;
    get ID(): number;
    get IP(): string;
    get Socket(): WebSocket.WebSocket;
    setNewSocket(socket: WebSocket.WebSocket): void;
    setData(label: string, data: any): void;
    getData(label: string): any;
    removeData(label: string): void;
}
```

Offer a way to handle a client for a `LazySocket`.

Example:
```js
// Executed whenever a client connect to the server.
module.exports = (server, client, db) => {
    client.setData('myData', 125);
    console.log(client.getData('myData'));
    client.removeData('myData');
};
```