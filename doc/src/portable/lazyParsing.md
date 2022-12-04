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
    parse(text: string): PatternFound[];
    static createSet(...rules: BasicRule[]): LazyPattern[];
    static parse(txtContent: string, patternSet: LazyPattern[], i: number = 0, endPattern: (i: number, c: string, t: string) => boolean = (i: number, c: string, t: string) => { return false; }): PatternResult;
    static toString(content: PatternResult | PatternFound[], spacing: boolean = false): string;
    static toStringDebug(content: PatternResult | PatternFound[], spacing: boolean = false): string;
}
```

A more natural way to parse datas with custom rules set in specific testing order.

Example:

```js
const { LazyParsing, LazyRule } = require('@lazy-toolbox/portable');
// Create some keywords
const keywordList = [
    "if",
    "as"
];
// Create a bunch of rules for the parser
const ruleSet = LazyParsing.createSet(
    LazyRule.keyword(keywordList), // Should look first for keywords
    // If not a keyword, check for a variable
    LazyRule.variable(), // This order is to make sure we don't treat a keyword as variable
    LazyRule.number() // Last case scenario for the parsing is to check for a number
);
// Create a string to parse
const contentToParse = "select a content as aswell 100 _times if needed!";
// Get the parsing result
const parsedResult = LazyParsing.parse(contentToParse, ruleSet);
// Debug your datas visually
console.log(LazyParsing.toStringDebug(parsedResult, true));
/* Result:
    [variable]: select
    [variable]: a
    [variable]: content
    [keyword]: as
    [variable]: aswell
    [number]: 100
    [variable]: _times
    [keyword]: if
    [variable]: needed
*/
// Everything after this is up to you, it's your datas, handle them the way you want to.
```