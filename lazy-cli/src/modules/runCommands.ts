import { Command } from "commander";
import fs from 'fs';
import path from 'path';
import { getAllFilesInDir } from "../_common/filestream";
export const registerCommands = (program: Command) => {
    const modFolder = path.join(__dirname, "/mods");
    if(!fs.existsSync(modFolder)) {
        fs.mkdirSync(modFolder);
    }
    const allMods = getAllFilesInDir(modFolder);
    for(const currentMod of allMods) {
        require(currentMod)(program);
    }
};