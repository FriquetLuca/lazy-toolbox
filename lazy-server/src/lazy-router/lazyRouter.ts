import Fastify from 'fastify';
import path from 'path';
import fs from "fs";
import LazyModLoader from '../lazyModLoader';
import LazyFS from 'lazy-fs/lazyFS';
/**
 * A lazy routing setup for lazy people.
 * @method loadAssets Load all assets static routes.
 * @method registerPaths Register all routes based on the directory hierarchy for routes functions.
 * @method start Start listening to the port.
 * @method loadStaticRoutes Create all routes from a folder and get an access to all files from it.
 */
export default class LazyRouter {
    protected fastify: any;
    protected host: string;
    protected port: number;
    protected root: string;
    protected assetDir: string;
    protected db: any;
    /**
     * Create a new router to handle routes.
     * @param host The host name.
     * @param port The port to listen to.
     * @param root The root folder path.
     * @param assetDir The asset relative directory from root.
     * @param db The database object. It can be used to send database datas or even other objects as you pleased.
     */
    constructor(host: string, port: number, root: string, assetDir: string, db: any = undefined) {
        this.fastify = Fastify({
            logger: false
        });
        this.host = host;
        this.port = Number(port);
        this.root = root;
        this.assetDir = assetDir;
        this.db = db;
    }
    /**
     * Set a database to use.
     * @param {any} db The database to use.
     */
    public setDB(db: any): void {
        this.db = db;
    }
    /**
     * Load all assets static routes.
     */
    public async loadAssets(): Promise<void> {
        await this.loadStaticRoutes('/assets/', this.assetDir);
    }
    /**
     * Create all routes from a folder and get an access to all files from it.
     * @param {string} route The route to use.
     * @param {string} staticDirectory The relative path of the directory for the routes.
     */
    public async loadStaticRoutes(route: string, staticDirectory: string): Promise<void> {
        await this.fastify.register(require('@fastify/static'), {
            root: path.join(this.root, staticDirectory),
            prefix: route,
            index: false,
            list: true
        });
    }
    /**
     * Register all routes based on the directory hierarchy for routes functions.
     * @param {string} routesFolder The path to the folder where all routes are located.
     * @param {string} viewsFolder The path to the folder where all views are located.
     */
    public async registerPaths(routesFolder: string, viewsFolder: string = "public/views/"): Promise<void> {
        await this.fastify.register(async (fastify: any, options: any): Promise<void> => {
            const viewPath = path.join(this.root, viewsFolder);
            const views: { [filePath: string]: string;} = {};
            const viewFiles: string[] = [];
            if(fs.existsSync(viewPath)) {
                LazyFS.getAllFilesInDir(viewPath).forEach(file => {
                    viewFiles.push(file);
                });
            }
            for(let viewFile of viewFiles) {
                const relativeInsidePath = path.relative(viewPath, viewFile).replace('\\', '/');
                const fileName = relativeInsidePath.substring(0, relativeInsidePath.lastIndexOf("."));
                const file = await LazyFS.readFile(viewFile);
                views[fileName] = file.toString();
            }
            const routes: { [filePath: string]: any; } = new LazyModLoader(this.root, routesFolder).load();
            for(let route in routes) {
                routes[route](`/${route}`, fastify, views, this.db);
            }
        });
    }
    /**
     * Get fastify server instance.
     * @returns {any} Fastify server instance..
     */
    public getFastify(): any {
        return this.fastify;
    }
    /**
     * Start listening to the port.
     */
    public start(): void {
        this.fastify.listen({ port: this.port, host: this.host }, function (err: any, address: any) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    }
}
