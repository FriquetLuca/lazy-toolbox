import { LazySlideContent } from "./lazySlideContent";
/**
 * A way to inject some animation into elements.
 */
export class LazyAnimate {
    /**
     * The `prefers-reduced-motion: reduce` media query to check for animations.
     */
    public static MediaQuery: MediaQueryList = window.matchMedia("(prefers-reduced-motion: reduce)");
    /**
     * Add a sliding content to all HTML details elements that passed through the function.
     * @param {HTMLDetailsElement[]} detailsElements HTML details elements that need a sliding content.
     */
    public static details(...detailsElements: HTMLDetailsElement[]): void {
        detailsElements.forEach((element) => {
            new LazySlideContent(element);
        });
    }
    /**
     * Inject into the HTML new elements behaviour.
     */
    public static loadDefault(): void {
        document.querySelectorAll('details[animated]').forEach((el) => {
            new LazySlideContent(<HTMLDetailsElement>el);
        });
    }
}