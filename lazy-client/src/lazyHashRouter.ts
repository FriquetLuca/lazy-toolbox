/**
 * The GET interface containing a `page` and a `result` property.
 */
export interface getter {
    page: string | undefined;
    result: any;
}
/**
 * A lazy way to handle url parameters on a page.
 */
export class LazyHashRouter {
    /**
     * Get the page route and an object represented in the url.
     * @param {string | undefined} url The url to get the params from. If no url is provided, it's going to search the current url on the page.
     * @returns {getter} A getter containing the page route and the resulting object represented in the url.
     */
    public static getAllUrlParams(url?: string): getter {
        let queryString;
        // get query string from url (optional) or window
        if(url) {
            const splitUrl = url.split('?');
            splitUrl.shift();
            queryString = splitUrl.join('?');
        } else {
            queryString = window.location.search.slice(1);
        }
        let getPage = queryString.split('?');
        queryString = getPage.length > 1 ? getPage[1] : getPage[0];
        const getter: getter = {
            page: getPage.length > 1 ? getPage[0] : undefined,
            result: undefined
        }
        // we'll store the parameters here
        const obj: any = {};
        // if query string exists
        if (queryString) {
            // stuff after # is not part of query string, so get rid of it
            queryString = queryString.split('#')[0];
            // split our query string into its component parts
            const arr = queryString.split('&');
            for (var i = 0; i < arr.length; i++) {
                // separate the keys and the values
                const a = arr[i].split('=');
                // set parameter name and value (use 'false' if empty)
                let paramName = a[0];
                let paramValue = typeof (a[1]) === 'undefined' ? false : JSON.parse(decodeURIComponent(a[1]));
                // (optional) keep case consistent
                paramName = paramName.toLowerCase();
                if (typeof paramValue === 'string') {
                    paramValue = paramValue.toLowerCase();
                }
                // if the paramName ends with square brackets, e.g. colors[] or colors[2]
                if (paramName.match(/\[(\d+)?\]$/)) {
                    // create key if it doesn't exist
                    const key = paramName.replace(/\[(\d+)?\]/, '');
                    if (!obj[key]) {
                        obj[key] = [];
                    }
                    // if it's an indexed array e.g. colors[2]
                    if (paramName.match(/\[\d+\]$/)) {
                        // get the index value and add the entry at the appropriate position
                        const index = (<RegExpExecArray>/\[(\d+)\]/.exec(paramName))[1];
                        obj[key][index] = paramValue;
                    } else {
                        // otherwise add the value to the end of the array
                        obj[key].push(paramValue);
                    }
                } else {
                    // we're dealing with a string
                    if (!obj[paramName]) {
                        // if it doesn't exist, create property
                        obj[paramName] = paramValue;
                    } else if (obj[paramName] && typeof obj[paramName] === 'string'){
                        // if property does exist and it's a string, convert it to an array
                        obj[paramName] = [obj[paramName]];
                        obj[paramName].push(paramValue);
                    } else {
                        // otherwise add the property
                        obj[paramName].push(paramValue);
                    }
                }
            }
        }
        getter.result = obj;
        return getter;
    }
    /**
     * Create a string containing the parameters from a page route and an object.
     * @param {string} page The route of the page.
     * @param {{[name: string]: any}} object The object to make the parameters.
     * @returns {string} The string containing the parameters from a page route and an object.
     */
    public static setAllUrlParams(page: string, object: {[name: string]: any}): string {
        let result = `?${encodeURIComponent(page)}`;
        let i = 0;
        for(const objName in object) {
            result += `${i++ == 0 ? '?' : '&' }${objName}=${encodeURIComponent(JSON.stringify(object[objName]))}`
        }
        return result;
    }
}