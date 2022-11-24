#### [LazySchedule](#lazySchedule)
```ts
class LazySchedule {
    constructor(callback: (tries?: number) => void, timerCalc: (tries: number) => number, maxTries: number = 1);
    start(): void;
    stop(): void;
    reset(): void;
}
```

A lazy way to create a smart setInterval that handle a number of tries and can be paused.

```js
const { LazySchedule } = require('@lazy-toolbox/client');
// Create a schedule to execute
const schedule = new LazySchedule(
    () => {
        console.log("Callback !");
    },
    (tries) => {
        if(tries > 5) {
            return 1000; // 1s wait
        }
        return 200; // 0.2s wait
    },
    25 // Max 25 tries
);
schedule.start(); // Start the schedule.
```
