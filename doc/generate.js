const fs = require('fs');
const path = require('path');
const util = require('util');
const fsp = util.promisify(fs.readFile);
const sources = [
    {path:'client', title:'Client', anchor:'client', dist: 'lazy-client'},
    {path:'portable', title:'Portable', anchor:'portable', dist: 'lazy-portable'},
    {path:'server', title:'Server', anchor:'server', dist: 'lazy-server'},
    {path:'mysql', title:'MySql', anchor:'mysql', dist: 'lazy-mysql'}
];
if(typeof String.prototype.replaceAll === "undefined") {
    String.prototype.replaceAll = function(match, replace) {
       return this.replace(new RegExp(match, 'g'), () => replace);
    }
}
const readSource = async (sourcePath) => {
    return await fsp(path.join(__dirname, './src/', sourcePath));
};
const getAllInDir = (p, a = []) => {
    if(fs.statSync(p).isDirectory()) {
        fs.readdirSync(p)
            .map((f) => getAllInDir(a[a.push(path.join(p, f)) - 1], a));
    }
    return a;
}
const getAllFilesInDir = (p) => {
    return getAllInDir(p)
        .filter((unknownPath) => !fs.lstatSync(unknownPath).isDirectory());
}
const docMaker = async (getPath) => {
    let docResult = '';
    const allFiles = getAllFilesInDir(path.join(__dirname, getPath));
    for(let file of allFiles) {
        if(path.basename(file)[0] === '_') {
            continue;
        }
        const getfile = await fsp(file);
        docResult = `${docResult}${getfile}\n`;
    }
    return docResult;
};
const createFullDoc = async () => {
    const _INDEX = async (sources) => {
        const _index = await readSource('_INDEX.md');
        let result = _index.toString();
        for(let source of sources) {
            const _currentIndex = await readSource(`${source.path}/_INDEX.md`);
            result = `${result}\n\t${_currentIndex.toString().replaceAll('\n', '\n\t')}`;
        }
        return result;
    };
    const _DOC = async (sources) => {
        const _doc = await readSource('_DOC.md');
        let result = _doc.toString();
        for(let source of sources) {
            const fetchDoc = await docMaker(`./src/${source.path}/`);
            result = `${result}\n### [${source.title}](#${source.anchor})\n${fetchDoc}`;
        }
        return result;
    }
    const _intro = await readSource('_INTRO.md');
    const _index = await _INDEX(sources);
    const _install = await readSource('_INSTALL.md');
    const _updates = await readSource('_UPDATES.md');
    const _doc = await _DOC(sources);
    return `${_intro}\n${_index}\n${_install}\n${_updates}\n${_doc}`;
};
const createPackageDoc = async (docFolderName, title, anchor) => {
    const _INDEX = async () => {
        const _index = await fsp(path.join(__dirname, './src/_INDEX.md'));
        const _currentIndex = await fsp(path.join(__dirname, `./src/${docFolderName}/_INDEX.md`));
        return `${_index}\n\t${_currentIndex.toString().replaceAll('\n', '\n\t')}\n`;
    };
    const _DOC = async () => {
        const _doc = await fsp(path.join(__dirname, './src/_DOC.md'));
        const _currentDoc = await docMaker(`./src/${docFolderName}/`);
        return `\n${_doc}\n### [${title}](#${anchor})\n${_currentDoc}\n`;
    }
    const _intro = await fsp(path.join(__dirname, `./src/${docFolderName}/_INTRO.md`));
    const _index = await _INDEX();
    const _install = await fsp(path.join(__dirname, `./src/${docFolderName}/_INSTALL.md`));
    const _updates = await fsp(path.join(__dirname, `./src/${docFolderName}/_UPDATES.md`));
    const _doc = await _DOC();
    return `${_intro}\n${_index}\n${_install}\n${_updates}\n${_doc}`;
};
const makeDocumentation = async () => {
    const _ROOT = path.join(__dirname, '../');
    const cb = function (err) {
        if (err) throw err;
    };
    const _doc = await createFullDoc();
    fs.writeFile(path.join(_ROOT, 'README.md'), _doc, cb);
    for(let source of sources) {
        const _docPack = await createPackageDoc(source.path, source.title, source.anchor);
        fs.writeFile(path.join(_ROOT, source.dist, './README.md'), _docPack, cb);
    }
};

makeDocumentation();
console.log("Documentation has been generated!");