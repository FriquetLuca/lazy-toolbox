import { FastifyReply, FastifyRequest } from 'fastify';
import { LazyRouter } from 'lazy-toolbox';
import fs from "fs";
import path from 'path';
module.exports = (route: string, router: LazyRouter, appProcess: any) => {
    const fastify = router.getFastify();
    const htmlFile = fs.readFileSync(path.join(appProcess.rootDirectory, 'public/index.html'));
    console.log(htmlFile.toString());
    const index = async (request: FastifyRequest, reply: FastifyReply) => reply.type('text/html').send(htmlFile.toString());
    fastify.get('/', index);
    fastify.get(route, index);
};
