# [letter](#letter)

> A formal letter mod for Lazy-CLI.

Create a letter depending on custom templates modules.
**Requirement:** You need to have `latexmk` installed to use this command and must have registered a profile in a `profile.json` file.

```bash
frmltr [-a|--add <modName>] [-r|--remove <modName>] [-g|--generate] [-l|--list]
```
- `[-a| --add <modName>]` add a new formal letter template. The `modName` should be structured as `language-template.js` where language is the name of the language of the template and template is the template.
- `[-r|--remove <modName>]` remove a formal letter template.
- `[-g|--generate]` generate formal letters from a `jobs.json` file located at the current directory.
- `[-l|--list]` show all installed templates.

## [Setup letter](#setupLetter)

**It's mendatory to have `latexmk` installed on your machine for `letter` command to work, otherwise you can go [here](https://mg.readthedocs.io/latexmk.html) to see the installation procedure.**

To start of, you should create your own profile for the cli.
Create a `profile.json` file like [this](https://github.com/FriquetLuca/lazy-toolbox/blob/master/lazy-mods/letter/profile.json.example) in any directory you want.
To see how a profile is structured, take a look at this interface:
```ts
interface Profile {
    firstName: string,
    lastName: string,
    street: string,
    streetNumber: string,
    city: string,
    zipCode: string,
    phoneNumber: string,
    emailAddress: string
}
```
Next, open your terminal, navigate into this directory and enter the command:
```bash
lazy-cli fdb profile.json -a profile.json
```
Now that you've registered a profile data, you can safely delete the `profile.json` file you made (don't worry, a copy is safe in the cli database).

The last step will be to create your own formal letter template.
To create a formal letter template, all you need is to create a `.js` file with the specific sementic `language-template.js` then register your template.
You can take a look at the [`english-dev.js`](https://github.com/FriquetLuca/lazy-toolbox/blob/master/lazy-mods/letter/english-dev.js.example) example to see the structure of a formal letter template.
You can register it with:
```bash
lazy-cli frmltr -r english-dev.js
```

It's important to note that the template name will be important. As such, the `english-dev` in `english-dev.js` means that for every job using the `template="dev"` generated with the `english` language will use this template.

### [Register a template.](#registerTemplate)

```bash
lazy-cli frmltr -a english-dev.js
```
`english-dev.js`: [Example is here](https://github.com/FriquetLuca/lazy-toolbox/blob/master/lazy-mods/letter/english-dev.js.example)

### [Use a template](#templateUse)

All jobs are represented as:
```ts
interface Job {
    jobName: string | {[label:string]:string},
    jobPlace: string,
    template: string,
    recipient?: string | {[label:string]:string},
    canLearn?: string[]
}
```
making it more versatile for customization. You can generate formal letter in a directory containing a [`jobs.json`](https://github.com/FriquetLuca/lazy-toolbox/blob/master/lazy-mods/letter/jobs.json.example) file:
```bash
cd your/path/to/jobs_json_folder
lazy-cli frmltr -g
```