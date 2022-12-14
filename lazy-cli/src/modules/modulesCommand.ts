import fs from 'fs';
import path from 'path';
import { Command } from "commander";
import { Config } from "../generateConfig";
import { database } from "./fileDatabase";
import { getAllFilesInDir } from "../_common/filestream";
import { getType } from "../_common/getType";
import { runCommands } from "./runCommands";
export const modules = (program: Command, config: Config) => {
    program
        .command('mod')
        .description('Manage the CLI modules.')
        .option('-a, --add <modulePath>', 'Add a module into the CLI modules. The module must be a `.js` file.')
        .option('-r, --remove <modulePath>', 'Remove a module from the CLI modules.')
        .option('-l, --list', 'List all installed CLI modules.')
        .option('-s, --show <dataPath>', 'Show the file content of the specified CLI module.')
        .option('-o, --override', 'In case the new module has the same name as another one, override it.')
        .action((options) => {
            if(options.add) {
                const addPath = path.join(config.commandPath, options.add);
                const modName = path.basename(options.add);
                if(fs.existsSync(addPath)) {
                    const dest = path.join(config.rootPath, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                    const destExist = fs.existsSync(dest);
                    if(destExist && options.override) {
                        fs.rmSync(dest);
                    }
                    if(!destExist || options.override) {
                        fs.writeFileSync(dest, fs.readFileSync(addPath));
                    }
                    const moduleProgram = require(dest);
                    if(moduleProgram) {
                        const modType = getType(moduleProgram);
                        switch(modType) {
                            case 'function':
                                try {
                                    moduleProgram(program, config);
                                } catch(e) {
                                    fs.rmSync(dest);
                                    console.log(`The module ${modName} can't be loaded.\nERROR:\n${e}\n\nThe module it will be removed.`);
                                }
                                break;
                            case 'class':
                                try {
                                    new moduleProgram(program, config);
                                } catch(e) {
                                    fs.rmSync(dest);
                                    console.log(`The module ${modName} can't be loaded.\nERROR:\n${e}\n\nThe module it will be removed.`);
                                }
                                break;
                            default:
                                console.log(`The module ${modName} isn't a valid imported module.`);
                                fs.rmSync(dest);
                                break;
                        }
                    } else {
                        console.log(`The module ${modName} is not defined.`);
                        fs.rmSync(dest);
                    }
                } else {
                    console.log(`The module ${modName} doesn't exist.`);
                }
            }
            if(options.remove) {
                const modName = options.remove;
                const dest = path.join(config.rootPath, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                if(fs.existsSync(dest)) {
                    fs.rmSync(dest);
                    console.log(`The module ${modName} has been removed successfuly.`);
                } else {
                    console.log(`The module ${modName} doesn't exist.`);
                }
            }
            if(options.list) {
                const allMods = getAllFilesInDir(config.rootPath);
                for(const currentMod of allMods) {
                    console.log(path.relative(config.rootPath, currentMod));
                }
            }
            if(options.show) {
                const modName = options.show;
                const dest = path.join(config.rootPath, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                if(fs.existsSync(dest)) {
                    console.log(fs.readFileSync(dest));
                } else {
                    console.log(`The module ${modName} doesn't exist.`);
                }
            }
        });
    runCommands(program, config);
    database(program, config);
};