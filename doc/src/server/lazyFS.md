#### [LazyFS](#lazyFS)
```ts
class LazyFS {
    static getAllInDir(p: string, a: string[] = []): string[];
    static getAllFilesInDir(p: string): string[];
    static getAllDirsInDir(p: string): string[];
    static deleteDirectory(directoryPath: string): void;
    static delete(anyPath: string): void;
    static async readFile(filePath: string, options?: { encoding?: null | undefined; flag?: string | undefined; } | null | undefined): Promise<Buffer>;
}
```

A lazy file stream for some lazy recursive functions.

Example:

`File explorer`:
```fileExplorer
- Root
    - FolderA
        - FolderC
        - script.js
    - FolderB
    - file.exe
```
`main.js`:
```js
const { LazyFS } = require('lazy-toolbox');
// Get everything inside a directory
const everything = LazyFS.getAllInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA
C:\Somewhere\...\Root\FolderA\FolderC
C:\Somewhere\...\Root\FolderA\script.js
C:\Somewhere\...\Root\FolderB
C:\Somewhere\...\Root\file.exe
*/
for(let path of everything) {
    console.log(path);
}
// Get all files inside a directory
const files = LazyFS.getAllFilesInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA\script.js
C:\Somewhere\...\Root\file.exe
*/
for(let path of files) {
    console.log(path);
}
// Get all directories inside a directory
const directories = LazyFS.getAllFilesInDir(__dirname);
/* Result:
C:\Somewhere\...\Root\FolderA
C:\Somewhere\...\Root\FolderA\FolderC
C:\Somewhere\...\Root\FolderB
*/
for(let path of directories) {
    console.log(path);
}
// Delete the current directory, it's files and all it's sub-directories and sub-files.
LazyFS.deleteDirectory(__dirname);
// LazyFS.delete has the same behaviour as LazyFS.deleteDirectory
// except that LazyFS.delete don't care if it's a file or a directory it
// needs to remove.
```
