import { Command } from "commander";
import path from "path";
import fs from 'fs';
import { getAllFilesInDir } from "../_common/filestream";
export const registered = (program: Command) => {
    program
        .command('registered')
        .description('Get the list of all registered JSON files.')
        .option('-s, --show <jsonFile>', 'Show the specified registered JSON.')
        .action((options) => {
            const contained = getAllFilesInDir(__dirname)
            for(const filePath of contained) {
                const currentExt = path.extname(filePath).toLowerCase();
                if(currentExt === ".json") {
                    const currentBasename = path.basename(filePath);
                    if(options.show && path.basename(options.show) === currentBasename) {
                        console.log(`${currentBasename}:\n${fs.readFileSync(filePath)}`);
                        break;
                    }
                    if(!options.show) {
                        console.log(path.relative(__dirname, filePath));
                    }
                }
            }
        });
};