/**
 * A lazy way to handle caret and tabulation on textarea.
 */
export default class LazyCaret {
    /**
     * Set the caret position of the textarea.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @param {number} position The position to set the caret to.
     */
    public static setCaretPosition(txtArea: HTMLTextAreaElement, position: number): void {
        txtArea.selectionStart = position;
        txtArea.selectionEnd = position;
        txtArea.focus();
    };
    /**
     * Get the caret position of the textarea.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @returns {number} Return the caret position of the textarea.
     */
    public static getCaretPosition(txtArea: HTMLTextAreaElement): number {
        return txtArea.selectionStart;
    };
    /**
     * Check if the textarea has the selection.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @returns {boolean} Return true if the textare has the selection.
     */
    public static hasSelection(txtArea: HTMLTextAreaElement): boolean {
        if (txtArea.selectionStart == txtArea.selectionEnd) {
            return false;
        } else {
            return true;
        }
    };
    /**
     * Get the selected text in a textarea.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @returns {string} The selected text.
     */
    public static getSelectedText(txtArea: HTMLTextAreaElement): string {
        return txtArea.value.substring(txtArea.selectionStart, txtArea.selectionEnd);
    };
    /**
     * Set a selection on the textarea.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @param {number} start The start position of the selection.
     * @param {number} end The end position of the selection.
     */
    public static setSelection(txtArea: HTMLTextAreaElement, start: number, end: number): void {
        txtArea.selectionStart = start;
        txtArea.selectionEnd = end;
        txtArea.focus();
    };
    /**
     * Do a tabulation on a textarea where the caret is currently at.
     * @param {HTMLTextAreaElement} txtArea The textarea.
     * @param {boolean} antiTab If true, it will do an anti-tabulation, removing space instead of adding it.
     * @param {number} tabLength The length of the tabulation.
     */
    public static tabulation(txtArea: HTMLTextAreaElement, antiTab: boolean = false, tabLength: number = 4): void {
        let newCaretPosition;
        let caretPos = LazyCaret.getCaretPosition(txtArea);
        const carretContent = txtArea.value.substring(0, caretPos);
        let move = 0;
        if(antiTab)
        {
            for(let i = carretContent.length - 1; i >= carretContent.length - tabLength && i >= 0; i--)
            {
                if(carretContent[i] !== ' ')
                {
                    if(carretContent[i] !== '\n')
                    {
                        move--;
                    }
                    break;
                }
                move++;
            }
            if(move < 0)
            {
                move = 0;
            }
            txtArea.value = txtArea.value.substring(0, caretPos - move) + txtArea.value.substring(caretPos, txtArea.value.length);
            newCaretPosition = caretPos - move;
        }
        else
        {
            let letterTillLine = 0;
            for(let i = carretContent.length - 1; i >= 0; i--)
            {
                if(carretContent[i] === '\n')
                {
                    break;
                }
                letterTillLine++;
            }
            move = tabLength - (letterTillLine % tabLength);
            const generateSpace = (n: number) => {
                let r = '';
                while(n > 0)
                {
                    r = `${r} `;
                    n--;
                }
                return r;
            }
            txtArea.value = txtArea.value.substring(0, caretPos) + generateSpace(move) + txtArea.value.substring(caretPos, txtArea.value.length);
            newCaretPosition = caretPos + move;
        }
        LazyCaret.setCaretPosition(txtArea, newCaretPosition);
    }
}
