#### [LazyTheme](#lazyTheme)

```ts
class LazyTheme {
    constructor(themesClasses: string[], elementsQueries: string[]);
    theme(): string;
    setNextTheme(): void;
    setPreviousTheme(): void;
    setTheme(): void;
    useTheme(newTheme: string): void;
}
```

A lazy theme implementation.
It takes a bunch of theme names that will be used as HTML class having the same name.
It's useful to handle multiple theme with CSS without having the need to manually implement anything to handle theme other than specifying it's changes.

Example:

```js
const { LazyTheme } = require('@friquet-luca/lazy-portable');
const myThemes = new LazyTheme(
    [ // Themes class name
        'light',
        'dark',
        'azure'
    ],
    [ // Queries for elements to be modified
        'body',
        '.myDiv',
        '.myUserTmp'
    ]
);
myThemes.setTheme(); // Use the theme, the default theme is light here since it's the first element in the theme array.
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set the next element in the array, dark, as default theme to be used.
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set azure as next element
console.log(myThemes.theme());

myThemes.setNextTheme(); // Set light as next element since there's no element after aruze. The array is looped.
console.log(myThemes.theme());

// setPreviousTheme() has the same behaviour.

myThemes.useTheme('dark'); // Set the current theme to dark
console.log(myThemes.theme());

myThemes.useTheme('omega'); // Set the current theme to light since omega isn't a valid theme
console.log(myThemes.theme());
```
