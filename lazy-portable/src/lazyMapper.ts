/**
 * A mapper to allow some filtering for retrieved variables that could be undefined.
 */
 export class LazyMapper {
    /**
     * Filter a data and set a default value if the data is undefined. If it's defined, transform the data the way you want then filter whatever the result is.
     * @param {any} data The data to filter.
     * @param {T} defaultValue The default value to set to your data in case it's undefined.
     * @param {(d: any) => T} transform A function to transform your any data type into your actual type.
     * @param {(d: T) => T} filter A function to filter your data.
     * @returns {T} The data with your choosen filtered data type.
     */
    public static filterData<T>(data: any, defaultValue: T, transform: (d: any) => T, filter: (d: T) => T): T {
        let result = defaultValue;
        if(data !== undefined) {
            result = transform(data);
        }
        return filter(result);
    }
    /**
     * Filter the value of a received number or the default number in case the received number was undefined.
     * @param {any} data The data to filter.
     * @param {number} defaultValue The default number to set.
     * @param {(d: number) => number} filter The filtering function.
     * @returns {number} The filtered number.
     */
    public static filterNumber(data: any, defaultValue: number, filter: (d: number) => number): number {
        return LazyMapper.filterData(data, defaultValue, (d: any) => d === null ? 0 : Number(d), filter);
    }
    /**
     * Filter the value of a received string or the default string in case the received string was undefined.
     * @param {any} data The data to filter.
     * @param {string} defaultValue The default string to set.
     * @param {(d: string) => string} filter The filtering function.
     * @returns {string} The filtered number.
     */
    public static filterString(data: any, defaultValue: string, filter: (d: string) => string): string {
        return LazyMapper.filterData(data, defaultValue, (d: any) => d === null ? defaultValue : String(d), filter);
    }
    /**
     * Filter a data and set a default value if the data is undefined. If it's defined, transform the data the way you want.
     * @param {any} data The data to filter.
     * @param {T} defaultValue The default value to set to your data in case it's undefined.
     * @param {(d: any) => T} transform A function to transform your any data type into your actual type.
     * @returns {T} The data with your choosen filtered data type.
     */
    public static defaultData<T>(data: any, defaultValue: T, transform: (d: any) => T): T {
        return LazyMapper.filterData(data, defaultValue, transform, (d) => d);
    }
    /**
     * Retrieve a boolean from a data. If the data is undefined, the value will be set to a default value.
     * @param {any} data The data to filter.
     * @param {boolean} defaultValue The default value to set to your data in case it's undefined.
     * @returns {boolean} The filtered data.
     */
    public static defaultBoolean(data: any, defaultValue: boolean): boolean {
        return LazyMapper.defaultData(data, defaultValue, (d: any) => d === null ? defaultValue : Boolean(d));
    }
    /**
     * Retrieve a number from a data. If the data is undefined, the value will be set to a default value.
     * @param {any} data The data to filter.
     * @param {number} defaultValue The default value to set to your data in case it's undefined.
     * @returns {number} The filtered data.
     */
    public static defaultNumber(data: any, defaultValue: number): number {
        return LazyMapper.defaultData(data, defaultValue, (d: any) => d === null ? 0 : Number(d));
    }
    /**
     * Retrieve a string from a data. If the data is undefined, the value will be set to a default value.
     * @param {any} data The data to filter.
     * @param {string} defaultValue The default value to set to your data in case it's undefined.
     * @returns {string} The filtered data.
     */
    public static defaultString(data: any, defaultValue: string): string {
        return LazyMapper.defaultData(data, defaultValue, (d: any) => d === null ? defaultValue : String(d));
    }
    /**
     * Convert a data to a boolean type. If undefined, it's set to false by default.
     * @param {any} data The data to convert.
     * @returns {boolean} The boolean representation of the data.
     */
    public static boolean(data: any): boolean {
        return LazyMapper.defaultData(data, false, (d: any) => Boolean(d));
    }
    /**
     * Convert a data to a number type. If undefined, it's set to 0 by default.
     * @param {any} data The data to convert.
     * @returns {number} The number representation of the data.
     */
    public static number(data: any): number {
        return LazyMapper.defaultData(data, 0, (d: any) => Number(d));
    }
    /**
     * Convert a data to a string type. If undefined, it's set to "" by default.
     * @param {any} data The data to convert.
     * @returns {string} The string representation of the data.
     */
    public static string(data: any): string {
        return LazyMapper.defaultData(data, "", (d: any) => d.toString());
    }
}