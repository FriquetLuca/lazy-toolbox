const fs = require('fs');
const path = require('path');
const util = require('util');
const fsp = util.promisify(fs.readFile);

const readSource = async (sourcePath) => {
    return await fsp(path.join(__dirname, './src/', sourcePath));
};
const readServer = async (serverPath) => {
    return await readSource(`./server/${serverPath}`);
};
const readPortable = async (portablePath) => {
    return await readSource(`./portable/${portablePath}`);
};
const readClient = async (clientPath) => {
    return await readSource(`./client/${clientPath}`);
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
    const _INDEX = async () => {
        const _index = await readSource('_INDEX.md');
        const _clientIndex = await readClient('_INDEX.md');
        const _portableIndex = await readPortable('_INDEX.md');
        const _serverIndex = await readServer('_INDEX.md');
        return `${_index}\n\t${_clientIndex.toString().replaceAll('\n', '\n\t')}\n\t${_portableIndex.toString().replaceAll('\n', '\n\t')}\n\t${_serverIndex.toString().replaceAll('\n', '\n\t')}\n`;
    };
    const _DOC = async () => {
        const _doc = await readSource('_DOC.md');
        const _clientDoc = await docMaker('./src/client/');
        const _portableDoc = await docMaker('./src/portable/');
        const _serverDoc = await docMaker('./src/server/');
        return `\n${_doc}\n### [Client](#client)\n${_clientDoc}\n### [Portable](#portable)\n${_portableDoc}\n### [Server](#server)\n${_serverDoc}`;
    }
    const _intro = await readSource('_INTRO.md');
    const _index = await _INDEX();
    const _install = await readSource('_INSTALL.md');
    const _updates = await readSource('_UPDATES.md');
    const _doc = await _DOC();
    return `${_intro}\n${_index}\n${_install}\n${_updates}\n${_doc}`;
};
const createServerDoc = async () => {
    const _INDEX = async () => {
        const _index = await readSource('_INDEX.md');
        const _serverIndex = await readServer('_INDEX.md');
        return `${_index}\n\t${_serverIndex.toString().replaceAll('\n', '\n\t')}\n`;
    };
    const _DOC = async () => {
        const _doc = await readSource('_DOC.md');
        const _serverDoc = await docMaker('./src/server/');
        return `\n${_doc}\n### [Server](#server)\n${_serverDoc}`;
    }
    const _intro = await readServer('_INTRO.md');
    const _index = await _INDEX();
    const _install = await readServer('_INSTALL.md');
    const _updates = await readServer('_UPDATES.md');
    const _doc = await _DOC();
    return `${_intro}\n${_index}\n${_install}\n${_updates}\n${_doc}`;
};
const createPortableDoc = async () => {
    const _INDEX = async () => {
        const _index = await readSource('_INDEX.md');
        const _portableIndex = await readPortable('_INDEX.md');
        return `${_index}\n\t${_portableIndex.toString().replaceAll('\n', '\n\t')}\n`;
    };
    const _DOC = async () => {
        const _doc = await readSource('_DOC.md');
        const _portableDoc = await docMaker('./src/portable/');
        return `\n${_doc}\n### [Portable](#portable)\n${_portableDoc}\n`;
    }
    const _intro = await readPortable('_INTRO.md');
    const _index = await _INDEX();
    const _install = await readPortable('_INSTALL.md');
    const _updates = await readPortable('_UPDATES.md');
    const _doc = await _DOC();
    return `${_intro}\n${_index}\n${_install}\n${_updates}\n${_doc}`;
};
const createClientDoc = async () => {
    const _INDEX = async () => {
        const _index = await readSource('_INDEX.md');
        const _clientIndex = await readClient('_INDEX.md');
        return `${_index}\n\t${_clientIndex.toString().replaceAll('\n', '\n\t')}\n`;
    };
    const _DOC = async () => {
        const _doc = await readSource('_DOC.md');
        const _clientDoc = await docMaker('./src/client/');
        return `\n${_doc}\n### [Client](#client)\n${_clientDoc}\n`;
    }
    const _intro = await readClient('_INTRO.md');
    const _index = await _INDEX();
    const _install = await readClient('_INSTALL.md');
    const _updates = await readClient('_UPDATES.md');
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
    const _docServ = await createServerDoc();
    fs.writeFile(path.join(_ROOT, 'lazy-server/README.md'), _docServ, cb);
    const _docPort = await createPortableDoc();
    fs.writeFile(path.join(_ROOT, 'lazy-portable/README.md'), _docPort, cb);
    const _docCli = await createClientDoc();
    fs.writeFile(path.join(_ROOT, 'lazy-client/README.md'), _docCli, cb);

};

makeDocumentation();