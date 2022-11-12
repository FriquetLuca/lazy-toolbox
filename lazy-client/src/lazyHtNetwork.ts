/**
 * A lazy way to handle JS fetch API.
 * @function post Post data the same way an HTML form does.
 * @function postJSON Post a stringify JSON to an URL.
 * @function getJSON Get a stringify JSON from an URL.
 */
export class LazyHtNetwork {
    /**
     * Post data the same way an HTML form does.
     * @param {string} path The URL where we post datas.
     * @param {{[name: string]: any}} datas The datas to post.
     * @param {(json: Promise<any>) => void} execute A function to execute for any callback from the server.
     * @param {(e: any) => void} error A function to handle any potential error.
     */
    public static async post(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void> {
        try {
            const form = new FormData();
            for (let data in datas) {
                form.append(data, datas[data]);
            }
            const fetchResult = await fetch(path, {
                method: 'POST',
                body: form
            });
            const jsonData = await fetchResult.json();
            execute(jsonData);
        }
        catch (e) {
            error(e);
        }
    }
    /**
     * Post a stringify JSON to an URL.
     * @param {string} path The URL where we post datas.
     * @param {{[name: string]: any}} datas The datas to post.
     * @param {(json: Promise<any>) => void} execute A function to execute for any callback from the server.
     * @param {(e: any) => void} error A function to handle any potential error.
     */
    public static async postJSON(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void> {
        try {
            const fetchResult = await fetch(path, {
                method: 'POST',
                body: JSON.stringify(datas),
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                }
            });
            const jsonData = await fetchResult.json();
            execute(jsonData);
        }
        catch (e) {
            error(e);
        }
    }
    /**
     * Get a stringify JSON from an URL.
     * @param {string} path The URL where the JSON file is located.
     * @param {(json: Promise<any>) => void} execute A function to execute for the fetched JSON.
     * @param {(e: any) => void} error A function to handle any potential error.
     */
    public static async getJSON(path: string, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void> {
        try {
            const fetchResult = await fetch(path);
            const jsonData = await fetchResult.json();
            execute(jsonData);
        }
        catch (e) {
            error(e);
        }
    }
}