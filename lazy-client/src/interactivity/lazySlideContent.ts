import { LazyAnimate } from "./lazyAnimate";
/**
 * Insert a smooth sliding effect in a `HTMLDetailsElement`. This `HTMLDetailsElement` should contain a `<summary>` element and a `<content>` element to be valid for the animation.
 * `shr_duration`: Shrinking duration. By default it's set to `200` ms.
 * `shr_ease`: Shrinking easing. By default it's set to "ease-out".
 * `exp_duration`: Expending duration. By default it's set to `200` ms.
 * `exp_ease`: Expending easing. By default it's set to "ease-out".
 */
export class LazySlideContent {
    private el: HTMLDetailsElement;
    private summary: HTMLElement | null;
    private content: HTMLElement | null;
    private isClosing: boolean = false; // Store if the element is closing
    private isExpanding: boolean = false; // Store if the element is expanding
    private animation: Animation | null;
    constructor(el: HTMLDetailsElement) {
      this.el = el; // Store the <details> element
      this.summary = el.querySelector('summary'); // Store the <summary> element
      this.content = el.querySelector('content'); // Store the <content> element
      this.animation = null; // Store the animation object (so we can cancel it if needed)
      // Detect user clicks on the summary element
      this.summary?.addEventListener('click', (e) => this.onClick(e));
    }
    protected onClick(e: any) {
        if(LazyAnimate.MediaQuery && !LazyAnimate.MediaQuery.matches) { // Execute the animation only if the user allow animation being executed
            e.preventDefault(); // Stop default behaviour from the browser
            this.el.style.overflow = 'hidden'; // Add an overflow on the <details> to avoid content overflowing
            if (this.isClosing || !this.el.open) { // Check if the element is being closed or is already closed
                this.open();
            } else if (this.isExpanding || this.el.open) { // Check if the element is being openned or is already open
                this.shrink();
            }
        }
    }
    protected shrink() {
        this.isClosing = true; // Set the element as "being closed"
        const startHeight = `${this.el.offsetHeight}px`; // Store the current height of the element
        const endHeight = `${this.summary?.offsetHeight}px`; // Calculate the height of the summary
        if (this.animation) { // If there is already an animation running
            this.animation.cancel(); // Cancel the current animation
        }
        this.animation = this.el.animate({ // Start a WAAPI animation
            height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
        }, {
            duration: Number(this.el.getAttribute('shr_duration') ?? 250),
            easing: this.el.getAttribute('shr_ease') ?? "ease-out"
        });
        this.animation.onfinish = () => this.onAnimationFinish(false); // When the animation is complete, call onAnimationFinish()
        this.animation.oncancel = () => this.isClosing = false; // If the animation is cancelled, isClosing variable is set to false
    }
    protected open() {
        this.el.style.height = `${this.el.offsetHeight}px`; // Apply a fixed height on the element
        this.el.open = true; // Force the [open] attribute on the details element
        window.requestAnimationFrame(() => this.expand()); // Wait for the next frame to call the expand function
    }
    protected expand() {
        this.isExpanding = true; // Set the element as "being expanding"
        const startHeight = `${this.el.offsetHeight}px`; // Get the current fixed height of the element
        const endHeight = `${(this.summary?.offsetHeight ?? 0) + (this.content?.offsetHeight ?? 0)}px`; // Calculate the open height of the element (summary height + content height)
        if (this.animation) { // If there is already an animation running
            this.animation.cancel(); // Cancel the current animation
        }
        this.animation = this.el.animate({ // Start a WAAPI animation
            height: [startHeight, endHeight] // Set the keyframes from the startHeight to endHeight
        }, {
            duration: Number(this.el.getAttribute('exp_duration') ?? 250),
            easing: this.el.getAttribute('exp_ease') ?? "ease-out"
        });
        this.animation.onfinish = () => this.onAnimationFinish(true); // When the animation is complete, call onAnimationFinish()
        this.animation.oncancel = () => this.isExpanding = false; // If the animation is cancelled, isExpanding variable is set to false
    }
    protected onAnimationFinish(open: boolean) {
        this.el.open = open; // Set the open attribute based on the parameter
        this.animation = null; // Clear the stored animation
        // Reset isClosing & isExpanding
        this.isClosing = false; 
        this.isExpanding = false;
        this.el.style.height = this.el.style.overflow = ''; // Remove the overflow hidden and the fixed height
    }
}