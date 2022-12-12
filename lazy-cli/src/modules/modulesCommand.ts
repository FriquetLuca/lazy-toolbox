import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { cwd } from "node:process"; // current working directory of the Node.js process.
import { getAllFilesInDir } from "../_common/filestream";
export const modules = (program: Command) => {
    program
        .command('module')
        .description('Module command.')
        .argument('-a, --add <modulePath>', 'Add a new command module.')
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
                const newSocketPath = path.join(cwd(), options.add);
                if(fs.existsSync(newSocketPath)) {
                    let modName = path.basename(options.add);
                    const dest = path.join(modFolder, `${modName.substring(0, modName.length - path.extname(modName).length)}.js`);
                    fs.writeFileSync(dest, fs.readFileSync(newSocketPath).toString());
                    require(dest)(program);
                } else {
                    console.log("The specified module doesn't exist.");
                }
            }
        });
};