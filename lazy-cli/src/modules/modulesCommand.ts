import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { cwd } from "node:process"; // current working directory of the Node.js process.
import { getAllFilesInDir } from "../_common/filestream";
export const modules = (program: Command) => {
    program
        .command('module')
        .description('Module command.')
        .option('-a, --add <modulePath>', 'Add a new command module.')
        .option('-r, --remove <modulePath>', 'Remove a command module.')
        .option('-l, --list', 'Show all modules.')
        .action((options) => {
            const modFolder = path.join(__dirname, "/mods");
            if(!fs.existsSync(modFolder)) {
                fs.mkdirSync(modFolder);
            }
            if(options.list) {
                const allMods = getAllFilesInDir(modFolder);
                for(const currentMod of allMods) {
                    console.log(path.relative(__dirname, currentMod));
                }
            } else {
                if(options.add) {
                    const newSocketPath = path.join(cwd(), options.add);
                    const modName = path.basename(options.add);
                    if(fs.existsSync(newSocketPath)) {
                        const dest = path.join(modFolder, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                        fs.writeFileSync(dest, fs.readFileSync(newSocketPath).toString());
                        require(dest)(program);
                    } else {
                        console.log(`The module ${modName} doesn't exist.`);
                    }
                } else {
                    const modName = path.basename(options.remove);
                    const dest = path.join(modFolder, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                    if(fs.existsSync(dest)) {
                        fs.rmSync(dest);
                        console.log(`The module ${modName} has been removed successfuly.`);
                    } else {
                        console.log(`The module ${modName} doesn't exist.`);
                    }
                }
            }
        });
};