import * as http from 'http'
import * as http2 from 'http2'
import * as https from 'https'
import Fastify, { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyRequest, FastifyTypeProvider, FastifyTypeProviderDefault, RawReplyDefaultExpression, RawRequestDefaultExpression } from 'fastify';
import path from 'path';
import fs from "fs";
import { parse } from 'node-html-parser';
import {LazyModLoader} from '../lazyModLoader';
import {LazyFS} from '../lazy-fs/lazyFS';
export type Server = http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | https.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | http2.Http2Server | http2.Http2SecureServer;
export type Request = http.IncomingMessage;
export type Reply = http.ServerResponse<http.IncomingMessage>;
export type Logger = FastifyBaseLogger;
export type TypeProvider = FastifyTypeProviderDefault;
export type FastifyServerInstance = FastifyInstance<Server, Request, Reply, Logger, TypeProvider> & PromiseLike<FastifyInstance<Server, Request, Reply, Logger, TypeProvider>>;

const HTTPContent: {[label: string]: string} = {
    "application/xml": "application/xml",
    "audio/mpeg": "audio/mpeg",
    "javascript": "application/javascript",
    "js": "text/javascript",
    "EDI-X12": "application/EDI-X12",
    "EDIFACT": "application/EDIFACT",
    "octet-stream": "application/octet-stream",
    "ogg": "application/ogg",
    "pdf": "application/pdf",
    "xhtml+xml": "application/xhtml+xml",
    "x-shockwave-flash": "application/x-shockwave-flash",
    "json": "application/json",
    "ld+json": "application/ld+json",
    "zip": "application/zip",
    "x-www-form-urlencoded": "application/x-www-form-urlencoded",
    "x-ms-wma": "audio/x-ms-wma",
    "vnd.rn-realaudio": "audio/vnd.rn-realaudio",
    "x-wav": "audio/x-wav",
    "gif": "image/gif",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "tiff": "image/tiff",
    "vnd.microsoft.icon": "image/vnd.microsoft.icon",
    "x-icon": "image/x-icon",
    "vnd.djvu": "image/vnd.djvu",
    "svg+xml": "image/svg+xml",
    "mixed": "multipart/mixed",
    "alternative": "multipart/alternative",
    "related": "multipart/related",
    "form-data": "multipart/form-data",
    "css": "text/css",
    "csv": "text/csv",
    "html": "text/html",
    "text": "text/plain",
    "xml": "text/xml",
    "mpeg": "video/mpeg",
    "mp4": "video/mp4",
    "quicktime": "video/quicktime",
    "x-ms-wmv": "video/x-ms-wmv",
    "x-msvideo": "video/x-msvideo",
    "x-flv": "video/x-flv",
    "webm": "video/webm",
    "vnd.oasis.opendocument.text": "application/vnd.oasis.opendocument.text",
    "vnd.oasis.opendocument.spreadsheet": "application/vnd.oasis.opendocument.spreadsheet",
    "vnd.oasis.opendocument.presentation": "application/vnd.oasis.opendocument.presentation",
    "vnd.oasis.opendocument.graphics": "application/vnd.oasis.opendocument.graphics",
    "vnd.ms-excel": "application/vnd.ms-excel",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "vnd.ms-powerpoint": "application/vnd.ms-powerpoint",
    "vnd.openxmlformats-officedocument.presentationml.presentation": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "msword": "application/msword",
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "vnd.mozilla.xul+xml": "application/vnd.mozilla.xul+xml"
};

/**
 * A lazy routing setup for lazy people.
 * @get Views Get pre-loaded views.
 * @get DB Get the database.
 * @method getFastify Get fastify server instance.
 * @method setDB Set a database to use.
 * @method initializeSession Initialize the session's setup to use sessions later.
 * @method loadAssets Load all assets static routes.
 * @method registerPaths Register all routes based on the directory hierarchy for routes functions.
 * @method start Start listening to the port.
 * @method loadStaticRoutes Create all routes from a folder and get an access to all files from it.
 * @method reloadViews Refresh all views in case of any modification.
 * @method view Get the string representation of a specific view. It will load the view and modify any given datas.
 */
