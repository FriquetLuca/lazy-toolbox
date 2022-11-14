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
