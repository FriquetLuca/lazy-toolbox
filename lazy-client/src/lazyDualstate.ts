import { LazyTristate } from "./lazyTristate";
const DUAL_STATE = {
    true: 'true',
    false: 'false',
    TRUE: 'true',
    FALSE: 'false'
} as const;
/**
 * A two state kind of value. Is valid: `true`, `false`, `TRUE` and `FALSE`.
 */
export type DualstateState = keyof typeof DUAL_STATE;
/**
 * A lazy way to use two states.
 */
export class LazyDualstate {
    constructor(item: HTMLInputElement) {
        const itemValue = item.getAttribute('value') ?? 'false';
        item.readOnly = true;
        item.size = 1;
        if(!itemValue) {
            item.setAttribute('value', LazyTristate.FALSE);
            item.innerText = LazyTristate.FALSE;
        } else {
            const stateSymbol = LazyDualstate.getState(itemValue);
            item.setAttribute('value', stateSymbol);
            item.innerText = stateSymbol;
        }
        item.addEventListener('click', (e) => {
            const nextVal = LazyDualstate.nextState(<DualstateState>item.getAttribute('value'));
            item.setAttribute('value', nextVal);
            item.innerText = nextVal;
            if ("createEvent" in document) {
                var evt = document.createEvent("Event");
                evt.initEvent("change", false, true);
                item.dispatchEvent(evt);
            }
            else {
                item.dispatchEvent(new Event('change'));
            }
        });
    }
    /**
     * Convert a valid dualstate value into a boolean.
     * @param {DualstateState | string | boolean} actualDualstate The dualstate value.
     */
    public static stateToBool(actualDualstate: DualstateState): boolean;
    public static stateToBool(actualDualstate: string): boolean;
    public static stateToBool(actualDualstate: boolean): boolean;
    public static stateToBool(actualDualstate: DualstateState | string | boolean) {
        switch(actualDualstate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return true;
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return false;
            default:
                return undefined;
        }
    }
    /**
     * Get the unicode representation of a dualstate value.
     * @param {DualstateState | string | boolean} actualDualstate The dualstate value.
     */
    public static getState(actualDualstate: DualstateState): string;
    public static getState(actualDualstate: string): string;
    public static getState(actualDualstate: boolean): string;
    public static getState(actualDualstate: DualstateState | string | boolean) {
        switch(actualDualstate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return LazyTristate.TRUE;
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return LazyTristate.FALSE;
        }
    }
    /**
     * Get the unicode representation of the next dualstate value.
     * @param {DualstateState | string | boolean} actualDualstate The dualstate value.
     */
    public static nextState(actualDualstate: DualstateState): string;
    public static nextState(actualDualstate: string): string;
    public static nextState(actualDualstate: boolean): string;
    public static nextState(actualDualstate: DualstateState | string | boolean) {
        switch(actualDualstate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return LazyTristate.FALSE;
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return LazyTristate.TRUE;
            default:
                return undefined;
        }
    }
}