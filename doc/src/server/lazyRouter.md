#### [LazyRouter](#lazyRouter)
```ts
class LazyRouter {
    // Last update at version: 1.1.2
    constructor(host: string, port: number, root: string, assetDir: string, db: any = undefined);
    // New on version: 1.4.7
    get Views(): { [filePath: string]: string; };
    // New on version: 1.4.7
    get DB(): any;Promise<void>
    start(): void;
    // New on version: 1.1.2
    setDB(db: any): void;
    // New on version: 1.4.2
    getFastify(): any;
    // New on version: 1.4.7
    view(provided: {viewPath:string, request:any, reply:any, datas?: {[propertyName: string]: string}, templates?: {[name: string]: {(i: number, count: number): {[label: string]: string}}} }, reloadRoutes: boolean = false): string;
    async loadAssets(): Promise<void>;
    // Last update at version: 1.1.1
    async registerPaths(routesFolder: string): Promise<void>;
    // New on version: 1.1.1
    async loadStaticRoutes(route: string, staticDirectory: string): 
    // New on version: 1.4.7
    async reloadViews(): Promise<void>;
    // New on version: 1.4.10
    async initializeSession(secretKey: string = 'a secret with minimum length of 32 characters', isSecure: boolean = false, expirationTime: number = 24 * 60 * 1000): Promise<void>;
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
        - views
            - index.html
            - dummy.html
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
    // Initialize the session for users.
    // Default value aren't that good, you should think about
    // setting it up a bit.
    await newRouter.initializeSession();
    // Load all custom routes modules inside the routes folder
    await newRouter.registerPaths('./routes', '../public/views');
    // Registered routes:
    // localhost:3000/assets/img.png
    // localhost:3000/customRoute
    newRouter.start();
}
// Let's just run this.
setupRouter();
```
`routes/customRoute.js`:
```js
// Get the folder relative path as route
module.exports = (route, fastify, router) => {
    // A simple implementation for lazyness incarned.
    fastify.get(route, async (request, reply) => {
        const dummyUsers = [
            { name: "John", age: 28 },
            { name: "Elena", age: 31 },
            { name: "Arthur", age: 66 },
            { name: "Sophie", age: 17 },
            { name: "Peter", age: 19 }
        ];
        // The config of the view
        const config = {
            viewPath: 'index', // public/views/index.html
            request: request,
            reply: reply,
            // Some datas to inject, isn't mendatory
            datas: {
                'replaceUseless': 'My awesome title.'
            },
            // A template to make
            templates: {
                'feedDiv': (i) => {
                    const user = dummyUsers[i];
                    return {
                        'username': user.name,
                        'age': user.age
                    };
                }
            }
        };
        // Load the view
        const currentView = router.view(config);
        // Just send the document
        return provided.reply.type('text/html').send(currentView);
    });
}
```
`public/views/index.html`:
```html
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dummy page</title>
    </head>
    <body>
        <h1><insert data="replaceUseless">Useless Title</insert></h1>
        <div>
            <p>Something ...</p>
            <insert view="dummy"></insert>
            <p>Another something else ...</p>
        </div>
    </body>
</html>
```
`public/views/dummy.html`:
```html
<div>
    <p>Something else ...</p>
    <p>...</p>
</div>
```