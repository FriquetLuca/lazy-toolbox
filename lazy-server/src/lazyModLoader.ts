import path from "path";
import fs from "fs";
import LazyFS from './lazy-fs/lazyFS';
/**
 * A module loader to load modules inside a directory.
 * @method load Loads all modules and return them.
 * @function isClass Check if the module is a class.
 * @function isFunction Check if the module is a function.
 * @function isArray Check if the module is an array.
 * @function isObject Check if the module is an object.
 * @function isScalar Check if the module is the simpliest value possible.
 */
export default class LazyModLoader {
    private root: string;
    private moduleFolder: string;
    private loadedMessages: string[];
    /**
     * Load every module found inside a specific folder.
     * @param {string} root The root of the project.
     * @param {string} moduleFolder The path from the root of the project to the folder where all modules to load are.
     */
    constructor(root: string, moduleFolder: string = "./") {
        this.root = root;
        this.moduleFolder = moduleFolder;
        this.loadedMessages = [];
        const modPath = path.join(this.root, moduleFolder);
        if(fs.existsSync(modPath)) {
            LazyFS.getAllFilesInDir(modPath)
            .forEach(file => {
                if(path.extname(file) === '.js' || path.extname(file) === '.mjs') {
                    this.loadedMessages.push(file);
                }
            });
        }
    }
    /**
     * Loads all modules and return them.
     * @returns {{[filePath: string]: any}} An object containing all paths as argument and return the module.
     */
    public load(): {[filePath: string]: any} {
        const result: {[name:string]: any} = {};
        for(const message of this.loadedMessages) {
            const relativeInsidePath = path.relative(path.join(this.root, this.moduleFolder), message)
                .replace('\\', '/');
            const fileName = relativeInsidePath.substring(0, relativeInsidePath.lastIndexOf("."));
            result[fileName] = require(message);
        }
        return result;
    }
    /**
     * Check if the module is a class.
     * @param {any} v The module to test.
     * @returns {boolean} True if the module is a class.
     */
    public static isClass(v: any): boolean {
        return typeof v === 'function' && /^\s*class\s+/.test(v.toString());
    }
    /**
     * Check if the module is a function.
     * @param {any} v The module to test.
     * @returns {boolean} True if the module is a function.
     */
    public static isFunction(v: any): boolean {
        return typeof v === 'function' && !(/^\s*class\s+/.test(v.toString()));
    }
    /**
     * Check if the module is an array.
     * @param {any} v The module to test.
     * @returns {boolean} True if the module is an array.
     */
    public static isArray(v: any): boolean {
        return Array.isArray(v);
    }
    /**
     * Check if the module is an object.
     * @param {any} v The module to test.
     * @returns {boolean} True if the module an object.
     */
    public static isObject(v: any): boolean {
        return typeof v === 'object' && !Array.isArray(v);
    }
    /**
     * Check if the module is the simpliest value possible.
     * @param {any} v The module to test.
     * @returns {boolean} True if the module is the simpliest value possible.
     */
    public static isScalar(v: any): boolean {
        return typeof v !== 'object' && typeof v !== 'function';
    }
}