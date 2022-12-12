#! /usr/bin/env node

import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import { template } from './template/templateCommand';
import { getLetter } from './letter/letterCommand';
import { register } from './register/registerCommand';
import { registered } from './register/registeredCommand';
import { modules } from './modules/modulesCommand';
import { registerCommands } from './modules/runCommands';

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json')).toString());
const program = new Command();

// ROOT
program
    .name(config.name)
    .description(config.description)
    .version(config.version);
// template
template(program);
// register
register(program);
registered(program);
// formal letter
getLetter(program);
// Modules
modules(program);

// Register all custom mods
registerCommands(program);
program.parse();