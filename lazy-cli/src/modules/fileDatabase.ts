import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { Config } from "../generateConfig";

export const database = (program: Command, config: Config) => {
    program
        .command('fdb')
        .description('Manage the CLI file database.')
        .argument('<currentPath>', 'The current path to process.')
        .option('-a, --add <dbFilePath>', 'Insert a <currentPath> into the file database as <dbFilePath>.')
        .option('-o, --override', 'In case the <dbFilePath> has the same name as an already existing one, override it.')
        .option('-r, --remove', 'Remove the <currentPath>.')
        .option('-s, --show', 'Show the content of the <currentPath> as a string on the console if it\'s a file.')
        .option('-l, --list', 'Show a list of all directories and files inside the file database.')
        .action((currentPath, options) => {
            if(options.add) {
                config.setDBAny(
                    path.join(config.commandPath, currentPath),
                    options.add,
                    options.override
                );
            }
            if(options.remove) {
                config.removeDBAny(currentPath);
            }
            if(options.show) {
                const target = path.join(config.dbPath, options.show);
                if(fs.existsSync(target) && !fs.statSync(target).isDirectory()) {
                    console.log(config.getDBFile(options.show));
                } else {
                    if(fs.existsSync(target)) {
                        console.log(`${options.show} is not a file.`);
                    } else {
                        console.log(`${options.show} doesn't exist.`);
                    }
                }
            }
            if(options.list) {
                const paths = config.getAllDB(currentPath, true);
                for(let p of paths) {
                    console.log(p);
                }
            }
        });
};