import fs from 'fs';
import path from 'path';
export const getAllInDir = (p: string, a: string[] = []): string[] => {
    if(fs.statSync(p).isDirectory()) {
        fs.readdirSync(p)
            .map((f: string) => getAllInDir(a[a.push(path.join(p, f)) - 1], a));
    }
    return a;
};
export const getAllFilesInDir = (p: string): string[] => {
    return getAllInDir(p)
        .filter((unknownPath: string) => !fs.lstatSync(unknownPath).isDirectory());
};
export const deleteDirectory = (directoryPath: string) => {
    if (fs.existsSync(directoryPath)) {
        fs.readdirSync(directoryPath).forEach((file, index) => {
            const curPath = path.join(directoryPath, file);
            if (fs.lstatSync(curPath).isDirectory()) { 
                deleteDirectory(curPath); // recursion
            } else {
                fs.unlinkSync(curPath); // Delete
            }
        });
        fs.rmdirSync(directoryPath);
    }
};