![Lazy Toolbox](/doc/img/logo.png)

# Lazy Toolbox - Portable

> A NodeJS toolbox made for a lazy development anywhere you need.

Made to handle a bunch of cases that have to be handle on either a server or a client part.

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Portable](#portable)
	    - [dateLog](#dateLog)
	    - [dateLogMS](#dateLogMs)
	    - [getType](#getType)
	    - [LazyDataGraph](#lazyDataGraph)
	    - [LazyMapper](#lazyMapper)
	    - [LazyMath](#lazyMath)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i @lazy-toolbox/portable
```

## [Updates](#updates)

### v0.0.2 - Lazy Mapping

New content was added:
- Add `LazyMapper` class for data filtering.
- Add `LazyDataGraph` class for tangential analysis of graphs.
- Add `combinationArrayNRNO` function to `LazyMath`.

### v0.0.0 - Initial commit



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
const { dateLog } = require('@lazy-toolbox/portable');
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
const { dateLogMS } = require('@lazy-toolbox/portable');
console.log(dateLogMS("Hello world")); // [10:37:12.123] Hello world
```

#### [getType](#getType)
```ts
function getType(parameter: any): string
```

Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.

Example:

```js
const { getType } = require('@lazy-toolbox/portable');
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

#### [LazyDataGraph](#lazyDataGraph)
```ts
interface GraphPoint {
    value: number;
    label: string;
    increasePercent?: number;
    localMean?: number;
    localVariance?: number;
}
class LazyDataGraph {
    constructor(...datas: GraphPoint[]);
    get points(): GraphPoint[];
    set points(pts: GraphPoint[]);
    isTangentGraph(): boolean;
    getTangentGraph(): LazyDataGraph;
    generateSlope(): GraphPoint[];
}
```

A non-visual graph to analyze variation in datas.

Example:

```js
const { LazyDataGraph } = require('@lazy-toolbox/portable');
// Create the graph
const lazyGraph = new LazyDataGraph(
    // Set an ordered bunch of points
    {label:'d1', value:100},
    {label:'d2', value:100},
    {label:'d3', value:200},
    {label:'d4', value:150},
    {label:'d5', value:100}
);
// Generate the tangent of the graph to see the differentiation in the graph
const tangentGraph = lazyGraph.generateSlope();
// Just showing what was made on the way.
for(let tanPt of tangentGraph) {
    console.log(`- ${tanPt.label}: [value: ${tanPt.value}, increasePercent: ${tanPt.increasePercent}, localMean: ${tanPt.localMean}, localVariance: ${tanPt.localVariance}]`);
}
/* Result:
- d1-d2: [value: 0, increasePercent: 0.0 ]
- d2-d3: [value: 100, increasePercent: 2.0 ]
- d3-d4: [value: -50, increasePercent: -0.25 ]
- d4-d5: [value: -50, increasePercent: -0.33 ]
*/
```

#### [LazyMapper](#lazyMapper)
```ts
class LazyMapper {
    static filterData<T>(data: any, defaultValue: T, transform: (d: any) => T, filter: (d: T) => T): T;
    static defaultData<T>(data: any, defaultValue: T, transform: (d: any) => T): T;
    static boolean(data: any): boolean;
    static defaultBoolean(data: any, defaultValue: boolean): boolean;
    static number(data: any): number;
    static defaultNumber(data: any, defaultValue: number): number;
    static filterNumber(data: any, defaultValue: number, filter: (d: number) => number): number;
    static string(data: any): string;
    static defaultString(data: any, defaultValue: string): string;
    static filterString(data: any, defaultValue: string, filter: (d: string) => string): string;
}
```

A mapper to allow some filtering for retrieved variables that could be undefined.

Example:

```js
const { LazyMapper } = require('@lazy-toolbox/portable');
const someData = {
    propA: "hello",
    propB: 123,
    propC: {
        subProp: "uwu"
    }
};
console.log(LazyMapper.defaultString(someData.propA, 'error!')); // hello
console.log(LazyMapper.defaultString(someData.propD, 'error!')); // error!
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
    static combinationArrayNRNO<T>(objects: T[], k: number): T[];
}
```

Add some lazy math that should have been available at first on JS.

Example:

```js
const { LazyMath } = require('@lazy-toolbox/portable');
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

// Return an array of ordered combination without repetition of n objets (a string array) classified in k groups.
console.log(LazyMath.combinationArrayNRNO([7, 6, 3, 4], 2));
/* Result:
[
    [7, 6],
    [7, 3],
    [7, 4],
    [6, 3],
    [6, 4],
    [3, 4]
]
*/
```


