<p align="center">
    <img src="doc/img/logo.png" alt="logo" height="500" width="500">
</p>

<p align="center">
    <img  src="https://img.shields.io/badge/license-MIT-green">
    <img  src="https://img.shields.io/badge/typescript-v4.8.4-orange">
    <img  src="https://img.shields.io/badge/node-v14.21.0-yellow">
</p>

# Lazy Toolbox - Client

> A NodeJS toolbox made for a lazy development anywhere you need on your webpage.

Made to create a webpage as fast as possible. Explore more, focus more on developing features.

The source code is available on [GitHub](https://github.com/FriquetLuca/lazy-toolbox).

## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Client](#client)
	    - [LazyAnimate](#lazyAnimate)
	    - [LazyCaret](#lazyCaret)
	    - [LazyClient](#lazyClient)
	    - [LazyDoc](#lazyDoc)
	    - [LazyFile](#lazyFile)
	    - [LazyHtNetwork](#lazyHtNetwork)
	    - [LazySchedule](#lazySchedule)
	    - [LazyTabularTextArea](#lazyTabularTextArea)
	    - [LazyTheme](#lazyTheme)
	    - [LazyView](#lazyView)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i @lazy-toolbox/client
```

## [Updates](#updates)

### [v0.0.9 - Basic support](#se-vo-o-o)

New content were added:
- Add `LazyTabularTextArea` class.
- Add `LazyFile` class.

### [v0.0.8 - Document handler](#se-vo-o-o)

New content were added:
- Add `innerHTML` to `HTMLTag` interface.

New modification were introduced:
- Changed `newTag` function from `LazyDoc` to handle multi-type for the returned value.

### [v0.0.7 - Happy animate](#se-vo-o-o)

New content were added:
- Add `LazyAnimate` class.
- Add `LazySlideContent` class.

### [v0.0.4 - Socket frenzy](#se-vo-o-o)

New content were added:
- Add `LazySchedule` class.

New modification were introduced:
- `LazyClient` has been entirely be remade to have an even smoother handling for sockets.

### [v0.0.0 - Initial commit](#se-vo-o-o)

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
    id?: string;
    class?: string[];
    childs?: HTMLElement[];
    // New on version: 0.0.7
    innerHTML?: string;
    attributes?: {[name: string]: string};
    eventListeners?: {[name: string]: (e: Event)=>void};
}
class LazyDoc {
    static newTag(tagName: string, element?: HTMLTag): HTMLElement;
    static newTag<K extends keyof HTMLElementTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementTagNameMap[K];
    static newTag<K extends keyof HTMLElementDeprecatedTagNameMap>(tagName: K, element?: HTMLTag): HTMLElementDeprecatedTagNameMap[K];
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

#### [LazyFile](#lazyFile)

```ts
class LazyFile {
    static saveAs(fileName: string, content: string = ""): void;
}
```

An easy way to manage file from a browser.

Example:

```js
const { LazyFile } = require('@lazy-toolbox/client');
// Save a file with a specific content.
LazyFile.saveAs('newFile.txt', 'This is some content for this file.');
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

#### [LazyTabularTextArea](#lazyTabularTextArea)

```ts
class LazyTabularTextArea {
    constructor(el: HTMLTextAreaElement, tabLength: number = 4);
}
```

Add support for tabulation in a text area.

Example:

```js
const { LazyTabularTextArea } = require('@lazy-toolbox/client');
// Add support for tabulation on a text area.
new LazyTabularTextArea(document.querySelector('.aTextArea'));
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


