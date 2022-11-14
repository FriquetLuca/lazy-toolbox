/**
 * Add some lazy math that should have been available at first on JS.
 * @function modulo Compute the remainder of a / b. a % b IS NOT modulo in JS for some reason.
 * @function frac Get the leftover to obtain an integer less or equal to n.
 * @function saturate Clamp a value between 0 and 1.
 * @function sum Sum of a function over a range of value.
 * @function product Product of a function over a range of value.
 * @function isPrime A primary test that will return true if the number is prime. Since JS use floating point arithmetic on number, the number is floored before the test.
 * @function step Return 1 if x is gequal to n, otherwise n.
 * @function lerp
 * @function unlerp
 * @function binomialCoefficient
 * @function derivative
 * @function antiDerivative
 * @function integral
*/
export class LazyMath {
    /**
     * Compute the remainder of a / b. a % b IS NOT modulo in JS for some reason.
     * @param {number} a What we want the remainder from.
     * @param {number} b What's dividing a.
     * @returns A value between 0 (included) and the remainder of the divisor (not included).
     */
    public static modulo(a: number, b: number): number
    {
        return a - Math.floor(a / b) * b;
    }
    /**
     * Get the leftover to obtain an integer less or equal to n.
     * @param {number} n The number to get the fractional part from.
     * @returns {number} The fractional part of the number a.
     */
    public static frac(n: number): number {
        return n - Math.floor(n);
    }
    /**
     * Clamp a value between 0 and 1.
     * @param {number} a The number to clamp.
     * @returns {number} A value between 0 and 1.
     */
    public static saturate(a: number): number {
        return (a > 1) ? 1 : (a < 0) ? 0 : a;
    }
    /**
     * Iterative sum of f.
     * @param {number} k The start index.
     * @param {number} n The last index.
     * @param {(i: number) => number} f A function to execute.
     * @returns {number} The result of the sum.
     */
    public static sum(k: number, n: number, f: (i: number) => number): number {
        let result = 0;
        for(let i = k; i <= n; i++) {
            result += f(i);
        }
        return result;
    }
    /**
     * Iterative product of f.
     * @param {number} k The start index.
     * @param {number} n The last index.
     * @param {(i: number) => number} f A function to execute.
     * @returns {number} The result of the product.
     */
    public static product(k: number, n: number, f: (i: number) => number): number {
        let result = 1;
        for(let i = k; i <= n; i++) {
            result *= f(i);
        }
        return result;
    }
    /**
     * A primary test that will return true if the number is prime. Since JS use floating point arithmetic on number, the number is floored before the test.
     * @param {number} n The number to test.
     * @returns {boolean} True if the number is prime.
     */
    public static isPrime(n: number): boolean {
        n = Math.floor(n);
        if(n <= 3) {
            if(n < 0) {
                n = -n;
            }
            if(n <= 3) {
                return (n > 1);
            }
        }
        if(n % 2 == 0 || n % 3 == 0) {
            return false;
        }
        for (let i = 5; i * i <= n; i += 6) {
            if (n % i == 0 || n % (i + 2) == 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Return 1 if x is gequal to n, otherwise n.
     * @param {number} n Number to apply step.
     * @param {number} x Step comparison.
     * @returns {number} The result of the operation.
     */
    public static step(n: number, x: number): number {
        return x >= n ? 1 : n;
    }
    /**
     * Do a linear interpolation between a and b using the parameter t for the interpolated distance.
     * @param {number} a The starting position.
     * @param {number} b The ending position.
     * @param {number} t A value between 0 and 1 (0 being 0% and 1 being 100%), determining how much we interpolate between a and b.
     * @returns {number} A number between a and b depending on t.
     */
    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }
    /**
     * Get the interpolated distance of p on the line from a to b.
     * @param {number} a The starting position.
     * @param {number} b The ending position.
     * @param {number} p A value between a and b.
     * @returns {number} A value between 0 and 1 representing the interpolated percentage between a and b.
     */
    public static unlerp(a: number, b: number, p: number): number {
        return (p - a) / (b - a);
    }
    /**
     * Compute the number of ways to choose an unordered subset of k elements from a fixed set of n elements. n ≥ k ≥ 0.
     * @param {number} n Number of elements.
     * @param {number} k Number of subset.
     * @returns {number} The positive integers that occur as coefficients in the binomial theorem.
     */
    public static binomialCoefficient(n: number, k: number): number {
        const mid: number = n / 2;
        if (k > n)
        {
            throw new Error("k can't be greater than n.");
        }
        if(k == n)
        {
            return 1;
        }
        if(k > mid)
        {
            let num = 1;
            let den = 1;
            for (let i = k + 1, j = 1; i <= n; i++, j++)
            {
                num *= i;
                den *= j;
            }
            return num / den;
        }
        else if(n % 2 == 0 && mid == k)
        {
            let num: number = 1;
            let den: number = 1;
            let i: number;
            for (i = 1; i <= mid; i++)
            {
                den *= i;
            }
            for (; i <= n; i++)
            {
                num *= i;
            }
            return num / den;
        }
        else
        {
            let nk: number = n - k;
            let num: number = 1;
            let den: number = 1;
            for (let i: number = nk + 1, j = 1; i <= n; i++, j++)
            {
                num *= i;
                den *= j;
            }
            return num / den;
        }
    }
    /**
     * Evaluate the derivative of a function f at a point x. d/dx f(x)
     * @param {number} x Evaluation point.
     * @param {number} f Function f.
     * @returns {number} The result of f'(x).
     */
    public static derivative(x: number, f: (x: number) => number): number {
        const eps = 0.000000000000000919191919;
        return (f(x + eps) - f(x)) / eps;
    }
    /**
     * Evaluate the anti-derivative of a function f' at a point x. ∫ f'(x) dx
     * @param {number} x Evaluation point.
     * @param {number} f Function f'.
     * @param {number} subdivide The number of subdivision to use. The more you have, the better the approximation.
     * @returns {number} The result of F(x).
     */
    public static antiDerivative(x: number, f: (x: number) => number, subdivide: number = 50): number {
        if (subdivide <= 0)
        {
            subdivide = 1;
        }
        let result = 0;
        const offset = x / subdivide;
        for (let i = 0; i < subdivide; i++)
        {
            result += f(offset * i) * offset;
        }
        return result;
    }
    /**
     * Evaluate the area under the curve of a function f' from a to b. ∫_a^b f'(x) dx
     * @param {number} a The point to start.
     * @param {number} b The point to end.
     * @param {number} f Function f'.
     * @param {number} subdivide The number of subdivision to use. The more you have, the better the approximation.
     * @returns {number} The result of F(b) - F(a).
     */
    public static integral(a: number, b: number, f: (x: number) => number, subdivide: number = 50): number {
        if (subdivide <= 0)
        {
            subdivide = 1;
        }
        let result = 0;
        const offset = (b - a) / subdivide;
        for (let i = 0; i < subdivide; i++)
        {
            result += f(a + offset * i) * offset;
        }
        return result;
    }
    /**
     * Return an array of ordered combination without repetition of n objets (a string array) classified in k groups.
     * @param {T[]} objects An array of object to reorder.
     * @param {number} k The number of classified groups.
     * @returns {T[]} The list of all combination in the k groups of n objets without repetition and without order.
     */
    public static combinationArrayNRNO<T>(objects: T[], k: number): T[]
    {
        let n = objects.length; // Assign n as the length of all objets or the number passed through the function
        if(n < k) // n must be greater or equal to k...
        {
            throw new Error('The number of object must be greater or equal to k.');
        }
        let offset = n - k + 1; // The offset generated by the number of group
        let result: T[] = []; // Declare the result
        for(let i = 0; i < offset; i++) // Loop through all possible values on the first element
        {
            let content: T[] = [];
            content.push(objects[i]);
                let generated = LazyMath.combinationArrayDepthNRNO(objects, // Pass our objects
                i + 1, // Go to the next index to get the start of the next element
                offset + 1, // Subgroup gain a start offset of 1
                k - 1, // Align k for depth check since array start at 0
                0, // No depth, it's the 1st subgroup
                content // Pass the container of objets itself for referencing
            );
            Array.prototype.push.apply(result, generated); // Combine result
        }
        return result; // Return the result
    }
    /***
     * Generate an array of the entire set of element made out of binomial coefficient by taking the depth stack into account.
     */
    private static combinationArrayDepthNRNO<T>(objects: T[], index: number, offset: number, k: number, depth: number = 0, content: T[] = [])
    {
        if(depth >= k) // If our depth is grater or equal to k, then we have all we need
        {
        return [content]; // We return the new array of objects made on the way.
        }
        let result: T[] = []; // Declare a result
        for(let i = index; i < offset; i++) // Loop through the possible values between index and offset - 1
        {
            let copyContent = [...content, objects[i]];
            let generated = LazyMath.combinationArrayDepthNRNO(objects,
            i + 1, // Go to the next index to get the start of the next element
            offset + 1, // Subgroup gain a start offset of 1
            k, // Just passing k along, it's already align if nothing goes wrong
            depth + 1, // Next depth of the stack
            copyContent  // Pass the container of newly packed objets itself for referencing
            ); // Go into nested combinations
            Array.prototype.push.apply(result, generated); // Combine result
        }
        return result; // Return the result
    }
}