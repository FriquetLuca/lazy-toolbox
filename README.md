![Lazy Toolbox](/doc/img/logo.png)

# Lazy Toolbox

> A NodeJS toolbox made for a lazy development of websites or even applications.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox).

Lazy Toolbox is made of multiples parts, you can find the source of those parts over here:
- [Server](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-server)
- [Client](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-client)
- [Portable](https://github.com/FriquetLuca/lazy-toolbox/tree/master/lazy-portable)

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Client](#client)
	    - [LazyAnimate](#lazyAnimate)
	    - [LazyCaret](#lazyCaret)
	    - [LazyClient](#lazyClient)
	    - [LazyDoc](#lazyDoc)
	    - [LazyHtNetwork](#lazyHtNetwork)
	    - [LazySchedule](#lazySchedule)
	    - [LazyTheme](#lazyTheme)
	    - [LazyView](#lazyView)
	- [Portable](#portable)
	    - [dateLog](#dateLog)
	    - [dateLogMS](#dateLogMs)
	    - [getType](#getType)
	    - [LazyDataGraph](#lazyDataGraph)
	    - [LazyMapper](#lazyMapper)
	    - [LazyMath](#lazyMath)
	- [Server](#server)
	    - [LazyClientSocket](#lazyClientSocket)
	    - [LazyEncapProcess](#lazyEncapProcess)
	    - [LazyFS](#lazyFS)
	    - [LazyModLoader](#lazyModLoader)
	    - [LazyNetList](#lazyNetList)
	    - [LazyRouter](#lazyRouter)
	    - [LazySocket](#lazySocket)
	    - [LazyWatcher](#lazyWatcher)

## [Installation (NPM)](#install-npm)

The project is divided in three different part that could need some dependances:
- Client

    The client part need to be repack with something like `webpack`.
- Server

    The server dependances are `fastify`, `ws` and `node`.
- Portable

    It doesn't need any dependances, it can be used on either a webpage or a server.
## [Updates](#updates)

All updates are availables on their respective parts.


## [Documentation](#documentation)

This part explain all tools with examples if it's needed.

### [Client](#client)
#### [LazyAnimate](#lazyAnimate)
```ts
class LazyAnimate {
    static loadDefault(): void;
    static details(...detailsElements: HTMLDetailsElement[]): void;
}
```

A lazy way to animate some content.

Example:

`main.js`
```js
const { LazyAnimate } = require('@lazy-toolbox/client');
LazyAnimate.loadDefault();
```
`index.html`
```html
<details animated shr_duration="300" shr_ease="ease-out" exp_duration="300" exp_ease="ease-out">
    <summary>A dummy title.</summary>
    <content>Some inner content that will have a smooth transition now.</content>
</details>
```
#### [LazyCaret](#lazyCaret)
```ts
class LazyCaret {
    static getCaretPosition(txtArea: HTMLTextAreaElement): number;
    static setCaretPosition(txtArea: HTMLTextAreaElement, position: number): void;
    static hasSelection(txtArea: HTMLTextAreaElement): boolean;
    static getSelectedText(txtArea: HTMLTextAreaElement): string;
    static setSelection(txtArea: HTMLTextAreaElement, start: number, end: number): void;
    static tabulation(txtArea: HTMLTextAreaElement, tabLength: number = 4, antiTab: boolean = false): void;
}
```

A lazy way to handle caret and tabulation on textarea.

Example:

```js
const { LazyCaret } = require('@lazy-toolbox/client');
const textArea = document.querySelector('textarea');

// Set the caret to the second position of a textarea
LazyCaret.setCaretPosition(textArea, 2);

// Get the current caret position
console.log(LazyCaret.getCaretPosition(textArea));

// Check if the textarea has the selection.
if(LazyCaret.hasSelection(textArea)) {
    // Get the selected text on the textarea
    console.log(LazyCaret.getSelectedText(textArea));
}

// Set a selection on the textarea.
LazyCaret.setSelection(textArea, 0, 2);

// Do a tabulation on the textarea
LazyCaret.tabulation(textArea);

// Do an anti-tabulation on the textarea
LazyCaret.tabulation(textArea, true);

// By default, there's 4 spaces made for one tabulation.
// This can be changed for whatever you want
LazyCaret.tabulation(textArea, false, 2);
```

#### [LazyClient](#lazyClient)
```ts
class LazyClient {
    constructor(host: string, port: number);
    send(packet: string, obj: any): void.
    sender(f: { (f:(packet: string, obj: any) => any): void }): void;
    senders(...fns: { (f:(packet: string, obj: any) => any): void }[]): void;
    hook(packet: string, fn: (obj: any, websocket: WebSocket) => void): void;
    hooks(...hooking: {packet: string, fn: (obj: any, websocket: WebSocket) => void}[]): void;
    hookObject(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void;
    start(): void;
    disconnect(): void;
}
```

A lazy socket client to setup a websocket communication.
Note: You can't use `_packet` as property name.

Example:

```js
const { LazyClient } = require('@lazy-toolbox/client');
// Create our client handler, listening to the host at a specific port.
const socketClient = new LazyClient('localhost', 6060);
// Register a sender functions.
socketClient.sender((sender) => {
    const someTextArea = document.querySelector('.someClass');
    someDiv.addEventListener('keyup', (e) => {
        e.preventDefault();
        // Send a packet called newPacket and some value to the server.
        // This method is given to us by the LazyClient itself
        // when registering all our sender.
        sender('newPacket', {
            prop: "some value",
            prop2: 1010
        });
    });
});
// Register a packet as key and a function as value.
// Whenever the sever send a packet contained in the keys,
// it will trigger the function associated with it.
socketClient.hookObject({
    // Create a receiver that will execute a function everytime
    // the server send a packet called message.
    'message': (data) => {
        console.log(JSON.stringify(data)); // Show the data received
    },
    // Create a receiver that will execute a function everytime
    // the server send a packet called uwu.
    'uwu': () => { console.log("owo"); }
});
// Send a packet called newPacket to the server with a bunch of values.
socketClient.send('newPacket', {
    prop: "some value",
    prop2: 1010
});
```

#### [LazyDoc](#lazyDoc)

```ts
interface HTMLTag {
    tag: string;
    id?: string;
    class?: string[];
    // New on version: 1.1.0
    childs?: HTMLElement[];
    attributes?: {[name: string]: string};
    eventListeners?: {[name: string]: (e: Event)=>void};
}
class LazyDoc {
    static newTag(element: HTMLTag): HTMLElement;
}
```

A lazy way to write `document.something`.

Example:

```js
const { LazyDoc } = require('@lazy-toolbox/client');
// document.createElement makes dev cry a lot.
// It's just an easy way to make it work.
// It could look ugly, but useful for a lot of cases.
const newDiv = LazyDoc.newTag({
    // The HTML element tag name
    tag: 'div',
    // Set the id
    id: 'uwu',
    // Set some classes
    class: [
        'className',
        'anotherClassName'
    ],
    // Add some childs if we want
    childs: [
        LazyDoc.newTag({tag: 'p'})
    ],
    // Set some attributes
    attributes: {
        'value': '0',
        'owo': 'uwu'
    },
    // Add some event listener if needed
    eventListeners: {
        'click': (e) => {
            console.log("Clicked on div!");
        }
    }
});
/*
Same as creating the element:
<div id="uwu" class="className anotherClassName" value="0" owo="uwu">
    <p></p>
</div>
*/
```

#### [LazyHtNetwork](#lazyHtNetwork)

```ts
class LazyHtNetwork {
    // Last update at version: 1.1.0
    static async post(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void>;
    // Last update at version: 1.1.0
    static async postJSON(path: string, datas: {[name: string]: any}, execute: (json: Promise<any>) => void = (e) => { }, error: (e: any) => void = (e: any) => console.error(e)): Promise<void>;
    // Last update at version: 1.1.0
    static async getJSON(path: string, execute: (json: Promise<any>) => void = (e) => { }, error = (e: any) => console.error(e)): Promise<void>;
}
```

A lazy way to handle JS fetch API.

Example:

```js
// Everything in LazyHtNetwork is async, take that into account.
const { LazyHtNetwork } = require('@lazy-toolbox/client');
// Post form datas (for PHP as example)
// Takes a callback from the server for anything.
LazyHtNetwork.post('http://somewhere.com/somethingToPost/', {
    'username': document.querySelector('.someInput').value
}, (json) => { // Server gave us datas back
    console.log(JSON.stringify(json));
});

// LazyHtNetwork.postJSON work the same but only post a .json file at the end, not an HTML form.
// It can't send picture or whatever blob datas could be needed.

// Get a JSON file somewhere.
LazyHtNetwork.getJSON('http://somewhere.com/jsonFileToGet/', (json) => {
    console.log(JSON.stringify(json)); // The json we got.
});
```

#### [LazySchedule](#lazySchedule)
```ts
class LazySchedule {
    constructor(callback: (tries?: number) => void, timerCalc: (tries: number) => number, maxTries: number = 1);
    start(): void;
    stop(): void;
    reset(): void;
}
```

A lazy way to create a smart setInterval that handle a number of tries and can be paused.

```js
const { LazySchedule } = require('@lazy-toolbox/client');
// Create a schedule to execute
const schedule = new LazySchedule(
    () => {
        console.log("Callback !");
    },
    (tries) => {
        if(tries > 5) {
            return 1000; // 1s wait
        }
        return 200; // 0.2s wait
    },
    25 // Max 25 tries
);
schedule.start(); // Start the schedule.
```

#### [LazyTheme](#lazyTheme)

```ts
class LazyTheme {
    constructor(themesClasses: string[], elementsQueries: string[]);
    theme(): string;
    setNextTheme(): void;
    setPreviousTheme(): void;
    setTheme(): void;
    useTheme(newTheme: string): void;
}
```

A lazy theme implementation.
It takes a bunch of theme names that will be used as HTML class having the same name.
It's useful to handle multiple theme with CSS without having the need to manually implement anything to handle theme other than specifying it's changes.

Example:

```js
const { LazyTheme } = require('@lazy-toolbox/client');
const myThemes = new LazyTheme(
    [ // Themes class name
        'light',
        'dark',
        'azure'
    ],
    [ // Queries for elements to be modified
        'body',
        '.myDiv',
        '.myUserTmp'
    ]
);
myThemes.setTheme(); // Use the theme, the default theme is light here since it's the first element in the theme array.
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set the next element in the array, dark, as default theme to be used.
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set azure as next element
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set light as next element since there's no element after aruze. The array is looped.
console.log(myThemes.theme());

// setPreviousTheme() has the same behaviour.

myThemes.useTheme('dark'); // Set the current theme to dark
console.log(myThemes.theme());

myThemes.useTheme('omega'); // Set the current theme to light since omega isn't a valid theme
console.log(myThemes.theme());
```

#### [LazyView](#lazyView)

```ts
class LazyView {
    static replaceInsert(actualElement: HTMLElement, targetElement: string, newHTMLContent: string): void;
    static inject(htmlDoc: string, toInject: {[name: string]: string}): string;
    static toNode(content: string): ChildNode | null;
    static toNodeList(content: string): NodeListOf<ChildNode>;
    static toArray(content: string): ChildNode[];
    static toText(content: ChildNode[]): string;
}
```

A bunch of lazy ways to handle some HTML injection or extraction.

Example:

`index.html`:
```html
<div class="someDiv">
    <h1>A title<h1>
    <p>Some text
    <insert data="replaceUseless">
        Some HTML comments.
        <h2>YES A COMMENT !!! ... kinda.</h2>
    </insert>
    </p> I guess.
</div>
```
`main.js`:
```js
const { LazyView } = require('@lazy-toolbox/client');
const testView = document.querySelector('.someDiv');
LazyView.inject(testView, // Replace all insert[data='targetElement']
'replaceUseless', // Data to replace
'was replaced <span>!!</span>' // HTML to inject
);
/*
Result:
<div class="someDiv">
    <h1>A title<h1>
    <p>Some text
    was replaced <span>!!</span>
    </p> I guess.
</div>
*/
const result = LazyView.inject(testView.innerHTML, {
    'replaceUseless': 'was replaced <span>!!</span>'
}); // Same as before, but instead of modifying the DOM, we just
// get the HTML string back.

// Create a single child node from an HTML string.
const pTag = LazyView.toNode('<p>Hello world</p>');
document.body.appendChild(pTag);

// Create a bunch of child nodes from an HTML string.
const multiTag = LazyView.toNodeList('<p>Hello world2</p><p>Hello world 3</p>');
for(let tag of [...multiTag]) {
    document.body.appendChild(tag);
}

// Create a bunch of child nodes in an array from an HTML string.
// It's the equivalent of the previous [...multiTag].
const multiTagArray = LazyView.toArray('<p>Hello world2</p><p>Hello world 3</p>');

// Convert an array of child nodes back to an HTML string.
const multiTagArrayHTMLBack = LazyView.toText(multiTagArray);
```


### [Portable](#portable)
#### [dateLog](#dateLog)
```ts
function dateLog(msg: any): string
```

Create a message with the time display up to the s.
It will be showned as `[HH:MM:SS] MY_MESSAGE`.

Example:

```js
const { dateLog } = require('@lazy-toolbox/portable');
console.log(dateLog("Hello world")); // [10:37:12] Hello world
```

#### [dateLogMS](#dateLogMs)
```ts
function dateLogMS(msg: any): string
```

Create a message with the time display up to the ms.
It will be showned as `[HH:MM:SS.DCM] MY_MESSAGE`.

Example:

```js
const { dateLogMS } = require('@lazy-toolbox/portable');
console.log(dateLogMS("Hello world")); // [10:37:12.123] Hello world
```

#### [getType](#getType)
```ts
function getType(parameter: any): string
```

Get the type of the parameter, extending `typeof` to support `class` and `array` as native options.

Example:

```js
const { getType } = require('@lazy-toolbox/portable');
class Animal {
    constructor(name) {
        this.name = name;
    }
}
const x = Animal;
const y = [ 'a', 'b' ];
console.log(getType(x)); // class
console.log(getType(y)); // array
// Everything else is the same as typeof
```

#### [LazyDataGraph](#lazyDataGraph)
```ts
interface GraphPoint {
    value: number;
    label: string;
    increasePercent?: number;
    localMean?: number;
    localVariance?: number;
}
class LazyDataGraph {
    constructor(...datas: GraphPoint[]);
    get points(): GraphPoint[];
    set points(pts: GraphPoint[]);
    isTangentGraph(): boolean;
    getTangentGraph(): LazyDataGraph;
    generateSlope(): GraphPoint[];
}
```

A non-visual graph to analyze variation in datas.

Example:

```js
const { LazyDataGraph } = require('@lazy-toolbox/portable');
// Create the graph
const lazyGraph = new LazyDataGraph(
    // Set an ordered bunch of points
    {label:'d1', value:100},
    {label:'d2', value:100},
    {label:'d3', value:200},
    {label:'d4', value:150},
    {label:'d5', value:100}
);
// Generate the tangent of the graph to see the differentiation in the graph
const tangentGraph = lazyGraph.generateSlope();
// Just showing what was made on the way.
for(let tanPt of tangentGraph) {
    console.log(`- ${tanPt.label}: [value: ${tanPt.value}, increasePercent: ${tanPt.increasePercent}, localMean: ${tanPt.localMean}, localVariance: ${tanPt.localVariance}]`);
}
/* Result:
- d1-d2: [value: 0, increasePercent: 0.0 ]
- d2-d3: [value: 100, increasePercent: 2.0 ]
- d3-d4: [value: -50, increasePercent: -0.25 ]
- d4-d5: [value: -50, increasePercent: -0.33 ]
*/
```

#### [LazyMapper](#lazyMapper)
```ts
class LazyMapper {
    static filterData<T>(data: any, defaultValue: T, transform: (d: any) => T, filter: (d: T) => T): T;
    static defaultData<T>(data: any, defaultValue: T, transform: (d: any) => T): T;
    static boolean(data: any): boolean;
    static defaultBoolean(data: any, defaultValue: boolean): boolean;
    static number(data: any): number;
    static defaultNumber(data: any, defaultValue: number): number;
    static filterNumber(data: any, defaultValue: number, filter: (d: number) => number): number;
    static string(data: any): string;
    static defaultString(data: any, defaultValue: string): string;
    static filterString(data: any, defaultValue: string, filter: (d: string) => string): string;
}
```

A mapper to allow some filtering for retrieved variables that could be undefined.

Example:

```js
const { LazyMapper } = require('@lazy-toolbox/portable');
const someData = {
    propA: "hello",
    propB: 123,
    propC: {
        subProp: "uwu"
    }
};
console.log(LazyMapper.defaultString(someData.propA, 'error!')); // hello
console.log(LazyMapper.defaultString(someData.propD, 'error!')); // error!
```

#### [LazyMath](#lazyMath)

```ts
class LazyMath {
    static modulo(a: number, b: number): number;
    static frac(a: number): number;
    static saturate(a: number): number;
    static sum(k: number, n: number, f: (i: number) => number): number;
    static product(k: number, n: number, f: (i: number) => number): number;
    static isPrime(n: number): boolean;
    static step(n: number, x: number): number;
    static lerp(a: number, b: number, t: number): number;
    static unlerp(a: number, b: number, p: number): number;
    static binomialCoefficient(n: number, k: number): number;
    static derivative(x: number, f: (x: number) => number): number;
    static antiDerivative(x: number, f: (x: number) => number, subdivide: number = 1): number;
    static integral(a: number, b: number, f: (x: number) => number, subdivide: number = 1): number;
    static combinationArrayNRNO<T>(objects: T[], k: number): T[];
}
```

Add some lazy math that should have been available at first on JS.

Example:

```js
const { LazyMath } = require('@lazy-toolbox/portable');
// The JS modulo operator violate the property (a + n) mod n = a mod n.
// So we've implemented a modulo that doesn't violate it.
// JS modulo = a - ([a / b] * b)
// where [a / b] is the truncature of a / b.
// LazyMath.modulo = a - (⌊a / b⌋ * b)
// where ⌊a / b⌋ is the floor of a / b.

// Positive value have the same answer
console.log(LazyMath.modulo(4, 3)); // 1
console.log(4 % 3) // 1
// The JS modulo problem lies over here.
console.log(LazyMath.modulo(-4, 3)); // 2
console.log(-4 % 3); // -1

// Get the leftover to obtain an integer less or equal to n.
console.log(LazyMath.frac(2.345)); // 0.345
console.log(LazyMath.frac(-2.345)); // 0.655

// Get a value between 0 and 1
console.log(LazyMath.saturate(2.345)); // 1

// sum and product are made to handle iterative function for sum and product.
// 1 + 2 + 3 + 4 = 10
console.log(LazyMath.sum(1, 4, (i) => i));
// 1 * 2 * 3 * 4 * 5 = 5! = 120
console.log(LazyMath.product(1, 5, (i) => i));

// A method to test if a number is prime.
// It's not an optimal method, it can be slow as hell but you'll be 100% sure it's a prime number.
console.log(LazyMath.isPrime(7)); // True
console.log(LazyMath.isPrime(24)); // False

// Return 1 if x is gequal to n, otherwise n.
console.log(LazyMath.step(0.3, 0.5)); // 0.3
console.log(LazyMath.step(0.4, 0.5)); // 0.4
console.log(LazyMath.step(0.5, 0.5)); // 1

// Do a linear interpolation between a and b using the parameter t for the interpolated distance.
console.log(LazyMath.lerp(1, 3, 0.5)); // 2

// Get the interpolated distance of p on the line from a to b.
console.log(LazyMath.unlerp(1, 3, 2)); // 0.5

// Compute the number of ways to choose an unordered subset of k elements from a fixed set of n elements.
console.log(LazyMath.binomialCoefficient(5, 2)); // 10

// Evaluate the derivative of a function f at a point x. d/dx f(x)
// For this example, we use the function f(x) = x² and evaluate it's derivative at x = 3.
// The result should be 6 if the approximation was perfect.
console.log(LazyMath.derivative(3, (x) => { return x * x; })); // 5.921189464667501

// Evaluate the anti-derivative of a function f' at a point x.
// For this example, we use the function f'(x) = 2x and evaluate it's anti derivative at x = 3.
// The result should be 9 if the approximation was perfect.
console.log(LazyMath.antiDerivative(3, (x) => { return 2 * x; })); // 8.819999999999999

// Evaluate the area under the curve of a function f' from a to b.
// The result should be 15 if the approximation was perfect.
console.log(LazyMath.integral(1, 4, (x) => { return 2 * x; })); // 14.819999999999997

// Return an array of ordered combination without repetition of n objets (a string array) classified in k groups.
console.log(LazyMath.combinationArrayNRNO([7, 6, 3, 4], 2));
/* Result:
[
    [7, 6],
    [7, 3],
    [7, 4],
    [6, 3],
    [6, 4],
    [3, 4]
]
*/
```


### [Server](#server)
#### [LazyClientSocket](#lazyClientSocket)
```ts
class LazyClientSocket {
    get IsReconnected(): boolean;
    get ID(): number;
    get IP(): string;
    get Socket(): WebSocket.WebSocket;
    setNewSocket(socket: WebSocket.WebSocket): void;
    setData(label: string, data: any): void;
    getData(label: string): any;
    removeData(label: string): void;
}
```

Offer a way to handle a client for a `LazySocket`.

Example:
```js
// Executed whenever a client connect to the server.
module.exports = (server, client, db) => {
    client.setData('myData', 125);
    console.log(client.getData('myData'));
    client.removeData('myData');
};
```
#### [LazyEncapProcess](#lazyEncapProcess)
```ts
class LazyEncapProcess {
    get process();
    constructor(root: string, processPath: string, nodeType: string | string[] = 'node', logInfo: boolean = true, showDates: boolean = true);
    async start(inject?: (process: any) => Promise<void>): Promise<void>;
    async stop(): Promise<void>;
}
```

A lazy way to encapsulate a node process.

Example:

```js
const { LazyEncapProcess } = require('lazy-toolbox');
// Create a node process with the script `server.js`.
// By default, we get back on the console everything that happened on this node.
const newNodeProcess = new LazyEncapProcess(__dirname, 'server.js');
// Run the script in the background.
newNodeProcess.start();
```

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

#### [LazyModLoader](#lazyModLoader)

```ts
class LazyModLoader {
    constructor(root: string, moduleFolder: string = "./");
    load(): {[filePath: string]: any};
    static isClass(v: any): boolean;
    static isFunction(v: any): boolean;
    static isArray(v: any): boolean;
    static isObject(v: any): boolean;
    static isScalar(v: any): boolean;
}
```

A module loader to load modules inside a directory.
It loads all `.js` files. and `.mjs` files as modules.

Example:

`myModule.js`:
```js
module.exports = (name) => {
    console.log(`Hello ${name}.`);
};
```
`subMod/mySubModule.js`:
```js
class MyClass {
    constructor(name) {
        this.name = name;
        this.hello();
    }
    hello() {
        console.log(`Hello ${this.name}.`);
    }
}
module.exports = MyClass;
```
`main.js`:
```js
const { LazyModLoader } = require('lazy-toolbox');
// Create a module loader.
const modLoader = new LazyModLoader(__dirname, './');
// Load all modules
const loadedMods = modLoader.load();
// Get all modules relative path without the extension
for(let loadedMod in loadedMods) {
    // Get the actual module
    const actualLoadedMod = loadedMods[loadedMod];
    // Check if the module is a class
    if(LazyModLoader.isClass(actualLoadedMod)) {
        // Do something with the class
        const newMod = new actualLoadedMod('test');
    }
    // Check if the module is a function
    else if(LazyModLoader.isFunction(actualLoadedMod)) {
        // Do something with the function
        actualLoadedMod('test');
    }
}
```
#### [LazyNetList](#lazyNetList)
```ts
class LazyNetList {
   static internalIPv4(): string[];
   static externalIPv4(): string[];
   static IPv4(): string[];
}
```

A lazy way to access some network interfaces.

Example:

```js
const { LazyNetList } = require('lazy-toolbox');
// Get all IP v4 inside an array
const IPs = LazyNetList.IPv4();
// Get all internal IP v4 inside an array
const iIPs = LazyNetList.internalIPv4();
// Get all external IP v4 inside an array
const eIPs = LazyNetList.externalIPv4();
```

#### [LazyRouter](#lazyRouter)
```ts
class LazyRouter {
    // Last update at version: 1.1.2
    constructor(host: string, port: number, root: string, assetDir: string, db: any = undefined);
    // New on version: 1.4.7
    get Views(): { [filePath: string]: string; };
    // New on version: 1.4.7
    get DB(): any;Promise<void>
    start(): void;
    // New on version: 1.1.2
    setDB(db: any): void;
    // New on version: 1.4.2
    getFastify(): any;
    // New on version: 1.4.7
    view(provided: {viewPath:string, request:any, reply:any, datas?: {[propertyName: string]: string}, templates?: {[name: string]: {(i: number, count: number): {[label: string]: string}}} }, reloadRoutes: boolean = false): string;
    async loadAssets(): Promise<void>;
    // Last update at version: 1.1.1
    async registerPaths(routesFolder: string): Promise<void>;
    // New on version: 1.1.1
    async loadStaticRoutes(route: string, staticDirectory: string): 
    // New on version: 1.4.7
    async reloadViews(): Promise<void>;
}
```

A lazy routing setup for lazy people based on `fastify` and `@fastify/static`.

Example:

`File explorer`:
```fileExplorer
- Root
    - public
        - assets
            - img.png
        - views
            - index.html
            - dummy.html
    - routes
        - customRoute.js
    - app.js
```
`app.js`:
```js
const path = require('path');
const { LazyRouter } = require('lazy-toolbox');
// A little setup to make it async while loading all ours things.
const setupRouter = async () => {
    // Set a new router on the localhost, listening on port 3000.
    // The assets directory will be the static asset directory of the server.
    const newRouter = new LazyRouter('localhost', 3000, __dirname, './public/assets');
    // Load all assets static routes.
    // Note: The route name will always be ./assets/ on the server side.
    // localhost:3000/assets/
    // It's the equivalent of :
    // await this.loadStaticRoutes('/assets/', './public/assets');
    await newRouter.loadAssets();
    // Load all custom routes modules inside the routes folder
    await newRouter.registerPaths('./routes', '../public/views');
    // Registered routes:
    // localhost:3000/assets/img.png
    // localhost:3000/customRoute
    newRouter.start();
}
// Let's just run this.
setupRouter();
```
`routes/customRoute.js`:
```js
// Get the folder relative path as route
module.exports = (route, fastify, router) => {
    // A simple implementation for lazyness incarned.
    fastify.get(route, async (request, reply) => {
        const dummyUsers = [
            { name: "John", age: 28 },
            { name: "Elena", age: 31 },
            { name: "Arthur", age: 66 },
            { name: "Sophie", age: 17 },
            { name: "Peter", age: 19 }
        ];
        // The config of the view
        const config = {
            viewPath: 'index', // public/views/index.html
            request: request,
            reply: reply,
            // Some datas to inject, isn't mendatory
            datas: {
                'replaceUseless': 'My awesome title.'
            },
            // A template to make
            templates: {
                'feedDiv': (i) => {
                    const user = dummyUsers[i];
                    return {
                        'username': user.name,
                        'age': user.age
                    };
                }
            }
        };
        // Load the view
        const currentView = router.view(config);
        // Just send the document
        return provided.reply.type('text/html').send(currentView);
    });
}
```
`public/views/index.html`:
```html
<html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dummy page</title>
    </head>
    <body>
        <h1><insert data="replaceUseless">Useless Title</insert></h1>
        <div>
            <p>Something ...</p>
            <insert view="dummy"></insert>
            <p>Another something else ...</p>
        </div>
    </body>
</html>
```
`public/views/dummy.html`:
```html
<div>
    <p>Something else ...</p>
    <p>...</p>
</div>
```
#### [LazySocket](#lazySocket)
```ts
interface FolderMods {
    onConnect: string;
    onMessages: string;
    onDisconnect: string;
}
class LazySocket {
    constructor(port: number, root: string, paths: FolderMods = { onConnect:'./onConnect', onMessages: './onMessages', onDisconnect: './onDisconnect' }, logInfo: boolean = true, showDates: boolean = true, db: any = undefined);
    connect(): void;
    noError(): void;
    sendToAll(packet: string, data: any): void;
    sendToAllExceptSender(packet: string, socket: WebSocket.WebSocket, data: any): void;
    clientCount(): number;
    getClient(socket: WebSocket.WebSocket): LazyClientSocket;
    getServer(): WebSocket.Server<WebSocket.WebSocket>;
    setDB(db: any): void;
    getData(label: string): any;
    setData(label: string, data: any): void;
    deleteData(label: string): void;
    static sendToClient(packet: string, socket: WebSocket.WebSocket, data: any): void;
    static closeClient(socket: WebSocket.WebSocket): void;
}
```

A lazy socket implementation to handle websocket.
All the logic lies inside three folders that you can choose.
Functions are gonna be executed depending on the packet name given by a `LazyClientSocket`.

Example:

`File explorer`:
```fileExplorer
- Root
    - onConnect
        - connect.js
    - onMessages
        - test_msg.js
    - onDisconnect
        - disconnect.js
    - app.js
```
`app.js`
```js
const { LazySocket } = require('lazy-toolbox');
// Create a websocket on port 6060
const socketServer = new LazySocket(6060, __dirname);
// Start all connections
socketServer.connect();
```
`onConnect/connect.js`
```js
// Executed whenever a client connect to the server.
module.exports = (server, client, db) => {
    /*
    server: LazySocket
    client: LazyClientSocket
    db: any
    */
    // Do something when a client connect to the server.
};
```
`onMessages/test_msg.js`
```js
// This packet name is: test_msg
// If it was inside a folder called myFolder, then the
// packet would be called: myFolder/test_msg
module.exports = (server, client, data, db) => {
    /*
    server: LazySocket
    client: LazyClientSocket
    data: any
    db: any
    */
    // Send a packet from the server to all clients.
    server.sendToAll('message_for_all', {
        author: data.author,
        msg: data.msg
    });
};
```
`onDisconnect/disconnect.js`
```js
// Executed whenever a client disconnect from the server.
module.exports = (server, client, db) => {
    /*
    server: LazySocket
    client: LazyClientSocket
    db: any
    */
    // Do something if a client disconnect from the server.
};
```
#### [LazyWatcher](#lazyWatcher)
```ts
interface FileEvent {
    file: string;
    eventType: string;
}
class LazyWatcher {
    constructor(root: string, timeout: number = 200, excludePaths: string[] = [], excludeEventTypes: string[] = []);
    checkFileChanges(): FileEvent[];
    async watchFiles(fn: (events: FileEvent[]) => Promise<void>): Promise<void>;
    stop(): void;
    skipChanges(): void;
}
```

A lazy watcher that will watch files by not relying on `fs.watch` instability but instead on a timeout approach.

Example:

`manualWatcher.js`:
```js
const { LazyWatcher } = require('lazy-toolbox');
// Create a watcher, watching our directory
const newWatcher = new LazyWatcher(__dirname);
// Set a timeout to check any changes in the next minute.
setTimeout(() => {
    // Check every changes
    const changes = newWatcher.checkFileChanges();
    for(let changeEvent of changes) {
        console.log(`Event ${changeEvent.eventType} occured on: ${changeEvent.file}`);
    }
}, 60000); // Check changes after a minutes.
```
`timeoutWatcher.js`:
```js
const { LazyWatcher } = require('lazy-toolbox');
// Create a watcher, watching our directory with a timeout of 10s.
const newWatcher = new LazyWatcher(__dirname, 10000);
// Create a counter, just to show a use case of stop function
let i = 0;
// It will trigger every event that occured the next 10s, then it will wait again until it need to check for changes.
newWatcher.watchFiles(async (changes) => {
    if(i >= 10) {
        // Stop the watcher.
        newWatcher.stop();
    }
    // Show all events:
    for(let changeEvent of changes) {
        console.log(`Event ${changeEvent.eventType} occured on: ${changeEvent.file}`);
    }
    i++;
    // If you created some files in this function, it would have been useful to use
    // newWatcher.skipChanges();
    // So the watcher would just skip all your newly made files or modifications
    // for the next watch.
});
```

