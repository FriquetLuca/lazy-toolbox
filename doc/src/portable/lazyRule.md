#### [LazyRule](#lazyRule)
```ts
interface BasicRule {
    name?: string,
    defaultValue?: any,
    begin?: string,
    end?: string,
    isPattern: (i: number, c: string, t: string) => boolean,
    isPatternEnd?: (i: number, c: string, t: string) => boolean,
    fetch?: (i: number, c: string, t: string, isPatternEnd?: (i: number, c: string, t: string) => boolean, patternSet?: LazyPattern[]) => PatternFound
}
class LazyRule {
    static simpleChar(name: string, predicate: (c:string)=>boolean): BasicRule;
    static simpleKeys(name: string, ...extractStrings: string[]): BasicRule;
    static simpleCharbox(name: string, begin: string, end: string, overridePatternSet?: LazyPattern[], overrideIsPatternEnd?: (i: number, c: string, txt: string) => boolean): BasicRule;
    static word(): BasicRule;
    static number(comaOverDot: boolean = false, exp: boolean = false): BasicRule;
    static variable(): BasicRule;
    static keyword(...keywordList: string[]): BasicRule;
    static any(name: string): BasicRule;
    static parseString(name: string, between: string): BasicRule;
}
```

A generic rule maker. It creates rules for LazyParsing.

Example:

```js
const { LazyParsing, LazyRule } = require('@lazy-toolbox/portable');
const parsingRules = LazyParsing.createSet(LazyRule.number(), LazyRule.word());
```