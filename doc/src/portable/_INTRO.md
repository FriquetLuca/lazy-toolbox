<p align="center">
    <img src="/doc/img/logo.png" alt="logo" height="500" width="500">
</p>

<p align="center">
    <img  src="https://img.shields.io/badge/license-MIT-green">
    <img  src="https://img.shields.io/badge/typescript-v4.8.4-orange">
</p>

# Lazy Toolbox - Portable

> A NodeJS toolbox made for a lazy development anywhere you need.

Made to handle a bunch of cases that have to be handle on either a server or a client part.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox).

There is also a bundle for thoses who don't want to use NodeJS.
To use it, just add in your HTML:
```HTML
<script src="./lazyPortable.js" type="module"></script>
```
You can change the type module if needed.

Suppose you have a `test.js` script in which you want to use the `lazyPortable.js` bundle like this for example:
```HTML
<script src="./test.js" defer></script>
```
You can use the `LazyPortable` global variable to access all of the `LazyPortable` classes.
Example:
```js
console.log(LazyPortable.LazyMath.modulo(3, 2));
```