import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { cwd } from "node:process";
export const tools = (program: Command) => {
    program
        .command('project')
        .description('Create a lazy-toolbox project.')
        .argument('<projectName>', 'Name of the project.')
        .option('-r, --router', 'Create the router on the app.')
        .option('-s, --socket', 'Create sockets on the app.')
        .option('-t, --ts', 'Make the project a TypeScript project.')
        .action((projectName: string, options) => {
            const hasRouter = options.router;
            const hasSocket = options.socket;
            const typed = options.ts;
            
        });
};