export class LazyRouter {
    protected fastify: FastifyServerInstance;
    protected host: string;
    protected port: number;
    protected root: string;
    protected assetDir: string;
    protected db: any;
    protected viewDir: string = "";
    protected views: { [filePath: string]: string;} = {};
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
     * Get pre-loaded views.
     */
    public get Views(): { [filePath: string]: string; } {
        return this.views;
    }
    /**
     * Get the database.
     */
    public get DB(): any {
        return this.db;
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
     * Initialize the session's setup to use sessions later.
     * @param {string} secretKey A secret with minimum length of 32 characters
     * @param {boolean} isSecure Set to true if you use HTTPS.
     * @param {number} expirationTime The expiration time of the session. By default, it's set to 24 minutes.
     */
    public async initializeSession(secretKey: string = 'a secret with minimum length of 32 characters', isSecure: boolean = false, expirationTime: number = 24 * 60 * 1000): Promise<void> {
        await this.fastify.register(require('@fastify/formbody'));
        await this.fastify.register(require('@fastify/cookie'));
        await this.fastify.register(require('@fastify/session'), {
            cookieName: 'sessionId',
            secret: secretKey,
            cookie: { secure: isSecure },
            expires: expirationTime
        });
    }
    /**
     * Refresh all views in case of any modification.
     */
    public async reloadViews(): Promise<void> {
        if(this.viewDir.length > 0) {
            const viewPath = path.join(this.root, this.viewDir);
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
            this.views = views;
        }
    }
    protected getView(viewPath: string, reloadRoutes: boolean = false): string | undefined {
        if(reloadRoutes) {
            return this.views[viewPath];
        } else {
            const filePath = path.join(this.root, this.viewDir, `${viewPath}.html`);
            if(fs.existsSync(filePath)) { // File exist
                return fs.readFileSync(filePath).toString();
            }
        }
        return undefined;
    }
    protected injector(document: any, datas: {[propertyName: string]: string} = {}, templates: {[name: string]: {(i: number, count: number): {[label: string]: string}}}, overrideTemplateCount: { [templateName: string]: number}, reloadRoutes: boolean = false): void {
        while(true) {
            // Get an insert that is not a property
            const currentInsert = document.querySelector('insert:not([property])');
            if(currentInsert === null) { // There's no more insert left. Job's done !
                break;
            }
            const templatePath: string | undefined = currentInsert.getAttribute('template');
            if(templatePath) {
                const templateViewPath: string | undefined = currentInsert.getAttribute('view');
                if(templateViewPath) {
                    const templateContent = parse(this.getView(templateViewPath, reloadRoutes) ?? "");
                    // Inject missing insert views / datas to the template
                    this.injector(templateContent, datas, templates, overrideTemplateCount, reloadRoutes);
                    // overrideTemplateCount
                    const overrideCount = overrideTemplateCount[templatePath];
                    let templateCount: number;
                    if(overrideCount) {
                        templateCount = Math.max(overrideCount, 0);
                    } else {
                        templateCount = Math.max(Number(currentInsert.getAttribute('count')), 0);
                    }
                    const templateData = templates[templatePath];
                    let templateResult = '';
                    for(let i = 0; i < templateCount; i++) {
                        const templateCopy = parse(templateContent.toString());
                        const currentDatas = templateData(i, templateCount);
                        for(let data in currentDatas) {
                            const currentData = currentDatas[data];
                            const replaceProp = templateCopy.querySelectorAll(`insert[property="${data}"]`);
                            for(let rProp of replaceProp) {
                                rProp.replaceWith(currentData ?? "");
                            }
                        }
                        templateResult = `${templateResult}${templateCopy.toString()}`;
                    }
                    currentInsert.replaceWith(templateResult);
                    continue;
                }
            }
            const viewPath: string | undefined = currentInsert.getAttribute('view');
            if(viewPath) { // It's a view
                currentInsert.replaceWith(this.getView(viewPath, reloadRoutes) ?? "");
                continue;
            }
            // Should be a data since it wasn't anything else
            currentInsert.replaceWith(datas[currentInsert.getAttribute('data') ?? ""] ?? "");
        }
    }
    /**
     * Get the string representation of a specific view. It will load the view and modify any given datas.
     * @param {{viewPath:string, request:any, reply:any, datas?: {[propertyName: string]: string}, templates?: {[name: string]: {(i: number, count: number): {[label: string]: string}}} }} provided The datas provided.
     * @param {boolean} reloadRoutes If true, it will get the current state of the HTML page otherwise it's gonna give the state it was when the server started. When false, views are retrieved much faster making the server faster too.
     * @returns {string} A string representing the HTML content of the page.
     */
    public view(provided: {viewPath:string, request: FastifyRequest, reply: FastifyReply, datas?: {[propertyName: string]: string}, templates?: {[name: string]: {(i: number, count: number): {[label: string]: string}}}, overrideTemplateCount?: { [templateName: string]: number} }, reloadRoutes: boolean = false): string {
        const document = parse(this.getView(provided.viewPath) ?? "");
        this.injector(document, provided.datas ?? {}, provided.templates ?? {}, provided.overrideTemplateCount ?? {}, reloadRoutes);
        return document.toString();
    }
    /**
     * Register all routes based on the directory hierarchy for routes functions.
     * @param {string} routesFolder The path to the folder where all routes are located.
     * @param {string} viewsFolder The path to the folder where all views are located.
     */
    public async registerPaths(routesFolder: string, viewsFolder: string = "public/views/"): Promise<void> {
        this.viewDir = viewsFolder;
        await this.fastify.register(async (fastify, options) => {
            await this.reloadViews();
            const routes: { [filePath: string]: any; } = new LazyModLoader(this.root, routesFolder).load();
            for(let route in routes) {
                routes[route](`/${route}`, fastify, this, this.db);
            }
        });
    }
    /**
     * Get fastify server instance.
     * @returns {any} Fastify server instance..
     */
    public getFastify(): FastifyServerInstance {
        return this.fastify;        
    }
    /**
     * Get the header name of a content type.
     * @param {string} content Name of the content. By default, the content type is set to "html".
     * @returns {string} The content type header. If the content type doesn't exist or is undefined, the function returns "text/plain".
     */
    public static contentType(content: string = 'html'): string {
        return HTTPContent[content] ?? 'text/plain';
        // reply
        //     .code(config?.code ?? 200)
        //     .header('Content-Type', HTTPContent[config?.type ?? 'html'] ?? 'text/html')
        //     .send(content);
    }
    /**
     * Start listening to the port.
     */
    public start(): void {
        this.fastify.listen({ port: this.port, host: this.host }, function (err: Error | null) {
            if (err) {
                console.error(err);
                process.exit(1);
            }
        });
    }
}
