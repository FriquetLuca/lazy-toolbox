import Fastify from 'fastify';
import path from 'path';
import { LazyModLoader } from '../lazyModLoader';
/**
 * A lazy routing setup for lazy people.
 * @method loadAssets Load all assets static routes.
 * @method registerPaths Register all routes based on the directory hierarchy for routes functions.
 * @method start Start listening to the port.
 * @method loadStaticRoutes Create all routes from a folder and get an access to all files from it.
 */
export class LazyRouter {
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
     * Set a database to use/
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
     * @param routesFolder The path to the folder where all routes are handled.
     */
    public async registerPaths(routesFolder: string): Promise<void> {
        await this.fastify.register(async (fastify: any, options: any): Promise<void> => {
            const routes: { [filePath: string]: any; } = new LazyModLoader(this.root, routesFolder).load();
            for(let route in routes) {
                routes[route](`/${route}`, fastify, this.db);
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
