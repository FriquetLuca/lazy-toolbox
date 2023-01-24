import path from "path";
import dotenv from "dotenv";
import { LazyRouter, LazyFS } from "lazy-toolbox";

dotenv.config();
const _ROOT = {
        dotenv: process.env,
        rootDirectory: path.join(__dirname, '../../'),
        appRoot: __dirname
    };

const router = new LazyRouter(
        <string>process.env.HOST,
        Number(process.env.PORT),
        _ROOT.appRoot,
        '../../public/assets/',
        null
    );

const start = async () => {
        await router.loadAssets();
        await router.getFastify().register(async (fastify, options) => {
            const routePath = path.join(_ROOT.appRoot, './routes/');
            const possibleRoutes = LazyFS.getAllFilesInDir(routePath);
            for(const tryRoute of possibleRoutes) {
                const ext = path.extname(tryRoute);
                if(ext === ".ts" || ext === ".mts" || ext === ".js" || ext === ".mjs") {
                    const module = require(tryRoute);
                    const route = path.basename(path.relative(routePath, tryRoute));
                    module(`/${route}`, router, _ROOT);
                }
            }
        });
        router.start();
    };

start();