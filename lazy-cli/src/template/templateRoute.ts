export const templateRoute = (title: string) => `import { LazyRouter } from 'lazy-toolbox';
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