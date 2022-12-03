#### [LazyParsing](#lazyParsing)
```ts
interface PatternResult {
    isPatternEnd: boolean;
    result: PatternFound[];
    lastIndex: number;
}
class LazyParsing {
    constructor(...rules: BasicRule[]);
    addRules(...rules: BasicRule[]): void;
    removeRules(...rulesName: string[]): void;
    parse(text: string): any[];
    static createSet(...rules: BasicRule[]): LazyPattern[];
    static parse(txtContent: string, patternSet: LazyPattern[], i: number = 0, endPattern: (i: number, c: string, t: string) => boolean = (i: number, c: string, t: string) => { return false; }): PatternResult;
    static toString(content: PatternResult | PatternFound[], spacing: boolean = false): string;

}
```

A more natural way to parse datas with custom rules set in specific testing order.

Example:

```js
const { LazyParsing, LazyRule } = require('@lazy-toolbox/portable');
const parsingRules = LazyParsing.createSet(LazyRule.number(), LazyRule.word());
const parsedResult = LazyParsing.parse("This is 1 content we want to parse.", parsingRules); // Parse the content with our rules.
console.log(LazyParsing.ToString(parsedResult, true)); // Show the result with spacing.
```