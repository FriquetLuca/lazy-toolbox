/**
 * Shorthand static class for special string functions.
 */
export class LazyText {
    public static letters = [   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                        'á', 'à', 'ä', 'â',
                        'é', 'è', 'ë', 'ê',
                        'í', 'ì', 'ï', 'î',
                        'ó', 'ò', 'ö', 'ô',
                        'ú', 'ù', 'ü', 'û',
                        'Ç', 'ç'
    ];
    public static digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    public static variables = [   'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        '_', '$', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
    ];
    public static controls = [ '\n', '\t' ];
    public static whitespaces = [ ' ' ];
    public static symbols = [ '§', '@', '¥', '€', '¬', '&', '|', '#', '^', '*', '$', '%', '±', '=', '+', '-', '*', '/', '\\', '<', '>', '~', '°', '_', '`', '´', '¨', '(', ')', '[', ']', '{', '}' ];
    public static punctuations = [ '.', ',', ';', ':', '?', '!', '"', '\'', '«', '»', '“', '„' ];
    /**
     * A shorthand function to extract a certain number of character from a string. 
     * @param {string} content The string where we want to extract content from.
     * @param {number} index The index from which we start.
     * @param {number} nbrLetters The number of letters to extract.
     * @returns {string} Return a string of nbrLetters characters if there is that many from a starting point.
     */
    public static extract(content: string, index: number, nbrLetters: number): string {
        return content.substring(index, index + nbrLetters);
    }
    /**
     * Extract the content from a string starting at a specific index until the predicate is false.
     * @param {string} content The source string from which we get the content to extract.
     * @param {number} startIndex The starting index.
     * @param {(c: string, i: number, txt: string)=>boolean} predicate A function to check if we include the character.
     * @returns {{lastIndex: number, value:string}} An object containing the substring made by following the predicate rule and the last index extracted.
     */
    public static extractFromUntil(content: string, startIndex: number, predicate: (c: string, i: number, txt: string)=>boolean):{ value: string; lastIndex: number; }
    {
        let lastIndex = startIndex;
        for(let i = startIndex; content.length; i++)
        {
            if(!predicate(content[i], i, content))
            {
                break;
            }
            lastIndex = i;
        }
        return {
            value: LazyText.extract(content, startIndex, lastIndex - startIndex),
            lastIndex: lastIndex
        };
    }
    /**
     * Return the number of lines contained inside a string.
     * @param {string} content The string content from which we want to count the lines.
     * @returns {number} The number of lines contained in the string.
     */
    public static countLines(content: string): number
    {
        let line = 1;
        for(let i = 0; i < content.length; i++)
        {
            if(content[i] === '\n')
            {
                line++;
            }
        }
        return line;
    }
    /**
     * Find the number of lines from the start of a string until a specified index, finding the character position of that element on the way.
     * @param {string} content The string we're going to look.
     * @param {number} maxIndex The last index we're going to look.
     * @returns {{lines: number; lineChar: number;}} An object containing the number of lines found and the character position of the last index in it's current line.
     */
    public static countLinesChar(content: string, maxIndex?: number): { lines: number; lineChar: number; }
    {
        const result = {
            lines: 1,
            lineChar: 0
        }
        const lastIndex = maxIndex ?? content.length - 1;
        for(let i = 0; i <= lastIndex; i++)
        {
            result.lineChar++;
            if(content[i] === '\n')
            {
                result.lines++;
                result.lineChar = 0;
            }
        }
        return result;
    }
}