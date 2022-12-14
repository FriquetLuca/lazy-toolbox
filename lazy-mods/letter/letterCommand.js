const fs = require("fs");
const path = require("path");
const {spawn} = require("node:child_process");

module.exports = (program, config) => {
    program
        .command('frmltr')
        .description('Create a formal letter from json datas.')
        .option('-a, --add <modName>', 'Register a new formal letter template.')
        .option('-r, --remove <modName>', 'Remove a formal letter template.')
        .option('-g, --generate', 'Generate the formal letters from a `jobs.json` file.')
        .option('-l, --list', 'List all existing templates.')
        .action((options) => {
            if(options.add) {
                const registerTemplate = path.join(config.commandPath, options.add);
                if(fs.existsSync(registerTemplate)) {
                    if(path.extname(registerTemplate) === '.js') {
                        config.setDBFile(registerTemplate, `frmltr/template/${path.basename(options.add)}`);
                        console.log(`The template ${options.add} has been added successfully.`);
                    } else {
                        console.log(`The template ${options.add} isn't a javascript module.`);
                    }
                } else {
                    console.log(`The template ${options.add} doesn't exist.`);
                }
            }
            if(options.remove) {
                config.removeDBFile(`frmltr/template/${path.basename(options.remove)}`);
            }
            if(options.generate) {
                const newJobPath = path.join(config.commandPath, `jobs.json`);
                if(fs.existsSync(newJobPath)) {
                    const _config = JSON.parse(fs.readFileSync(newJobPath).toString());
                    const languages = _config.languages ?? [ "english" ];
                    const profile = config.getDBFile('profile.json');
                    if(profile) {
                        createFormalLetter(
                            JSON.parse(profile.toString()),
                            _config.jobs,
                            languages,
                            config
                        );
                    } else {
                        console.log("You must create a `profile.json` to the file database to use this feature.");
                    }
                } else {
                    console.log("You must have a `jobs.json` inside the current directory to generate a letter.");
                }
            }
            if(options.list) {
                const allPaths = config.getAllDB('frmltr/template/', true);
                for(let p of allPaths) {
                    console.log(p);
                }
            }
        });
};
const formal = (profile, job, language, config) => {
    const modPath = path.join(config.dbPath, `frmltr/template/${language.toLowerCase()}-${job.template.toLowerCase()}.js`);
    if(!fs.existsSync(modPath)) {
        return undefined;
    }
    const modContent = require(modPath);
    const letterContent = modContent !== undefined ? modContent(job) : undefined;
    if(letterContent === undefined) {
        return undefined;
    }
return {
    path: `${job.jobPlace.toLowerCase().replace(' ', '_')}_${letterContent.position.toLowerCase().replace(' ', '_')}_${language}`,
    tex: `
\\documentclass[12pt,a4paper,roman]{letter}
\\usepackage[scale=0.9]{geometry}
\\longindentation=0pt
\\geometry{
    paper=a4paper,
    top=2.5cm,
    bottom=1.5cm,
    left=2cm,
    right=2cm,
}
\\usepackage[T1]{fontenc}
\\usepackage[utf8]{inputenc}
\\usepackage[french]{babel}
\\usepackage[OT1]{fontenc}
\\address{
    ${profile.lastName} ${profile.firstName}\\\\
    ${profile.street}, ${profile.streetNumber}\\\\ % ADRESSE
    ${profile.zipCode}, ${profile.city}\\\\ % ADRESSE
    Téléphone: ${profile.phoneNumber}\\\\ % TELEPHONE
    E-mail: ${profile.emailAddress}
} % MAIL

\\signature{
    \\begin{center}
        ${profile.lastName} ${profile.firstName}
    \\end{center}
}
%----------------------------------------------------------------------------------------
\\begin{document}

\\begin{letter}{}
\\date{\\today}
\\opening{\\textbf{${letterContent.subject}}\\\\\\\\
\\vspace{\\parskip}${letterContent.recipient}, }
\\vspace{\\parskip}

${letterContent.coreLetter.replaceAll('\n', '\\\\').replaceAll('#', '\\#')}\\\\

${letterContent.footerLetter}
\\vspace{\\parskip}
\\closing{${letterContent.signature},}
\\vspace{\\parskip}
\\end{letter}
\\end{document}
`,
    txt: `${letterContent.subject}\n\n${letterContent.coreLetter}\n${letterContent.footerLetter}\n\n${letterContent.signature}, ${profile.lastName} ${profile.firstName}.`
    };
};
const newFormalLetter = (profile, tempPath, job, language, config) => {
    const content = formal(profile, job, language, config);
    if(content === undefined) {
        console.log(`The ${language} version of ${job.template} template for ${job.jobPlace} doesn't exist. You should make it if you need it.`);
        return;
    }
    // Create temp .tex file
    fs.writeFileSync(`${path.join(tempPath, content.path)}.tex`, content.tex);
    // Create .txt
    fs.writeFileSync(`${path.join(path.join(config.commandPath, '/txt'), content.path)}.txt`, content.txt);
};
const createFormalLetter = (profile, jobs, languages, config) => {
    const crypto = require("crypto");
    const id = crypto.randomBytes(16).toString("hex");
    const txtDirPath = path.join(config.commandPath, '/txt');
    const pdfDirPath = path.join(config.commandPath, '/pdf');
    if(!fs.existsSync(txtDirPath)) {
        fs.mkdirSync(txtDirPath);
    }
    if(!fs.existsSync(pdfDirPath)) {
        fs.mkdirSync(pdfDirPath);
    }
    const tempPath = path.join(config.dbPath, `/${id}/`);
    fs.mkdirSync(tempPath);
    // Generate all formal letters
    for(let language of languages) {
        for(let job of jobs) {
            newFormalLetter(profile, tempPath, job, language, config);
        }
    }
    try {
        const latexmk = spawn("latexmk", ["-interaction=nonstopmode","-file-line-error","-pdf",`-outdir=${pdfDirPath}`], {
            cwd: tempPath
        });
        latexmk.on('exit', () => {
            fs.rmSync(tempPath, { recursive: true });
            fs.readdirSync(pdfDirPath).forEach((file, index) => {
                const curPath = path.join(pdfDirPath, file);
                if(path.extname(curPath) !== '.pdf') {
                    fs.rmSync(curPath); // Delete
                }
            });
            console.log("All formal letters has been compiled.");
        });
    } catch(err) {
        console.log("An error occured while compiling. Make sure you have LaTeX installed.");
    }
};