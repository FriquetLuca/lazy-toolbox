#### [LazyRouter](#lazyRouter)
```ts
class LazyRouter {
    // Last update at version: 1.1.2
    constructor(host: string, port: number, root: string, assetDir: string, db: any = undefined);
    async loadAssets(): Promise<void>;
    // Last update at version: 1.1.1
    async registerPaths(routesFolder: string): Promise<void>;
    // New on version: 1.1.1
    async loadStaticRoutes(route: string, staticDirectory: string): Promise<void>
    start(): void;
    // New on version: 1.1.2
    setDB(db: any): void;
}
```

A lazy routing setup for lazy people based on `fastify` and `@fastify/static`.

Example:

`File explorer`:
```fileExplorer
- Root
    - public
        - assets
            - img.png
    - routes
        - customRoute.js
    - app.js
```
`app.js`:
```js
const path = require('path');
const { LazyRouter } = require('lazy-toolbox');
// A little setup to make it async while loading all ours things.
const setupRouter = async () => {
    // Set a new router on the localhost, listening on port 3000.
    // The assets directory will be the static asset directory of the server.
    const newRouter = new LazyRouter('localhost', 3000, __dirname, './public/assets');
    // Load all assets static routes.
    // Note: The route name will always be ./assets/ on the server side.
    // localhost:3000/assets/
    // It's the equivalent of :
    // await this.loadStaticRoutes('/assets/', './public/assets');
    await newRouter.loadAssets();
    // Load all custom routes modules inside the routes folder
    await newRouter.registerPaths('./routes');
    // Registered routes:
    // localhost:3000/customRoute
    newRouter.start();
}
// Let's just run this.
setupRouter();
```
`routes/customRoute.js`:
```js
// Get the folder relative path as route
module.exports = (route, fastify, db) => {
    // A simple implementation for lazyness incarned.
    fastify.get(route, async (request, reply) => {
        // Setup your fastify route.
    });
}
```
