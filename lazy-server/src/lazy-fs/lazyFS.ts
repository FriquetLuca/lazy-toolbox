import fs from "fs";
import path from "path";
import util from 'util';
const fsp = util.promisify(fs.readFile);
/**
 * A lazy file stream for some lazy recursive functions.
 * @function getAllInDir Get everything inside a directory.
 * @function getAllFilesInDir Get all files inside a directory.
 * @function getAllDirsInDir Get all directories inside a directory.
 */
export class LazyFS {
    /**
     * Get everything inside a directory.
     * @param {string} p The path of the root folder.
     * @param {string[]} a An array containing all the result from the recursive algorithm.
     * @returns {string[]} Return an array of string containing all the directories, files, subdirectories and the files associates with them.
     */
    public static getAllInDir(p: string, a: string[] = []): string[] {
        if(fs.statSync(p).isDirectory()) {
            fs.readdirSync(p)
                .map((f: string) => LazyFS.getAllInDir(a[a.push(path.join(p, f)) - 1], a));
        }
        return a;
    }
    /**
     * Get all files inside a directory.
     * @param {string} p The path of the root folder.
     * @returns {string[]} Return an array of string containing all the files inside the directory and subdirectories.
     */
    public static getAllFilesInDir(p: string): string[] {
        return LazyFS.getAllInDir(p)
            .filter((unknownPath: string) => !fs.lstatSync(unknownPath).isDirectory());
    }
    /**
     * Get all directories inside a directory.
     * @param {string} p The path of the root folder.
     * @returns {string[]} Return an array of string containing all the directories and subdirectories.
     */
    public static getAllDirsInDir(p: string): string[] {
        return LazyFS.getAllInDir(p)
            .filter((unknownPath: string) => fs.lstatSync(unknownPath).isDirectory());
    }
    /**
     * Delete a directory and every content it has inside with recursion.
     * @param {string} directoryPath The path to the directory to delete.
     */
    public static deleteDirectory(directoryPath: string): void {
        if (fs.existsSync(directoryPath)) {
            fs.readdirSync(directoryPath).forEach((file, index) => {
                const curPath = path.join(directoryPath, file);
                if (fs.lstatSync(curPath).isDirectory()) { 
                    LazyFS.deleteDirectory(curPath); // recursion
                } else {
                    fs.unlinkSync(curPath); // Delete
                }
            });
            fs.rmdirSync(directoryPath);
        }
    }
    /**
     * Delete a directory or a file. In case of a directory, it will behave like LazyFS.deleteDirectory.
     * @param {string} anyPath The path to what you want to delete.
     */
    public static delete(anyPath: string): void {
        if (fs.existsSync(anyPath)) {
            if (fs.lstatSync(anyPath).isDirectory()) { 
                LazyFS.deleteDirectory(anyPath); // directory
            } else {
                fs.unlinkSync(anyPath); // Delete
            }
        }
    }
    /**
     * Asynchronously read a file and return a promise buffer with the file content.
     * @param filePath A path to a file. If a URL is provided, it must use the `file:` protocol. If a file descriptor is provided, the underlying file will not be closed automatically.
     * @param {{ encoding?: null | undefined; flag?: string | undefined; } | null | undefined} options An object that may contain an optional flag. If a flag is not provided, it defaults to `'r'`.
     * @returns {Promise<Buffer>} The file buffer.
     */
    public static async readFile(filePath: string, options?: { encoding?: null | undefined; flag?: string | undefined; } | null | undefined): Promise<Buffer> {
        return await fsp(filePath, options);
    }
}