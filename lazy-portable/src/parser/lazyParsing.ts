import { LazyText } from "../lazyText";
import { LazyPattern, PatternFound } from "./lazyPattern";
import { BasicRule } from "./lazyRule";
import { getType } from "../lazyTypeof";
/**
 * A representation of the result of a pattern.
 */
export interface PatternResult {
    /**
     * If the pattern is an ending pattern.
     */
    isPatternEnd: boolean;
    /**
     * The pattern founded.
     */
    result: PatternFound[];
    /**
     * The last index of the pattern.
     */
    lastIndex: number;
}
/**
 * A more natural way to parse datas with custom rules set in specific testing order.
 */
export class LazyParsing {
    private rules: BasicRule[] = [];
    /**
     * The constructor of the parser.
     * @param {BasicRule[]} rules The rules to implement into the parser.
     */
    constructor(...rules: BasicRule[]) {
        this.rules.push(...rules);
    }
    /**
     * Add rules to the parser.
     * @param {BasicRule[]} rules The rules to implement into the parser.
     */
    public addRules(...rules: BasicRule[]): void {
        this.rules.push(...rules);
    }
    /**
     * Remove rules from the parser.
     * @param {string[]} rulesName The name of the rules to remove from the parser.
     */
    public removeRules(...rulesName: string[]): void {
        for(let ruleName of rulesName) {
            for(let i = this.rules.length - 1; i >= 0; i--) {
                if(this.rules[i].name && this.rules[i].name === ruleName) {
                    delete this.rules[i];
                }
            }
        }
    }
    /**
     * Convert a string to an object representation following specific rules.
     * @param {string} text The text to parse.
     * @returns {PatternFound[]} The parsed content.
     */
    public parse(text: string): PatternFound[] {
        return LazyParsing.parse(text, LazyParsing.createSet(...this.rules)).result;
    }
    /**
     * Create a set of patterns from a set of rules.
     * @param {BasicRule[]} rules The set of rules to use.
     * @returns {LazyPattern[]} An array of all patterns.
     */
    public static createSet(...rules: BasicRule[]): LazyPattern[] {
        let result = [];
        for(let pattern of rules) {
            result.push(new LazyPattern(pattern));
        }
        return result;
    }
    /**
    * Search every pattern to parse it into an object.
    * @param {string} txtContent The string we're currently parsing.
    * @param {LazyPattern[]} patternSet A list of different pattern to compute.
    * @param {number} i The index with default value to 0. Can be modified for nested searching.
    * @param {(index: number, c: string, text: string) => boolean} endPattern A function to check if a pattern ended.
    * @return {{isPatternEnd: boolean, result: PatternFound[], lastIndex: number}} Return an object representing the value parsed.
    */
    public static parse(txtContent: string, patternSet: LazyPattern[], i: number = 0, endPattern: (i: number, c: string, t: string) => boolean = (i: number, c: string, t: string) => { return false; }): PatternResult
    {
        let subdivided: PatternFound[] = []; // A result called subdivided since it's the input subdivided in multiple pieces.
        for(; i < txtContent.length; i++) // Let's navigate the input
        {
            if(endPattern(i, txtContent[i], txtContent)) // We're in a nested pattern that just ended
            {
                return { // We're gonna return that we're inside an ended pattern, the result and the last index visited
                    isPatternEnd: true,
                    result: subdivided,
                    lastIndex: i
                };
            }
            for(let j = 0; j < patternSet.length; j++) // Let's check all the possible patterns
            {
                if(patternSet[j].isActualPattern(i, txtContent[i], txtContent)) // It's the pattern, let's execute something
                {
                    let lineData = LazyText.countLinesChar(txtContent, i);
                    let fetchResult = patternSet[j].fetchContent(i, txtContent[i], txtContent, patternSet, patternSet[j]); // Execute something then return the fetched result
                    if(fetchResult.lastIndex !== undefined) {
                        i = fetchResult.lastIndex; // Assign the new index
                    } else {
                        throw new Error('Missing returned lastIndex in a fetch.');
                    }
                    let resultObject: PatternFound = {
                        name: patternSet[j]?.name,
                        currentName: fetchResult?.name,
                        begin: fetchResult?.begin,
                        end: fetchResult?.end,
                        nested: fetchResult?.nested,
                        content: fetchResult?.content,
                        error: fetchResult?.error,
                        line: lineData?.lines,
                        lineChar: lineData?.lineChar
                    };
                    subdivided.push(resultObject); // Insert an array of 2 elements (name and content) of the tested pattern inside our subdivided variable.
                    break; // No need to check more pattern, we've got one already
                }
            }
        }
        return { // We've done it 'till the end, no pattern ended over here
            isPatternEnd: false,
            result: subdivided,
            lastIndex: i - 1
        };
    }
    /**
     * Convert the result of a pattern to a string representation.
     * @param {PatternResult | PatternFound[]} content The parsed content.
     * @param {boolean} spacing If true, the result will be written while taking into account the spacing of every elements.
     * @returns {string} The stringified content of the pattern.
     */
    public static toString(content: PatternResult | PatternFound[], spacing: boolean = false): string {
        return LazyParsing.extractString(getType(content) !== 'array' ? (<PatternResult>content).result : <PatternFound[]>content, spacing);
    }
    /**
     * Convert the result of a pattern to a string representation with some datas represented.
     * @param {PatternResult | PatternFound[]} content The parsed content.
     * @param spacing If true, the result will be written while taking into account the spacing of every elements.
     * @returns {string} The stringified content of the pattern.
     */
    public static toStringDebug(content: PatternResult | PatternFound[], spacing: boolean = false): string {
        return LazyParsing.stringifyParse(getType(content) !== 'array' ? (<PatternResult>content).result : <PatternFound[]>content, spacing);
    }
    private static generateSpace(d: number): string {
        let spacing = '';
        for(let i = 0; i < d; i++) {
            spacing = `${spacing}    `;
        }
        return spacing;
    }
    private static extractString(nodes: PatternFound[], spacing: boolean = false, depth: number = 0)
    {
        let space = spacing ? LazyParsing.generateSpace(depth) : '';
        let lineReturn = spacing ? '\n' : '';
        let result = '';
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].nested) { // This node is a sub element (an array if nothing goes wrong)
                result = `${result}${space}${nodes[i].begin}${lineReturn}`;
                if(!nodes[i].error)
                {
                    result = `${result}${LazyParsing.extractString(nodes[i].content, spacing, depth + 1)}${lineReturn}${space}${nodes[i].end}${lineReturn}`;
                }
            }
            else { // It's a string, ez pz let's write it with some spacing
                result = `${result}${space}${nodes[i].content}${lineReturn}`;
            }
        }
        return result;
    }
    private static stringifyParse(nodes: PatternFound[], spacing: boolean = false, depth: number = 0) {
        let space = spacing ? LazyParsing.generateSpace(depth) : '';
        let lineReturn = spacing ? '\n' : '';
        let result = '';
        for(let i = 0; i < nodes.length; i++) {
            if(nodes[i].nested) { // This node is a sub element (an array if nothing goes wrong)
                result = `${result}[${nodes[i].name}][Nested]: ${space}${nodes[i].begin}${lineReturn}`;
                if(!nodes[i].error)
                {
                    result = `${result}${LazyParsing.stringifyParse(nodes[i].content, spacing, depth + 1)}${lineReturn}${space}${nodes[i].end}${lineReturn}`;
                }
            }
            else { // It's a string, ez pz let's write it with some spacing
                result = `${result}[${nodes[i].name}]: ${space}${nodes[i].content}${lineReturn}`;
            }
        }
        return result;
    }
}