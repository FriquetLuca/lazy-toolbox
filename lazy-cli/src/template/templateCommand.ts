import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { cwd } from "node:process"; // current working directory of the Node.js process.
import { templateHTML } from './templateHTML';
import { templateRoute } from './templateRoute';
import { templateSocket } from './templateSocket';

const createTemplate = (ext: string, str: string, params: any, options: any, func: any, failMsg: string) => {
    const newSocketPath = path.join(cwd(), `${str.toLowerCase()}.${ext}`);
    if(!fs.existsSync(newSocketPath)) {
        fs.writeFileSync(newSocketPath, func(params));
    } else {
        if(options.override) {
            fs.rmSync(newSocketPath);
            fs.writeFileSync(newSocketPath, func(params));
        } else {
            console.log(failMsg);
        }
    }
};
export const template = (program: Command) => {
    program
        .command('template')
        .description('Create a template file to start working faster.')
        .argument('<template>', 'Template name')
        .argument('<fileName>', 'File name (will be converted in lower case)')
        .option('-o, --override', 'Force the file to be created. It will override any file if it exist.')
        .action((template: string, str: string, options) => {
            switch(template) {
                case 'html':
                    createTemplate('html', str, path.basename(str), options, templateHTML, 'The HTML file already exist.');
                    break;
                case 'lazy-view':
                    createTemplate('ts', str, path.basename(str), options, templateRoute, 'The TypeScript file already exist.');
                    break;
                case 'socket-connect':
                    createTemplate('ts', str, 'connect', options, templateSocket, 'The TypeScript file already exist.');
                    break;
                case 'socket-message':
                    createTemplate('ts', str, 'message', options, templateSocket, 'The TypeScript file already exist.');
                    break;
                case 'socket-disconnect':
                    createTemplate('ts', str, 'disconnect', options, templateSocket, 'The TypeScript file already exist.');
                    break;
                default:
                    console.log(`Unknown template type ${template}.`);
                    break;
            }
            
        });
};