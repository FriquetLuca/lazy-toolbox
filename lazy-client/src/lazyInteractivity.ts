import { LazyDualstate } from "./lazyDualstate";
import { LazyTristate } from './lazyTristate';
/**
 * A lazy way to make interactive elements.
 */
export class LazyInteractivity {
    /**
     * Inject into the HTML new element behaviour.
     */
    public static loadDefault() {
        document.querySelectorAll('input[tristate]').forEach((el) => {
            new LazyTristate(<HTMLInputElement>el);
        });
        document.querySelectorAll('input[dualstate]').forEach((el) => {
            new LazyDualstate(<HTMLInputElement>el);
        });
    }
    /**
     * Add support for an input with two states acting like boolean.
     * @param {HTMLInputElement[]} inputsElements HTML input elements that need a dualstate.
     */
    public static dualstate(...inputsElements: HTMLInputElement[]): void {
        inputsElements.forEach((element) => {
            if(element.getAttribute('dualstate') !== null) {
                new LazyDualstate(element);
            }
        });
    }
    /**
     * Add support for an input with three states acting like some kind of boolean.
     * @param {HTMLInputElement[]} inputsElements HTML input elements that need a tristate.
     */
    public static tristate(...inputsElements: HTMLInputElement[]): void {
        inputsElements.forEach((element) => {
            if(element.getAttribute('tristate') !== null) {
                new LazyTristate(element);
            }
        });
    }
}