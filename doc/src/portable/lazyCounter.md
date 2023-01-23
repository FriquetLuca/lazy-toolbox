#### [LazyCounter](#lazyCounter)
```ts
interface RequiredMaterial {
    name: string;
    quantity?: number;
    price?: number;
}
interface MaterialCounter {
    name: string;
    required?: RequiredMaterial[];
    price: number;
}
class LazyCounter {
    static fullPrice(itemName: string, ...materials: MaterialCounter[]): number;
    static allRowMaterials(itemName: string, ...materials: MaterialCounter[]): RequiredMaterial[];
}
```

A lazy way to count in crafting structure.

Example:

```js
const { LazyCounter } = require('@lazy-toolbox/portable');
const materials = [
    {
        name: "wood",
        price: 1
    },
    {
        name: "steel",
        price: 5
    },
    {
        name: "sword",
        required: [
            {
                name: "wood",
                quantity: 1
            },
            {
                name: "steel",
                quantity: 2
            }
        ],
        price: 100
    }
]
console.log(LazyCounter.fullPrice("sword", materials)); // 111
for(const item of LazyCounter.allRowMaterials("sword", materials)) {
    console.log(`${item.name}: ${item.quantity}`);
}
/*
wood: 1
steel: 2
*/
```
