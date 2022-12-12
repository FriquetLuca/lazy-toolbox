import fs from 'fs';
import path from "path";
import {formal} from "./templates/formalTemplate";
import { cwd } from "process";
import { spawn } from 'node:child_process';
import { deleteDirectory } from '../_common/filestream';
export interface Profile {
    firstName: string,
    lastName: string,
    street: string,
    streetNumber: string,
    city: string,
    zipCode: string,
    phoneNumber: string,
    emailAddress: string
}
export interface Job {
    jobName: string | {[label:string]:string},
    jobPlace: string,
    template: string,
    recipient?: string,
    canLearn?: string[]
};
const newFormalLetter = (profile: Profile, tempPath: string, job: Job, language: string) => {
    const content = formal(profile, job, language);
    // Create temp .tex file
    fs.writeFileSync(`${path.join(tempPath, content.path)}.tex`, content.tex);
    // Create .txt
    fs.writeFileSync(`${path.join(path.join(cwd(), '/txt'), content.path)}.txt`, content.txt);
};
export const createFormalLetter = (profile: Profile, jobs: Job[], languages: string[]) => {
    const crypto = require("crypto");
    const id: string = crypto.randomBytes(16).toString("hex");
    const currentDir = cwd();
    const txtDirPath = path.join(currentDir, '/txt');
    const pdfDirPath = path.join(currentDir, '/pdf');
    if(!fs.existsSync(txtDirPath)) {
        fs.mkdirSync(txtDirPath);
    }
    if(!fs.existsSync(pdfDirPath)) {
        fs.mkdirSync(pdfDirPath);
    }
    const tempPath = path.join(__dirname, `/${id}/`);
    fs.mkdirSync(tempPath);
    // Generate all formal letters
    for(let language of languages) {
        for(let job of jobs) {
            newFormalLetter(profile, tempPath, job, language);
        }
    }
    try {
        const latexmk = spawn("latexmk", ["-interaction=nonstopmode","-file-line-error","-pdf",`-outdir=${pdfDirPath}`], {
            cwd: tempPath
        });
        latexmk.on('exit', () => {
            deleteDirectory(tempPath);
            fs.readdirSync(pdfDirPath).forEach((file, index) => {
                const curPath = path.join(pdfDirPath, file);
                if(path.extname(curPath) !== '.pdf') {
                    fs.unlinkSync(curPath); // Delete
                }
            });
            console.log("All formal letters has been compiled.");
        });
    } catch(err) {
        console.log("An error occured while compiling. Make sure you have LaTeX installed.");
    }
};