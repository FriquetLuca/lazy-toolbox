import { Command } from "commander";
import path from "path";
import fs from 'fs';
import { cwd } from "process";

export const register = (program: Command) => {
    program
        .command('register')
        .description('Register a `.json` data to lazy-cli or remove it if it\'s specified.')
        .argument('<fileJSON>', 'The `file.json` path to register.')
        .option('-r, --remove', 'Remove the specified JSON file from the register.')
        .option('-o, --override', 'Force the new JSON file to override the old one instead of merging them together.')
        .action((_profileJSON: string, options) => {
            if(options.remove) {
                const tryPath = path.join(__dirname, _profileJSON);
                if(fs.existsSync(tryPath)) {
                    fs.rmSync(tryPath);
                    console.log('The file has been removed sucessfuly.');
                } else {
                    console.log('The file doesn\'t exist.');
                }
                return;
            }
            const profilePath = path.join(cwd(), _profileJSON);
            const profileBaseName = path.basename(_profileJSON);
            const profileBaseNameNoExt = profileBaseName.substring(0, profileBaseName.length - path.extname(profileBaseName).length);
            if(fs.existsSync(profilePath)) {
                const currentProfile = path.join(__dirname, profileBaseName);
                const newProfile = fs.readFileSync(profilePath).toString();
                let toWrite: string, toLog: string;
                if(fs.existsSync(currentProfile)) {
                    if(!options.override) {
                        const newProfileJSON = JSON.parse(newProfile);
                        const currentProfileJSON = JSON.parse(currentProfile);
                        for(const prop in newProfileJSON) {
                            currentProfileJSON[prop] = newProfileJSON[prop];
                        }
                        toWrite = JSON.stringify(currentProfileJSON);
                    } else {
                        toWrite = newProfile;
                    }
                    fs.rmSync(currentProfile);
                    toLog = `The ${profileBaseNameNoExt} has been modified.`;
                } else {
                    toWrite = newProfile;
                    toLog = `The ${profileBaseNameNoExt} has been set.`;
                }
                fs.writeFileSync(currentProfile, toWrite);
                console.log(toLog);
            } else {
                console.log(`The ${profileBaseNameNoExt} doesn't exist.`);
            }
        });
};