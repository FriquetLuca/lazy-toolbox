# [template](#template)

Create a default pre-existing template.

```bash
template <templateName> <fileName> [-o|--override]
```
- `<templateName>` is the template to use. You can choose between either:
    - `html`: Create an HTML template.
    - `lazy-view`: Create a default `.ts` route file for `lazy-toolbox` router: `LazyRouter`.
    - `socket-connect`: Create a default `.ts` socket connection module for the `lazy-toolbox` socket: `LazySocket`.
    - `socket-disconnect`: Create a default `.ts` socket disconnect module for the `lazy-toolbox` socket: `LazySocket`.
    - `socket-message`: Create a default `.ts` socket message module for the `lazy-toolbox` socket: `LazySocket`.
- `<fileName>` is the name of the file; the first letter will be converted in lower case.
- `[-o|--override]` override any existing file with the template.

Example:
```bash
lazy-cli template html Index -o
```