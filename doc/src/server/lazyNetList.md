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
