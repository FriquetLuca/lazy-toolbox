import fs from 'fs';
import path from 'path';
export const getAllInDir = (p: string, a: string[] = []): string[] => {
    if(fs.statSync(p).isDirectory()) {
        fs.readdirSync(p)
            .map((f: string) => getAllInDir(a[a.push(path.join(p, f)) - 1], a));
    }
    return a;
};
export const getAllDirsInDir = (p: string): string[] => {
    return getAllInDir(p)
        .filter((unknownPath: string) => fs.lstatSync(unknownPath).isDirectory());
};
export const getAllFilesInDir = (p: string): string[] => {
    return getAllInDir(p)
        .filter((unknownPath: string) => !fs.lstatSync(unknownPath).isDirectory());
};