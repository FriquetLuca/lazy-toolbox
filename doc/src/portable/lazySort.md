#### [LazySort](#lazySort)
```ts
interface RequiredOrder {
    name: string,
    content: any,
    required?: string[]
}
class LazySort {
    static byRequired(myDatas: RequiredOrder[], allMustExist: boolean = false): RequiredOrder[];
}
```

A lazy way to sort some particular structure.

Example:

```js
const { LazySort } = require('@lazy-toolbox/portable');
const arr = [
    {
        name: "c",
        content: "C",
        required: ["a", "b"]
    },
    {
        name: "a",
        content: "A"
    },
    {
        name: "b",
        content: "B",
        required: ["a"]
    },
];
const results = LazySort.byRequired(arr);
for(const r of results) {
    console.log(r.name);
}
/*
a
b
c
*/
```