import path from 'path';
import fs from 'fs';
import { Command } from "commander";
import { Config } from "../generateConfig";
import { getAllFilesInDir } from "../_common/filestream";
import { getType } from "../_common/getType";
export const runCommands = (program: Command, config: Config) => {
    const allMods = getAllFilesInDir(config.rootPath);
    for(const currentMod of allMods) {
        const modName = path.relative(config.rootPath, currentMod);
        try {
            const moduleProgram = require(currentMod);
            if(moduleProgram) {
                const modType = getType(moduleProgram);
                switch(modType) {
                    case 'function':
                        try {
                            moduleProgram(program, config);
                        } catch(e) {
                            fs.rmSync(currentMod);
                            console.log(`The module ${modName} can't be loaded.\nError:\n${e}\n\nThe module it will be removed.`);
                        }
                        break;
                    case 'class':
                        try {
                            new moduleProgram(program, config);
                        } catch(e) {
                            fs.rmSync(currentMod);
                            console.log(`The module ${modName} can't be loaded.\nError:\n${e}\n\nThe module it will be removed.`);
                        }
                        break;
                    default:
                        console.log(`The module ${modName} isn't a valid imported module.`);
                        break;
                }
            } else {
                console.log(`The module ${modName} is not defined.`);
            }
        } catch(e) {
            console.error(`Module ${modName} has failed loading.\nError:\n${e}`);
        }
    }
};