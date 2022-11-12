
## Index

- [Installation (NPM)](#install-npm)
- [Updates](#updates)
- [Documentation](#documentation)
	- [Client](#client)
	    - [LazyCaret](#lazyCaret)
	    - [LazyClient](#lazyClient)
	    - [LazyDoc](#lazyDoc)
	    - [LazyHtNetwork](#lazyHtNetwork)
	    - [LazyView](#lazyView)
	    - [LazyTheme](#lazyTheme)

## [Installation (NPM)](#install-npm)

The installation is pretty straight forward:
```terminal
npm i @lazy-maker/client
```
## [Updates](#updates)

### [v0.0.0 - Initial commit](#se-vo-o-o)

## [Documentation](#documentation)

This part explain all tools with examples if it's needed.

### [Client](#client)
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
const { LazyCaret } = require('@friquet-luca/lazy-portable');
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
    registerJSONSender(fns: { (f:(packet: string, obj: any) => any): void }[]): void;
    registerJSONReciever(fns: {[packet:string]: (obj: any, websocket: WebSocket) => void}): void;
    sendJSON(packet: string, obj: any): void;
}
```

A lazy socket client to setup a websocket communication.
Note: You can't use `_packet` as property name.

Example:

```js
const { LazyClient } = require('@friquet-luca/lazy-portable');
// Create our client handler, listening to the host at a specific port.
const socketClient = new LazyClient('localhost', 6060);
// Register an array of all sender functions.
socketClient.registerJSONSender([
    (sender) => {
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
    }
]);
// Register a packet as key and a function as value.
// Whenever the sever send a packet contained in the keys,
// it will trigger the function associated with it.
socketClient.registerJSONReciever({
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
socketClient.sendJSON('newPacket', {
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
const { LazyDoc } = require('@friquet-luca/lazy-portable');
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
const { LazyHtNetwork } = require('@friquet-luca/lazy-portable');
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
const { LazyTheme } = require('@friquet-luca/lazy-portable');
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
const { LazyView } = require('@friquet-luca/lazy-portable');
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


