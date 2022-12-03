#### [LazyText](#lazyText)
```ts
class LazyText {
    static extract(content: string, index: number, nbrLetters: number): string;
    static extractFromUntil(content: string, startIndex: number, predicate: (c: string, i: number, txt: string)=>boolean): { value: string; lastIndex: number; };
    static countLines(content: string): number;
    static countLinesChar(content: string, maxIndex: number): { lines: number; lineChar: number; };
}
```

Shorthand static class for special string functions.

Example:

```js
const { LazyText } = require('@lazy-toolbox/portable');
const someContent = "Hello World.\nNice to meet you all.";
console.log(LazyText.extract(someContent, 2, 3)); // "llo"
console.log(LazyText.extractFromUntil(someContent, 2, (c, i, txt) => {
    c === '/n'
})); // "llo World."
console.log(LazyText.countLines(someContent));// 2
console.log(LazyText.countLinesChar(someContent));
/*
{
    lines: 2
    lineChar: 21
}
*/
```