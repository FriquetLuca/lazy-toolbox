/**
 * A lazy singleton representation to not bother about doing it at all nor ever.
 */
export class LazySingleton {
    private static instance: any;
    protected constructor() {}
    /**
     * Create an instance of a singleton. It can takes as many argument as needed.
     * @param {any[]} args Arguments for the singleton constructor.
     * @returns {any} The new singleton created.
     */
    public static instanceFactory<T extends LazySingleton>(this: new (...args: any[]) => T, ...args: any[]): T {
        if (!LazySingleton.instance) {
            LazySingleton.instance = new (this as any)(...args);
        }
        return LazySingleton.instance;
    }
    /**
     * Get the instance of the singleton.
     * @returns 
     */
    public static getInstance<T extends LazySingleton>(): T {
        return LazySingleton.instance;
    }
}