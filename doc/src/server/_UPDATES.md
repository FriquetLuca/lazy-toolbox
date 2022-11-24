## [Updates](#updates)

### v1.4.2 - Socket deeper

New modifications were introduced:
- Changed `LazyClient` interface to `LazyClientSocket` class for a more robust client handling.
- Handle unexpected client disconnection.

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
