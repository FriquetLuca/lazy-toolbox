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
