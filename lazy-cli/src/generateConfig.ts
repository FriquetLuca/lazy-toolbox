import fs from 'fs';
import path from 'path';
import { cwd } from "node:process"; // current working directory of the Node.js process.
import { getAllFilesInDir, getAllDirsInDir, getAllInDir } from "./_common/filestream";

const db = path.join(__dirname, "../../_lazy_db/");
const modFolder = path.join(__dirname, "../../_lazy_mods/");
if(!fs.existsSync(modFolder)) {
    fs.mkdirSync(modFolder, {
        recursive: true
    });
}
if(!fs.existsSync(db)) {
    fs.mkdirSync(db, {
        recursive: true
    });
}
const createPath = (newPath: string) => {
    const dir = path.dirname(newPath);
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
            recursive: true
        });
    }
};
export interface Config {
    commandPath: string;
    rootPath: string;
    dbPath: string;
    getAllDB: (pathSrc: string, relative: boolean) => string[];
    getAllDBFiles: (pathSrc: string, relative: boolean) => string[];
    getAllDBDirs: (pathSrc: string, relative: boolean) => string[];
    getDBFile: (pathStr: string) => string | undefined;
    setDBFile: (source: string, pathStr: string, override: boolean) => void;
    setDBDir: (source: string, pathStr: string, override: boolean) => void;
    setDBAny: (source: string, pathStr: string, override: boolean) => void;
    removeDBFile: (pathStr: string) => void;
    removeDBDir: (pathStr: string) => void;
    removeDBAny: (pathStr: string) => void;
}
export const getConfig: Config = {
    commandPath: cwd(),
    rootPath: modFolder,
    dbPath: db,
    getAllDB: (pathSrc: string = "", relative: boolean = false) => {
        const files = getAllInDir(path.join(db, pathSrc));
        if(!relative) {
            return files;
        }
        const result: string[] = [];
        for(let file of files) {
            result.push(path.relative(db, file));
        }
        return result;
    },
    getAllDBFiles: (pathSrc: string = "", relative: boolean = false) => {
        const files = getAllFilesInDir(path.join(db, pathSrc));
        if(!relative) {
            return files;
        }
        const result: string[] = [];
        for(let file of files) {
            result.push(path.relative(db, file));
        }
        return result;
    },
    getAllDBDirs: (pathSrc: string = "", relative: boolean = false) => {
        const files = getAllDirsInDir(path.join(db, pathSrc));
        if(!relative) {
            return files;
        }
        const result: string[] = [];
        for(let file of files) {
            result.push(path.relative(db, file));
        }
        return result;
    },
    getDBFile: (pathStr: string) => {
        const dbElemPath = path.join(db, pathStr);
        if(fs.existsSync(dbElemPath) && !fs.statSync(dbElemPath).isDirectory()) {
            return fs.readFileSync(dbElemPath).toString();
        }
        return undefined;
    },
    removeDBFile: (pathStr: string) => {
        const dbElemPath = path.join(db, pathStr);
        if(fs.existsSync(dbElemPath) && !fs.statSync(dbElemPath).isDirectory()) {
            fs.rmSync(dbElemPath);
        }
    },
    removeDBDir: (pathStr: string) => {
        const dbElemPath = path.join(db, pathStr);
        if(fs.existsSync(dbElemPath) && fs.statSync(dbElemPath).isDirectory()) {
            fs.rmSync(dbElemPath, { recursive: true });
        }
    },
    removeDBAny: (pathStr: string) => {
        const dbElemPath = path.join(db, pathStr);
        if(fs.existsSync(dbElemPath)) {
            if(fs.statSync(dbElemPath).isDirectory()) {
                fs.rmSync(dbElemPath, { recursive: true });
            } else {
                fs.rmSync(dbElemPath);
            }
        }
    },
    setDBFile: (source: string, pathStr: string, override: boolean) => {
        const dbElemPath = path.join(db, pathStr);
        if((!fs.existsSync(dbElemPath) || override) && fs.existsSync(source) && !fs.statSync(source).isDirectory()) {
            createPath(dbElemPath);
            fs.copyFileSync(source, dbElemPath);
        } else {
            if(fs.existsSync(dbElemPath)) {
                console.error(`The file ${pathStr} already exist in the file database.`);
            }
            if(!fs.existsSync(source)) {
                console.error(`The source ${source} doesn't exist.`);
            }
        }
    },
    setDBDir: (source: string, pathStr: string, override: boolean) => {
        const dbElemPath = path.join(db, pathStr);
        if((!fs.existsSync(dbElemPath) || override) && fs.existsSync(source) && fs.statSync(source).isDirectory()) { // Destination doesn't exist
            createPath(dbElemPath);
            fs.cpSync(source, dbElemPath, { recursive: true }); // Copy
        } else {
            if(fs.existsSync(dbElemPath)) {
                console.error(`The directory ${pathStr} already exist in the file database.`);
            }
            if(!fs.existsSync(source)) {
                console.error(`The source ${source} doesn't exist.`);
            }
        }
    },
    setDBAny: (source: string, pathStr: string, override: boolean) => {
        const dbElemPath = path.join(db, pathStr);
        if((!fs.existsSync(dbElemPath) || override) && fs.existsSync(source)) {
            createPath(dbElemPath);
            if(fs.statSync(source).isDirectory()) {
                fs.cpSync(source, dbElemPath, { recursive: true }); // Copy
            } else {
                createPath(dbElemPath);
                fs.copyFileSync(source, dbElemPath);
            }
        } else {
            if(fs.existsSync(dbElemPath)) {
                console.error(`The directory ${pathStr} already exist in the file database.`);
            }
            if(!fs.existsSync(source)) {
                console.error(`The source ${source} doesn't exist.`);
            }
        }
    }
};