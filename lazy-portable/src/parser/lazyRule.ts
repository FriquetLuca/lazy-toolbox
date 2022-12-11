import { LazyPattern, PatternFound } from "./lazyPattern";
import { LazyParsing } from "./lazyParsing";
import { LazyText } from "../lazyText";
/**
 * A basic rule to catch a pattern.
 */
 export interface BasicRule {
    /**
     * Name of the rule.
     */
    name?: string,
    /**
     * Default value of the rule in case something wrong happen.
     */
    defaultValue?: any,
    /**
     * The string that begin the charbox.
     */
    begin?: string,
    /**
     * The string that end the charbox.
     */
    end?: string,
    /**
     * Function predicate to know when a pattern start.
     */
    isPattern: (i: number, c: string, t: string) => boolean,
    /**
     * Function predicate to know when a pattern end.
     */
    isPatternEnd?: (i: number, c: string, t: string) => boolean,
    /**
     * A function to handle
     */
    fetch?: (i: number, c: string, t: string, isPatternEnd?: (i: number, c: string, t: string) => boolean, patternSet?: LazyPattern[]) => PatternFound
}
/**
 * A generic rule maker. It creates rules for LazyParsing.
 */
export class LazyRule {
    /**
     * A basic pattern to extract a specific character.
     * @param {string} name Name of the pattern.
     * @param {(c:string) => boolean} predicate The function to test the character.
     * @returns {BasicRule} Return a char pattern.
     */
    public static simpleChar(name: string, predicate: (c:string) => boolean): BasicRule {
        return {
            name: name,
            defaultValue: null,
            isPattern: (i, c, txt) => { return predicate(c); },
            fetch: (index, c, txt) => {
                return { name: name, content: c, lastIndex: index };
            }
        };
    }
    /**
     * A basic charbox that will contain the nested in-between string content.
     * @param {string} name The name of the charbox.
     * @param {string} begin The string that begin the charbox.
     * @param {string} end The string that end the charbox.
     * @returns {BasicRule} Return a charbox pattern.
     */
    public static simpleCharbox(name: string, begin: string, end: string): BasicRule {
        return {
            name: name,
            defaultValue: begin,
            begin: begin,
            end: end,
            isPattern: (i, c, txt) => { return txt.substring(i, i + begin.length) === begin; },
            isPatternEnd: (i, c, txt) => { return txt.substring(i, i + end.length) === end; },
            fetch: (index, c, txt, endPattern, patternSet) => {
                const p = LazyParsing.parse(txt, patternSet ?? [], index + begin.length, endPattern); // Let's look for nested pattern over here..
                // We could filter patternSet if we wanted to get rid of some functions for this case or use whatever we want anyway.
                if(p.isPatternEnd) // It's the end of our pattern
                {
                    return {
                        name: name,
                        content: p.result,
                        error: false,
                        nested: true,
                        begin: begin,
                        end: end,
                        lastIndex: p.lastIndex + end.length - 1
                    }; // Return what we got
                }
                else // Something went wrong with brackets (user input) since it was never closed.
                {
                    return {
                        name: name,
                        content: begin,
                        nested: true,
                        error: true,
                        begin: begin,
                        end: end,
                        lastIndex: index
                    };
                }
            }
        };
    }
    /**
     * A basic rule to extract words. Words can only be made with letters.
     * @returns {BasicRule} Return a word pattern.
     */
    public static word(): BasicRule
    {
        return {
            name: 'word',
            defaultValue: '',
            isPattern: (i, c, txt) => { return LazyText.letters.includes(c); },
            fetch: (index, c, txt) => {
                const result = {
                    name: 'word',
                    content: '',
                    lastIndex: index
                };
                for(let i = index; i < txt.length; i++) {
                    if(!LazyText.letters.includes(txt[i])) { // Not a letter?
                        break;
                    }
                    result.lastIndex = i; // Assign the last index
                }
                result.content = txt.substring(index, result.lastIndex + 1);
                return result;
            }
        };
    }
    /**
     * A basic rule to extract numbers. The number can only be written in the form `125` or either `1.2123` if `comaOverDot = false` otherwise `1,2123`.
     * @param {boolean} comaOverDot If true, numbers must be written as "x,y" instead of "x.y".
     * @returns {BasicRule} A basic number pattern.
     */
    public static number(comaOverDot: boolean = false): BasicRule
    {
        let dot = comaOverDot ? ',' : '.';
        return {
            name: 'number',
            defaultValue: 0,
            isPattern: (i, c, txt) => {
                const isDecimal = c === dot && LazyText.digits.includes(LazyText.extract(txt, i + 1, 1));
                return LazyText.digits.includes(c) || isDecimal;
            },
            fetch: (index, c, txt) => {
                const result: { name: string, content: any, lastIndex: number } = {
                    name: 'number',
                    content: '',
                    lastIndex: index
                };
                let alreadyDecimal = false;
                for(let i = index; i < txt.length; i++)
                {
                    if(!LazyText.digits.includes(txt[i])) // Not a digit?
                    {
                        if(!alreadyDecimal && txt[i] === dot) // It's decimal number
                        {
                            alreadyDecimal = true; // We defined it as decimal to skip problems in case of multiple decimal marks
                            if(result.content.length == 0) // .5 as example
                            {
                                result.content = `0.`; // 0.5 now
                            }
                            else
                            {
                                result.content = `${result.content}.`; // xxx.yyy
                            }
                            result.lastIndex = i; // Assign the last index
                            continue;
                        }
                        result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                        break;
                    }
                    result.lastIndex = i; // Assign the last index
                    result.content = `${result.content}${txt[i]}`;
                }
                result.content = Number(result.content); // Type hack
                return result;
            }
        };
    }
    /**
     * A basic rule to extract a variable name. The variable name must be composed of only letters and underscores.
     * @returns 
     */
    public static variable(): BasicRule {
        return {
            name: 'variable',
            defaultValue: '',
            isPattern: (i: number, c: string, txt: string) => { 
                return LazyText.letters.includes(c) || (c === '_'); // begin with _
            },
            fetch: (index: number, c: string, txt: string) => {
                const result = {
                    name: 'variable',
                    content: '',
                    lastIndex: index
                };
                for(let i = index; i < txt.length; i++)
                {
                    if(!LazyText.letters.includes(txt[i]) && txt[i] !== '_') // Not a letter and not underscore
                    {
                        result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                        break;
                    }
                    result.lastIndex = i; // Assign the last index
                }
                result.content = txt.substring(index, result.lastIndex + 1);
                return result;
            }
        };
    }
    /**
     * A basic rule to extract keywords. They must begin by a letter or an underscore and can only contains letters or underscores.
     * @param {string[]} keywordList A list of keywords.
     * @returns {BasicRule} A basic keyword pattern.
     */
    public static keyword(keywordList: string[]): BasicRule {
        return {
            name: 'keyword',
            defaultValue: '',
            isPattern: (i: number, c: string, txt: string) => { 
                const sizeLeft = txt.length - i;
                for(const keyword of keywordList) {
                    if(keyword.length <= sizeLeft) {
                        const currentContent = txt.substring(i, i + keyword.length);
                        if(currentContent === keyword) { // Probably keyword
                            const currentNextIndex = i + keyword.length;
                            if(!(currentNextIndex < txt.length && (LazyText.letters.includes(txt[currentNextIndex]) || txt[currentNextIndex] === '_'))) {
                                // Definitly keyword
                                return true;
                            }
                        }
                    }
                }
                return false;
            },
            fetch: (index: number, c: string, txt: string) => {
                const result = {
                    name: 'keyword',
                    content: '',
                    lastIndex: index
                };
                const sizeLeft = txt.length - index;
                for(let keyword of keywordList) {
                    if(keyword.length <= sizeLeft) {
                        const currentContent = txt.substring(index, index + keyword.length);
                        if(currentContent === keyword) { // Probably keyword
                            const currentNextIndex = index + keyword.length;
                            if(!(currentNextIndex < txt.length && (LazyText.letters.includes(txt[currentNextIndex]) || txt[currentNextIndex] === '_'))) {
                                // Definitly keyword
                                result.content = currentContent;
                                result.lastIndex = currentNextIndex - 1;
                                return result;
                            }
                        }
                    }
                }
                return result;
            }
        };
    }
    /**
     * A basic pattern to extract any character without exception.
     * @param {string} name Name of the rule.
     */
    public static any(name: string): BasicRule {
        return {
            name: name,
            defaultValue: null,
            isPattern: (i, c, txt) => { return true; },
            fetch: (index, c, txt) => {
                return { name: name, content: c, lastIndex: index };
            }
        }
    }
    /**
     * A basic pattern to extract a string like syntax. It will work the same as c/c++/c#/js/java/... string.
     * @param {string} name Name of the rule.
     * @param {string} between The string container. If between = '"', then it will parse a string the same way js does.
     */
    public static parseString(name: string, between: string) {
        return {
            name: name,
            defaultValue: '',
            isPattern: (i: number, c: string, txt: string) => { return txt.substring(i, i + between.length) === between; },
            fetch: (index: number, c: string, txt: string) => {
                const result = {
                    name: 'string',
                    content: '',
                    error: false,
                    lastIndex: index
                };
                let isOut = false;
                for(let i = index + between.length; i < txt.length; i++) {
                    if(txt[i] === "\\") { // is anti-slash
                        if(i + 1 < txt.length && txt[i + 1] === "\\") {
                            i++;
                            continue; // Skip next iteration
                        }
                        break;
                    } else if(txt.substring(i, i + between.length + 1) === `\\${between}`) {
                        // It's an escaped between
                        i++;
                        continue; // Skip next iteration
                    } else if(txt.substring(i, i + between.length) === between) {
                        isOut = true;
                        break;
                    }
                    result.lastIndex = i; // Assign the last index
                }
                if(isOut) {
                    result.content = txt.substring(index + between.length, result.lastIndex + 1);
                    result.lastIndex = result.lastIndex + between.length;
                } else {
                    result.error = true;
                    result.lastIndex = index + between.length;
                }
                return result;
            }
        };
    }
}