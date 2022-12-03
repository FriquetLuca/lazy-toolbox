import { LazyPattern, PatternFound } from "./lazyPattern";
import { LazyParsing } from "./lazyParsing";
import { LazyText } from "./lazyText";
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
     * A basic pattern to test and extract a character.
     * @param {string} name Name of the pattern.
     * @param {(c:string)=>boolean} predicate The function to test the character.
     * @returns {BasicRule} Return a char pattern.
     */
    public static simpleChar(name: string, predicate: (c:string)=>boolean): BasicRule {
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
            isPattern: (i, c, txt) => { return c === begin; },
            isPatternEnd: (i, c, txt) => { return c === end; },
            fetch: (index, c, txt, endPattern, patternSet) => {
                let p = LazyParsing.parse(txt, patternSet ?? [], index + 1, endPattern); // Let's look for nested pattern over here..
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
                        lastIndex: p.lastIndex
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
     * A basic rule to extract words.
     * @returns {BasicRule} Return a word pattern.
     */
    public static word(): BasicRule
    {
        return {
            name: 'Word',
            defaultValue: '',
            isPattern: (i, c, txt) => { return LazyText.letters.includes(c); },
            fetch: (index, c, txt) => {
                let result = {
                    name: 'Word',
                    content: '',
                    lastIndex: index
                };
                for(let i = index; i < txt.length; i++)
                {
                    if(!LazyText.letters.includes(txt[i])) // Not a letter?
                    {
                        result.lastIndex = i - 1; // Since this index is something we shouldn't bother with, let him tested by something else
                        break;
                    }
                    result.lastIndex = i; // Assign the last index
                    result.content = `${result.content}${txt[i]}`;
                }
                return result;
            }
        };
    }
    /**
     * A basic rule to extract numbers.
     * @param {boolean} comaOverDot If true, numbers must be written as "x,y" instead of "x.y".
     * @returns {BasicRule} A basic number pattern.
     */
    public static number(comaOverDot: boolean = false): BasicRule
    {
        let dot = comaOverDot ? ',' : '.';
        return {
            name: 'Number',
            defaultValue: 0,
            isPattern: (i, c, txt) => {
                let isDecimal = c === dot && LazyText.digits.includes(LazyText.extract(txt, i + 1, 1));
                return LazyText.digits.includes(c) || isDecimal;
            },
            fetch: (index, c, txt) => {
                let result: { name: string, content: any, lastIndex: number } = {
                    name: 'Number',
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
}