<p align="center">
    <img src="/doc/img/logo.png" alt="logo" height="500" width="500">
</p>
<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-green">
    <img src="https://img.shields.io/badge/typescript-v4.8.4-red">
    <img src="https://img.shields.io/badge/commander-v9.4.1-orange">
</p>

# Lazy-CLI

> A full portable CLI that can be fully modded with injected modules.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-cli).
You can find some mods on this [link](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-mods).

You can install the `lazy-cli` with:
```bash
npm install -g @lazy-toolbox/lazy-cli
```

Or update it ?
```bash
npm i -g @lazy-toolbox/lazy-cli@latest
```

## Index
- [Updates](#updates)
- [Roadmap](#roadmap)
- [Modules](#modules)
- [Commands](#commands)
    - [mod](#mod)
    - [fdb](#fdb)

## [Updates](#updates)

### 1.0.1
Better removal handling, there shouldn't be any problem left.

### 1.0.0
Remade from the ground and tested in various ways, it's now adapted for full modding injection with a better database handling and a lot of error removal.
There shouldn't be any more updates.

### 0.1.0
Starting from `v0.1.0`, the `lazy-cli` will be as simple as possible, containing only required tools for new mods.

## [Modules](#modules)

To make a module, create a `.js` script containing the following structure:
```js
module.exports = (program, config) => {

};
```
The `program` parameter is of type `Commander` from [commander package](https://www.npmjs.com/package/commander). See it's documentation for more infos.
The `config` parameter is of type `Config` and is structured as follow:
```ts
interface Config {
    // The path from where the command was used
    commandPath: string;
    // The path from where the modules are saved
    rootPath: string;
    // The path from where all files from fdb are saved
    dbPath: string;
    // Get all fdb files and directories list from a fdb path and choose to write them as relative or not.
    getAllDB: (pathSrc: string, relative: boolean) => string[];
    // Get all fdb files list from a fdb path and choose to write them as relative or not.
    getAllDBFiles: (pathSrc: string, relative: boolean) => string[];
    // Get all fdb directories list from a fdb path and choose to write them as relative or not.
    getAllDBDirs: (pathSrc: string, relative: boolean) => string[];
    // Get the content of a fdb file if it exist, undefined otherwise.
    getDBFile: (pathStr: string) => string | undefined;
    // Set a new file in fdb at pathStr, taking a source file and can be overridden.
    setDBFile: (source: string, pathStr: string, override: boolean) => void;
    // Set a new directory in fdb at pathStr, taking a source file and can be overridden.
    setDBDir: (source: string, pathStr: string, override: boolean) => void;
    // Set a new directory or file in fdb at pathStr, taking a source file and can be overridden.
    setDBAny: (source: string, pathStr: string, override: boolean) => void;
    // Remove a file from fdb.
    removeDBFile: (pathStr: string) => void;
    // Remove a directory from fdb.
    removeDBDir: (pathStr: string) => void;
    // Remove a file or a directory from fdb.
    removeDBAny: (pathStr: string) => void;
}
```

All you have to do after that is add the module:
```bash
lazy-cli mod -a myNewMod.js
```
The module command will be available with:
```bash
lazy-cli <YOUR_COMMAND>
```

## [Commands](#commands)

### [mod](#mod)

Manage the CLI modules.

```bash
mod [-a, --add <modulePath>] [-o, --override] [-r, --remove <modulePath>] [-l, --list] [-s, --show <dataPath>]
```

- `-a|--add <modulePath>`: Add a module into the CLI modules. The module must be a `.js` file.
- `-o|--override`: In case the new module has the same name as another one, override it.
- `-r|--remove <modulePath>`: Remove a module from the CLI modules.
- `-s|--show <dataPath>`: Show the file content of the specified CLI module.
- `-l|--list`: List all installed CLI modules.

Use the `@mod` to see the saved mod path.

### [fdb](#fdb)

Manage the CLI file database.

```bash
fdb <currentPath> [-a, --add <dbFilePath>] [-o, --override] [-r, --remove] [-s, --show] [-l, --list]
```

- `<currentPath>`
- `-a|--add <filePath>`: Insert a `<currentPath>` into the file database as `<dbFilePath>`.
- `-o|--override`: In case the `<dbFilePath>` has the same name as an already existing one, override it.
- `-r|--remove`: Remove the `<currentPath>`.
- `-s|--show`: Show the content of the `<currentPath>` as a string on the console if it's a file.
- `-l|--list`: Show a list of all directories and files inside the file database.

Use the `@fdb` to see the saved mod path.