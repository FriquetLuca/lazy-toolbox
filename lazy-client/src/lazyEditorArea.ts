import { LazyCaret } from "./lazyCaret";
export class LazyTabularTextArea {
    private editor: HTMLTextAreaElement;
    private tabLength: number;
    constructor(el: HTMLTextAreaElement, tabLength: number = 4) {
        this.tabLength = tabLength;
        this.editor = el;
        this.onKeydown();
    }
    protected onKeydown() {
        this.editor.addEventListener('keydown', (event) => {
            if(event.key === 'Tab') {
                LazyCaret.tabulation(this.editor, event.shiftKey, this.tabLength);
            }
        });
    }
}