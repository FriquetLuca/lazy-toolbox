/**
 * An easy way to manage file from a browser.
 */
export class LazyFile {
    /**
     * Save a string content as a file.
     * @param {string} fileName Name of the file.
     * @param {string} content Content of the file.
     */
    public static saveAs(fileName: string, content: string = ""): void {
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(new Blob([content], {type: "text/plain"}));
        a.download = fileName;
        LazyFile.fakeClick(a);
    }
    private static fakeClick(node: HTMLElement): void {
        try {
            node.dispatchEvent(new MouseEvent('click'));
        } catch (e) {
            let evt = document.createEvent('MouseEvents');
            evt?.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                                20, false, false, false, false, 0, null);
            node.dispatchEvent(evt);
        }
    }
}