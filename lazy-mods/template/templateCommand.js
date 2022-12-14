const fs = require("fs");
const path = require("path");

const templateSocket = (socketType) => {
    if(socketType === 'connect' || socketType === 'disconnect') {
        return `import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, client: LazyClientSocket, db: any) => {
    
};`;
    } else if(socketType === 'message') {
        return `import { LazyClientSocket, LazySocket } from "lazy-toolbox";
module.exports = (server: LazySocket, socket: LazyClientSocket, data: any, db: any) => {

};`;
    } else {
        return undefined;
    }
};
const templateRoute = (title) => `import { LazyRouter } from 'lazy-toolbox';
import { FastifyRequest, FastifyReply } from 'fastify';
module.exports = (route: string, fastify: any, router: LazyRouter, db: any) => {
    const ${title} = async (request: FastifyRequest, reply: FastifyReply) => {
        const currentView = router.view({
            viewPath: '${title}',
            request: request, reply: reply
        }, Boolean(process.env.RTR_ROUTES));
        return reply.type('text/html').send(currentView);
    };
    fastify.get(route, ${title});
    fastify.get(\`\${route}/\`, ${title});
};`;
const templateHTML = (title) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/style.css">
    <script src="/main.js" defer></script>
    <title>${title}</title>
</head>
<body>
    
</body>
</html>`;
const createTemplate = (ext, str, params, options, func, failMsg, config) => {
    const newPath = path.join(config.commandPath, `${str.toLowerCase()}.${ext}`);
    if(!fs.existsSync(newPath)) {
        fs.writeFileSync(newPath, func(params));
    } else {
        if(options.override && !fs.statSync(newPath).isDirectory()) {
            fs.rmSync(newPath);
            fs.writeFileSync(newPath, func(params));
        } else {
            console.log(failMsg);
        }
    }
};
module.exports = (program, config) => {
    program
        .command('template')
        .description('Create a template file to start working faster.')
        .argument('<template>', 'Template name')
        .argument('<fileName>', 'File name (will be converted in lower case)')
        .option('-o, --override', 'Force the file to be created. It will override any file if it exist.')
        .action((template, str, options) => {
            switch(template) {
                case 'html':
                    createTemplate('html', str, path.basename(str), options, templateHTML, 'The HTML file already exist or is a directory.', config);
                    break;
                case 'lazy-view':
                    createTemplate('ts', str, path.basename(str), options, templateRoute, 'The TypeScript file already exist or is a directory.', config);
                    break;
                case 'socket-connect':
                    createTemplate('ts', str, 'connect', options, templateSocket, 'The TypeScript file already exist or is a directory.', config);
                    break;
                case 'socket-message':
                    createTemplate('ts', str, 'message', options, templateSocket, 'The TypeScript file already exist or is a directory.', config);
                    break;
                case 'socket-disconnect':
                    createTemplate('ts', str, 'disconnect', options, templateSocket, 'The TypeScript file already exist or is a directory.', config);
                    break;
                default:
                    console.log(`Unknown template type ${template}.`);
                    break;
            }
            
        });
};