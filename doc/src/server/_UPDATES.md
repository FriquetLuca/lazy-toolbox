## [Updates](#updates)

### v1.4.11 - Route lazier

New content were added:
- Add `contentType` static method in `LazyRouter`.

New modifications were introduced:
- Implement a Fastify type for `LazyRouter`, making it no longer `any` type.

### v1.4.10 - Session

New content were added:
- Add `initializeSession` method in `LazyRouter`.

### v1.4.9 - Loading views on routes

New content were added:
- Add `reloadViews` in `LazyRouter`.
- Add `view` in `LazyRouter`.

New modifications were introduced:
- Changed parameters of all routes to `(route: string, fastify: any, router: LazyRouter)` so the routes can access the router directly instead of being blind.

### v1.4.6 - Socket deeper

New content were added:
- Add `noError` method in `LazySocket`.

New modifications were introduced:
- Changed `LazyClient` interface to `LazyClientSocket` class for a more robust client handling.
- Handle unexpected client disconnection.

### v1.4.1 - Lazy release

Stable version.

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
