/**
 * A lazy theme implementation.
 * @method theme Get the current theme used.
 * @method setNextTheme Change the theme to the next one available in the list.
 * @method setPreviousTheme Change the theme to the previous one available in the list.
 * @method setTheme Set the current theme on the page.
 * @method useTheme Use a theme that exist on the page otherwise it will use the current theme.
 */
export class LazyTheme {
    private defaultTheme: number;
    private themes: string[];
    private elements: string[];
    /**
     * Create a theme handle by giving it a bunch of CSS classes for theme and all the elements that should be affected by it.
     * @param themesClasses An array of all CSS classes that handle the theme.
     * @param elementsQueries An array of all queries of the HTML elements that are affected by the theme.
     */
    constructor(themesClasses: string[], elementsQueries: string[])
    {
        this.defaultTheme = 0;
        this.themes = themesClasses;
        this.elements = elementsQueries;
    }
    /**
     * Get the current theme used.
     * @returns {string} The name of the current CSS class that handle the theme.
     */
    public theme(): string {
        return this.themes[this.defaultTheme];
    }
    /**
     * Change the theme to the next one available in the list.
     */
    public setNextTheme(): void {
        this.defaultTheme++;
        this.toggleTheme();
        this.setTheme();
    }
    /**
     * Change the theme to the previous one available in the list.
     */
    public setPreviousTheme(): void {
        this.defaultTheme--;
        this.toggleTheme();
        this.setTheme();
    }
    /**
     * Set the current theme on the page.
     */
    public setTheme(): void {
        let useTheme = this.themes[this.defaultTheme];
        for(const element of this.elements) {
            this.setNewTheme(element, useTheme);
        }
    }
    /**
     * Use a theme that exist on the page otherwise it will use the current theme.
     * @param {string} newTheme The name of the theme to use.
     */
    public useTheme(newTheme: string): void {
        let useTheme = newTheme;
        if(!this.themes.includes(newTheme)) {
            useTheme = this.themes[this.defaultTheme];
        }
        for(const element of this.elements) {
            this.setNewTheme(element, useTheme);
        }
    }
    /**
     * Clamp the value of the defaultTheme with modulo.
     */
    private toggleTheme(): void {
        this.defaultTheme = this.defaultTheme - Math.floor(this.defaultTheme / this.themes.length) * this.themes.length;
    }
    /**
     * Handle the DOM changes for the theme.
     * @param elementQuery 
     * @param newTheme 
     */
    private setNewTheme(elementQuery: string, newTheme: string): void {
        let elements = document.querySelectorAll(elementQuery);
        for(const e of elements)
        {
            for(const t of this.themes)
            {
                e.classList.remove(t);
            }
            e.classList.add(newTheme);
        }
    }
}