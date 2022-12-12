<p align="center">
    <img src="https://img.shields.io/badge/license-MIT-green">
    <img src="https://img.shields.io/badge/typescript-v4.8.4-red">
    <img src="https://img.shields.io/badge/commander-v9.4.1-orange">
    <img src="https://img.shields.io/badge/uuid-v9.0.0-yellow">
</p>

# Lazy-CLI

> A full portable CLI that can be fully modded with injected modules.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-cli).

You can install the Lazy-CLI with:
```bash
npm i @lazy-toolbox/lazy-cli -g
```

## Commands

### template

Create a default pre-existing template.

```bash
template <templateName> <fileName> [-o | --override]
```
- `<templateName>` is the template to use. You can choose between either:
    - `html`: Create an HTML template, the `fileName` will be set as the title.
    - `lazy-view`: Create a default `.ts` route file for `lazy-toolbox` router: `LazyRouter`.
    - `socket-connect`: Create a default `.ts` socket connection module for the `lazy-toolbox` socket: `LazySocket`.
    - `socket-disconnect`: Create a default `.ts` socket disconnect module for the `lazy-toolbox` socket: `LazySocket`.
    - `socket-message`: Create a default `.ts` socket message module for the `lazy-toolbox` socket: `LazySocket`.
- `<fileName>` is the name of the file; it will be converted in lower case.
- `[-o | --override]` override any existing file with the template.

Example:
```bash
lazy-cli template html Index -o
```

### register

Register a `.json` data to `lazy-cli` or remove it if it's specified.

```bash
register <fileJSON> [-r | --remove] [-o | --override]
```
- `<fileJSON>` is the `file.json` path to register.
- `[-r | --remove]` is to remove a registered `.json`.
- `[-o | --override]` is to override a registered `.json`.

Example:
`profile.json`: [Example is here](/examples/profile.json.example)
```bash
lazy-cli register profile.json
lazy-cli register profile.json -o
lazy-cli register profile.json -r
```

### registered

Get the list of all registered JSON files.

```bash
registered [-s | --show <jsonFile>]
```
- `[-s | --show <jsonFile>]` show the specified registered JSON.

Example:
```bash
lazy-cli registered
lazy-cli registered -s myJSONFile.json
```

### letter

Create a letter depending on custom templates modules.
**Requirement:** You need to have `latexmk` installed to use this command and must have registered a profile in a `profile.json` file.

```bash
letter <letterTemplate> [-r | --register <modName>]
```
- `<letterTemplate>` is the template to use or to register (must be named `language-template.js` where language is the name of the language of the template and template is the template).
- `[-r | --register <modName>]` register a new formal letter template.

Example:
#### Register a template.
```bash
lazy-cli letter formal -r english-dev.js
```
`english-dev.js`: [Example is here](/examples/english-dev.js.example)

#### Use a template
Generate formal letter in a directory containing a `jobs.json` file:
```bash
lazy-cli letter formal
```
`jobs.json`:[Example is here](/examples/jobs.json.example)

### module

Add a custom command from a `.js` file.

```bash
module [-a | --add <modulePath>] [-l | --list]
```
- `[-a | --add <modulePath>]` is the module path.
- `-l` is to list all modules.

A command module is a function taking the `commander` program and have the structure:
```bash
module.exports = (program) => {
    program.command('test')
    .description('Test command.')
    .argument('<argA>', 'Some test arg.')
    .option('-l, --list', 'A -l option')
    .action((argA, opts) => {

    });
};
```
More about `commander` [here](https://www.npmjs.com/package/commander).

Example:
```bash
lazy-cli module -a myMod.js
lazy-cli module -l
```
