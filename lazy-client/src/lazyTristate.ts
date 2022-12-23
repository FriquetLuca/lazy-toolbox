const TRISTATE_STATE = {
    true: 'true',
    false: 'false',
    neutral: 'neutral',
    TRUE: 'TRUE',
    FALSE: 'FALSE',
    NEUTRAL: 'NEUTRAL'
} as const;
/**
 * A two state kind of value. Is valid: `true`, `false`, `neutral`, `TRUE`, `FALSE` and `NEUTRAL`.
 */
export type TristateState = keyof typeof TRISTATE_STATE;
/**
 * A lazy way to use three states.
 */
export class LazyTristate {
    constructor(item: HTMLInputElement) {
        const itemValue = item.getAttribute('value') ?? 'neutral';
        item.readOnly = true;
        item.size = 1;
        if(!itemValue) {
            item.setAttribute('value', LazyTristate.NEUTRAL);
            item.innerText = LazyTristate.NEUTRAL;
        } else {
            const stateSymbol = LazyTristate.getState(itemValue);
            item.setAttribute('value', stateSymbol);
            item.innerText = stateSymbol;
        }
        item.addEventListener('click', (e) => {
            const nextVal = LazyTristate.nextState(<TristateState>item.getAttribute('value'));
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
    public static TRUE = '\u2705';
    public static FALSE = '\u274C';
    public static NEUTRAL = '\u2753';
    /**
     * Convert a valid tristate value into a string value. Can be either: `true`, `false` or `neutral`.
     * @param {TristateState | string | boolean} actualTristate The tristate value.
     */
    public static stateToString(actualTristate: TristateState): string;
    public static stateToString(actualTristate: string): string;
    public static stateToString(actualTristate: boolean): string;
    public static stateToString(actualTristate: TristateState | string | boolean): string {
        switch(actualTristate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return "true";
            case '\u2753':
            case 'neutral':
            case 'NEUTRAL':
                return "neutral";
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return "false";
            default:
                return "undefined";
        }
    }
    /**
     * Get the current tristate unicode value.
     * @param {TristateState | string | boolean} actualTristate The tristate value.
     */
    public static getState(actualTristate: TristateState): string;
    public static getState(actualTristate: string): string;
    public static getState(actualTristate: boolean): string;
    public static getState(actualTristate: TristateState | string | boolean) {
        switch(actualTristate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return LazyTristate.TRUE;
            case '\u2753':
            case 'neutral':
            case 'NEUTRAL':
                return LazyTristate.NEUTRAL;
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return LazyTristate.FALSE;
            default:
                return undefined;
        }
    }
    /**
     * Get the next tristate unicode value.
     * @param {TristateState | string | boolean} actualTristate The tristate value.
     */
    public static nextState(actualTristate: TristateState): string;
    public static nextState(actualTristate: string): string;
    public static nextState(actualTristate: boolean): string;
    public static nextState(actualTristate: TristateState | string | boolean) {
        switch(actualTristate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return LazyTristate.FALSE;
            case '\u2753':
            case 'neutral':
            case 'NEUTRAL':
                return LazyTristate.TRUE;
            case false:
            case '\u274C':
            case 'false':
            case 'FALSE':
                return LazyTristate.NEUTRAL;
            default:
                return undefined;
        }
    }
    /**
     * Get the previous tristate unicode value.
     * @param {TristateState | string | boolean} actualTristate The tristate value.
     */
    public static previousState(actualTristate: TristateState): string;
    public static previousState(actualTristate: string): string;
    public static previousState(actualTristate: boolean): string;
    public static previousState(actualTristate: TristateState | string | boolean) {
        switch(actualTristate) {
            case true:
            case '\u2705':
            case 'true':
            case 'TRUE':
                return LazyTristate.NEUTRAL;
            case '\u2753':
            case 'neutral':
            case 'NEUTRAL':
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