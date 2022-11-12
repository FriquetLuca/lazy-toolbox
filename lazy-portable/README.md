# Lazy Maker

> A NodeJS toolbox made for a lazy development of websites or even applications.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox) and the project on [NPM - Server toolbox](https://www.npmjs.com/package/lazy-toolbox) and [NPM - Client toolbox](https://www.npmjs.com/package/@friquet-luca/lazy-portable).

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Portable](#portable)
	    - [getType](#getType)
	    - [dateLog](#dateLog)
	    - [dateLogMS](#dateLogMs)
	    - [LazyMath](#lazyMath)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i @lazy-maker/portable
```
## [Updates](#updates)

### [v0.0.0 - Initial commit](#se-vo-o-o)

## [Documentation](#documentation)

This part explain all tools with examples if it's needed.

### [Portable](#portable)
#### [dateLog](#dateLog)
```ts
function dateLog(msg: any): string
```

Create a message with the time display up to the s.
It will be showned as `[HH:MM:SS] MY_MESSAGE`.

Example:

```js
const { dateLog } = require('@friquet-luca/lazy-shared');
console.log(dateLog("Hello world")); // [10:37:12] Hello world
```

#### [dateLogMS](#dateLogMs)
```ts
function dateLogMS(msg: any): string
```

Create a message with the time display up to the ms.
It will be showned as `[HH:MM:SS.DCM] MY_MESSAGE`.

Example:

```js
const { dateLogMS } = require('@friquet-luca/lazy-shared');
console.log(dateLogMS("Hello world")); // [10:37:12.123] Hello world
```

#### [getType](#getType)
```ts
function getType(parameter: any): string
```

Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.

Example:

```js
const { getType } = require('@friquet-luca/lazy-shared');
class Animal {
    constructor(name) {
        this.name = name;
    }
}
const x = Animal;
const y = [ 'a', 'b' ];
console.log(getType(x)); // class
console.log(getType(y)); // array
// Everything else is the same as typeof
```

#### [LazyMath](#lazyMath)

```ts
class LazyMath {
    static modulo(a: number, b: number): number;
    static frac(a: number): number;
    static saturate(a: number): number;
    static sum(k: number, n: number, f: (i: number) => number): number;
    static product(k: number, n: number, f: (i: number) => number): number;
    static isPrime(n: number): boolean;
    static step(n: number, x: number): number;
    static lerp(a: number, b: number, t: number): number;
    static unlerp(a: number, b: number, p: number): number;
    static binomialCoefficient(n: number, k: number): number;
    static derivative(x: number, f: (x: number) => number): number;
    static antiDerivative(x: number, f: (x: number) => number, subdivide: number = 1): number;
    static integral(a: number, b: number, f: (x: number) => number, subdivide: number = 1): number;
}
```

Add some lazy math that should have been available at first on JS.

Example:

```js
const { LazyMath } = require('@friquet-luca/lazy-shared');
// The JS modulo operator violate the property (a + n) mod n = a mod n.
// So we've implemented a modulo that doesn't violate it.
// JS modulo = a - ([a / b] * b)
// where [a / b] is the truncature of a / b.
// LazyMath.modulo = a - (⌊a / b⌋ * b)
// where ⌊a / b⌋ is the floor of a / b.

// Positive value have the same answer
console.log(LazyMath.modulo(4, 3)); // 1
console.log(4 % 3) // 1
// The JS modulo problem lies over here.
console.log(LazyMath.modulo(-4, 3)); // 2
console.log(-4 % 3); // -1

// Get the leftover to obtain an integer less or equal to n.
console.log(LazyMath.frac(2.345)); // 0.345
console.log(LazyMath.frac(-2.345)); // 0.655

// Get a value between 0 and 1
console.log(LazyMath.saturate(2.345)); // 1

// sum and product are made to handle iterative function for sum and product.
// 1 + 2 + 3 + 4 = 10
console.log(LazyMath.sum(1, 4, (i) => i));
// 1 * 2 * 3 * 4 * 5 = 5! = 120
console.log(LazyMath.product(1, 5, (i) => i));

// A method to test if a number is prime.
// It's not an optimal method, it can be slow as hell but you'll be 100% sure it's a prime number.
console.log(LazyMath.isPrime(7)); // True
console.log(LazyMath.isPrime(24)); // False

// Return 1 if x is gequal to n, otherwise n.
console.log(LazyMath.step(0.3, 0.5)); // 0.3
console.log(LazyMath.step(0.4, 0.5)); // 0.4
console.log(LazyMath.step(0.5, 0.5)); // 1

// Do a linear interpolation between a and b using the parameter t for the interpolated distance.
console.log(LazyMath.lerp(1, 3, 0.5)); // 2

// Get the interpolated distance of p on the line from a to b.
console.log(LazyMath.unlerp(1, 3, 2)); // 0.5

// Compute the number of ways to choose an unordered subset of k elements from a fixed set of n elements.
console.log(LazyMath.binomialCoefficient(5, 2)); // 10

// Evaluate the derivative of a function f at a point x. d/dx f(x)
// For this example, we use the function f(x) = x² and evaluate it's derivative at x = 3.
// The result should be 6 if the approximation was perfect.
console.log(LazyMath.derivative(3, (x) => { return x * x; })); // 5.921189464667501

// Evaluate the anti-derivative of a function f' at a point x.
// For this example, we use the function f'(x) = 2x and evaluate it's anti derivative at x = 3.
// The result should be 9 if the approximation was perfect.
console.log(LazyMath.antiDerivative(3, (x) => { return 2 * x; })); // 8.819999999999999

// Evaluate the area under the curve of a function f' from a to b.
// The result should be 15 if the approximation was perfect.
console.log(LazyMath.integral(1, 4, (x) => { return 2 * x; })); // 14.819999999999997
```


