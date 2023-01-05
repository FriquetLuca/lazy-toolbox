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

A lazy way to sort some datas.

Example:

```js
const { LazySort } = require('@lazy-toolbox/portable');
const testDatas = [
    {
        name: "Cart",
        content: "Cart making",
        required: [
            "Fire",
            "Wheel",
            "Iron",
        ]
    },
    {
        name: "Minerals",
        content: "Minerals extraction"
    },
    {
        name: "Wheel",
        content: "Wheel discovery"
    },
    {
        name: "Car",
        content: "Car making",
        required: [
            "Engine",
            "Cart",
            "Wheel"
        ]
    },
    {
        name: "Fire",
        content: "Fire discovery"
    },
    {
        name: "Iron",
        content: "Iron discovery",
        required: [
            "Fire",
            "Minerals"
        ]
    }
];
const showContent = (label, ds) => {
    console.log(label);
    let i = 1;
    for(const d of ds) {
        console.log(`${i++}) ${d.name}`);
    }
}
showContent("Not all must exist", LazySort.byRequired(testDatas, false));
showContent("All must exist", LazySort.byRequired(testDatas, true));
/*
Not all must exist
1) Fire
2) Wheel
3) Minerals
4) Iron
5) Cart
6) Car
All must exist
1) Fire
2) Wheel
3) Minerals
4) Iron
5) Cart
*/
```