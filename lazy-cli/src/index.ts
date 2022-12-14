#! /usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { getConfig } from "./generateConfig";
import { modules } from './modules/modulesCommand';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
const program = new Command();

// ROOT
program
    .name(config.name)
    .description(config.description)
    .version(config.version);
program.command("@mod")
    .description("Get the mod path.")
    .action(() => {
        console.log(`Modules are located at ${getConfig.rootPath}.`);
    });
program.command("@fdb")
    .description("Get the file database path.")
    .action(() => {
        console.log(`File database is located at ${getConfig.dbPath}.`);
    });
modules(program, getConfig);
program.parse();