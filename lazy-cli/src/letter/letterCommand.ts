import fs from 'fs';
import path from "path";
import { Command } from "commander";
import { cwd } from "process";
import { createFormalLetter } from './letterFormal';
export const getLetter = (program: Command) => {
    program
        .command('letter')
        .description('Create a letter template from json datas.')
        .argument('<letterTemplate>', 'The letter template to use or to register (must be named `language-template.js`)')
        .option('-r, --register <modName>', 'Register a new formal letter template.')
        .action((letterTemplate: string, options) => {
            letterTemplate = letterTemplate.toLowerCase();
            if(letterTemplate === "formal") {
                if(options.register) {
                    const registerTemplate = path.join(cwd(), options.register);
                    console.log(registerTemplate)
                    if(fs.existsSync(registerTemplate)) {
                        if(path.extname(registerTemplate) === '.js') {
                            const newFormalTemplate = fs.readFileSync(registerTemplate);
                            fs.writeFileSync(path.join(__dirname, `/templates/formal/${options.register}`), newFormalTemplate);
                            console.log("The new template has been successfuly added to your collection.");
                        } else {
                            console.log("The specified template isn't a javascript module.");
                        }
                    } else {
                        console.log("The specified template doesn't exist.");
                    }
                } else {
                    const newJobPath = path.join(cwd(), `jobs.json`);
                    if(fs.existsSync(newJobPath)) {
                        const config = JSON.parse(fs.readFileSync(newJobPath).toString());
                        const languages = config.languages ?? [ "English", "French" ];
                        createFormalLetter(
                            JSON.parse(fs.readFileSync(path.join(__dirname, '../register/profile.json')).toString()),
                            config.jobs,
                            languages
                        );
                    } else {
                        console.log("You need to have a `jobs.json` inside this directory to generate a letter.");
                    }
                }
            }
        });
};