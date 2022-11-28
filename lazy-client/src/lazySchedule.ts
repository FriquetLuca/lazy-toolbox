/**
 * A lazy way to create a smart setInterval that handle a number of tries and can be paused.
 * @method start Start the schedule.
 * @method stop Stop the schedule. If the schedule had to be triggered in 30ms, when you'll start the schedule again, the schedule would be executed after those remaining 30ms.
 * @method reset Reset the schedule as if it has never started to begin with.
 */
export class LazySchedule {
    private callback: (tries?: number) => void;
    private timerCalc: (tries: number) => number;
    private tries: number;
    private maxTries: number;
    private timer: number | undefined;
    private startingTime: number = -1;
    private deltaTime: number = 0;
    private isStopped: boolean = false;
    private hasBeenStarted: boolean = false;
    /**
     * Create a new schedule.
     * @param {(tries: number) => void} callback The callback function to execute when the interval's done.
     * @param {(tries: number) => number} timerCalc A function to get the delay for the next schedule depending on the number of tries.
     * @param {number} maxTries The maximum number of times to execute the schedule. If it's less than 0 then there's no maxTries and it will go on forever.
     */
    constructor(callback: (tries?: number) => void, timerCalc: (tries: number) => number, maxTries: number = 1){
        this.callback = callback;
        this.timerCalc = timerCalc;
        this.timer = undefined;
        this.tries = 0;
        this.maxTries = maxTries;
    }
    /**
     * Reset the schedule as if it has never started to begin with.
     */
    public reset(): void {
        this.startingTime = -1;
        this.tries = 0;
        this.deltaTime = 0;
        this.isStopped = false;
        this.hasBeenStarted = false;
        clearTimeout(this.timer);
    }
    /**
     * Stop the schedule. If the schedule had to be triggered in 30ms, when you'll start the schedule again, the schedule would be executed after those remaining 30ms.
     */
    public stop(): void {
        clearTimeout(this.timer);
        if(!this.isStopped && this.hasBeenStarted) {
            this.deltaTime = Date.now() - this.startingTime;
            this.tries--;
        }
        this.isStopped = true;
    }
    /**
     * Start the schedule.
     */
    public start(): void {
        clearTimeout(this.timer);
        this.hasBeenStarted = true;
        this.isStopped = false;
        // Either maxTries is not defined or maxTries is greater than the number of tries
        if((this.maxTries < 0) || (this.tries < this.maxTries)) {
            this.startingTime = Date.now();
            this.timer = setTimeout(() => {
                this.tries = this.tries + 1;
                this.callback(this.tries);
            }, this.timerCalc(this.tries + 1) - this.deltaTime);
            this.deltaTime = 0;
        }
    }
}