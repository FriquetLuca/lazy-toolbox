#### [LazyPattern](#lazyPattern)
```ts
interface PatternFound {
    name?: string,
    currentName?: string,
    begin?: string,
    end?: string,
    nested?: boolean,
    content?: any,
    error?: boolean,
    line?: number,
    lineChar?: number,
    lastIndex?: number
}
class LazyPattern {
    constructor(pattern: BasicRule);
    get name(): string;
    isActualPattern(i: number, c: string, t: string): boolean;
    isEndPattern(i: number, c: string, t: string): boolean;
    fetchContent(i: number, c: string, t: string, patternSet: LazyPattern[], actualPattern: LazyPattern): PatternFound;
}
```

LazyPattern is a generic class made to check for pattern while looking inside a string. It fetch it's inner value with the pattern founded and then return it's last index.