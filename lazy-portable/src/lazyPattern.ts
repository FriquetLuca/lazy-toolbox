import { BasicRule } from "./lazyRule";
/**
 * A pattern founded with some datas.
 */
export interface PatternFound {
    /**
     * The name of the pattern.
     */
    name?: string,
    /**
     * The current name of the pattern, in case it was renamed.
     */
    currentName?: string,
    /**
     * The beggining of the pattern.
     */
    begin?: string,
    /**
     * The end of the pattern.
     */
    end?: string,
    /**
     * If the pattern is nested.
     */
    nested?: boolean,
    /**
     * The content of the pattern.
     */
    content?: any,
    /**
     * If the pattern has gotten any errors on the way.
     */
    error?: boolean,
    /**
     * The line of the pattern.
     */
    line?: number,
    /**
     * The line of the character.
     */
    lineChar?: number,
    /**
     * The last index of the pattern.
     */
    lastIndex?: number
}
/**
 * LazyPattern is a generic class made to check for pattern while looking inside a string.
 * It fetch it's inner value with the pattern founded and then return it's last index.
 */
export class LazyPattern {
    private _name: string;
    private defaultValue?: any;
    private isPattern: (i: number, c: string, t: string) => boolean;
    private isPatternEnd?: (i: number, c: string, t: string) => boolean;
    private fetch?: (i: number, c: string, t: string, isPatternEnd?: ((i: number, c: string, t: string) => boolean), patternSet?: LazyPattern[]) => PatternFound;
   /**
    * Create a pattern object with a bunch of parameters for full customisation.
    * @param {BasicRule} pattern 
    */
   constructor(pattern: BasicRule)
   {
       this._name = pattern.name ?? "";
       this.defaultValue = pattern.defaultValue;
       this.isPattern = pattern.isPattern;
       this.isPatternEnd = pattern.isPatternEnd;
       this.fetch = pattern.fetch;
   }
   /**
    * Get the name of the current pattern.
    */
   public get name(): string {
    return this._name;
   }
   /**
    * Check if we found the pattern.
    * @param {number} i The actual index tested.
    * @param {string} c The actual character tested.
    * @param {string} t The actual text content parsed for special cases.
    * @returns True only if it match the pattern.
    */
   isActualPattern(i: number, c: string, t: string): boolean
   {
       if(this.isPattern !== undefined && this.isPattern !== null)
       {
           return this.isPattern(i, c, t);
       }
       return false;
   }
   /**
    * Check if the pattern ended, used to handle nesting.
    * @param {number} i The actual index tested.
    * @param {string} c The actual character tested.
    * @param {string} t The actual text content parsed for special cases.
    * @returns True only if it match the pattern.
    */
    isEndPattern(i: number, c: string, t: string)
    {
        if(this.isPatternEnd !== undefined && this.isPatternEnd !== null)
        {
            return this.isPatternEnd(i, c, t);
        }
        return false;
    }
   /**
    * Assign the new content matching the desired pattern then return the last index of the pattern.
    * @param {number} i The actual index tested.
    * @param {string} c The actual character tested.
    * @param {string} t The actual text content parsed for special cases.
    * @param {LazyPattern[]} patternSet The actual text content parsed for special cases.
    * @param {LazyPattern} actualPattern The actual pattern we're testing, used for referencing.
    * @returns An object containing the last index of the pattern and the content to fetch. Content is equal to the default value in case fetch isn't defined.
    */
    fetchContent(i: number, c: string, t: string, patternSet: LazyPattern[], actualPattern: LazyPattern)
    {
        if(this.fetch !== undefined && this.fetch !== null)
        {
            return this.fetch(i, c, t, actualPattern.isPatternEnd, patternSet);
        }
        return {
            lastIndex: i,
            content: this.defaultValue
        };
    }
}