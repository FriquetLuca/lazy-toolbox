import path from "path";
import { Job, Profile } from "../letterFormal";

export const formal = (profile: Profile, job: Job, language: string) => {
    // `./src/${job.jobPlace.toLowerCase().replace(' ', '_')}.tex`
    const letterContent: {
        position: string;
        subject: string;
        recipient: string;
        coreLetter: string;
        footerLetter: string;
        signature: string;
    } | undefined = require(path.join(__dirname, `/formal/${language.toLowerCase()}-${job.template}.js`))(job);
    if(letterContent === undefined) {
        return undefined;
    }
return {
    path: `${job.jobPlace.toLowerCase().replace(' ', '_')}_${letterContent.position.toLowerCase().replace(' ', '_')}_${language}`,
    tex: `
\\documentclass[12pt,a4paper,roman]{letter}
\\usepackage[scale=0.75]{geometry}
\\longindentation=0pt
\\geometry{
    paper=a4paper,
    top=3cm,
    bottom=1.5cm,
    left=2.5cm,
    right=2.5cm,
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
\\opening{\\textbf{${letterContent.subject}}\\\\
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