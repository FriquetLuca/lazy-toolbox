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
