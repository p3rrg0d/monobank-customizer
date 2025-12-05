/**
 * Creates a Pickr color picker instance with standard configuration
 * @param {HTMLElement} el - Element to attach the picker to
 * @param {string} defaultColor - Initial color (hex or rgba)
 * @param {Function} onChange - Callback when color changes
 * @param {Function} [onSaveState] - Optional callback to save state before color change
 * @returns {Pickr} Configured Pickr instance
 */
export function createPickrInstance(el, defaultColor, onChange, onSaveState) {
    let hasSavedState = false;

    const pickr = Pickr.create({
        el: el,
        theme: "nano",
        default: defaultColor,
        useAsButton: false, // Show color on button
        comparison: false,

        components: {
            preview: true,
            opacity: false,
            hue: true,

            interaction: {
                hex: true,
                rgba: false,
                input: true,
                save: false,
                clear: false,
            },
        },
    });

    // Store the element reference on pickr for later button updates
    pickr._el = el;

    // Force set color on button after initialization
    pickr.on("init", () => {
        const button = el.querySelector(".pcr-button");
        if (button) {
            button.style.backgroundColor = defaultColor;
            button.style.color = defaultColor;
        }
    });

    // Save state once when user starts changing color
    pickr.on("change", (color) => {
        if (color) {
            // Save state only once at the beginning of a color change session
            if (!hasSavedState && onSaveState) {
                onSaveState();
                hasSavedState = true;
            }

            const hexColor = color.toHEXA().toString();

            // Call onChange callback to update state
            onChange(hexColor);

            // Update button color in real-time
            const button = el.querySelector(".pcr-button");
            if (button) {
                button.style.backgroundColor = hexColor;
                button.style.color = hexColor;
            }
        }
    });

    // Reset the flag when picker is hidden (user finished selecting)
    pickr.on("hide", () => {
        hasSavedState = false;
    });

    return pickr;
}

/**
 * Set pickr color and update button visual (for undo/sync)
 * @param {Pickr} pickr - Pickr instance
 * @param {string} color - Color to set
 */
export function setPickrColorSilent(pickr, color) {
    if (!pickr) return;

    pickr.setColor(color, true); // silent - don't trigger onChange

    // Update button visual manually
    if (pickr._el) {
        const button = pickr._el.querySelector(".pcr-button");
        if (button) {
            button.style.backgroundColor = color;
            button.style.color = color;
        }
    }
}

/**
 * PickrManager - Manages all color picker instances for the widget editor
 */
export class PickrManager {
    constructor(editor) {
        this.editor = editor;
        this.pickers = {};
    }

    /**
     * Initialize all color pickers
     */
    initializeAll() {
        this.initializePreviewPicker();
        this.initializeWidgetPickers();
        this.initializeProgressPickers();
        this.initializeTextPickers();
    }

    /**
     * Initialize preview background color picker
     */
    initializePreviewPicker() {
        this.pickers.previewBg = createPickrInstance(
            this.editor.dom.previewBgPicker,
            "rgba(255, 255, 255, 0)", // Start with transparent to show checkerboard
            (color) => {
                // Check if color is transparent (alpha = 0)
                const rgba = this.pickers.previewBg.getColor().toRGBA();
                if (rgba[3] === 0) {
                    // If transparent, clear the inline style to show CSS checkerboard
                    this.editor.dom.previewBox.style.background = "";
                } else {
                    // Otherwise set the color normally
                    this.editor.dom.previewBox.style.background = color;
                }
            }
            // No saveState for preview - it's not part of widget state
        );
    }

    /**
     * Initialize widget background and border color pickers
     */
    initializeWidgetPickers() {
        // Widget BG Solid
        this.pickers.bgSolid = createPickrInstance(
            this.editor.dom.bgSolidPicker,
            this.editor.state.bgSolidColor,
            (color) => {
                this.editor.state.bgSolidColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

        // Border Color
        this.pickers.border = createPickrInstance(
            this.editor.dom.borderPicker,
            this.editor.state.borderColor,
            (color) => {
                this.editor.state.borderColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );
    }

    /**
     * Initialize progress bar color pickers (track and fill)
     */
    initializeProgressPickers() {
        // Progress Track Solid
        this.pickers.progTrackSolid = createPickrInstance(
            this.editor.dom.progTrackSolidPicker,
            this.editor.state.progTrackSolidColor,
            (color) => {
                this.editor.state.progTrackSolidColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

        // Progress Fill Solid
        this.pickers.progFillSolid = createPickrInstance(
            this.editor.dom.progFillSolidPicker,
            this.editor.state.progFillSolidColor,
            (color) => {
                this.editor.state.progFillSolidColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );
    }

    /**
     * Initialize text color pickers
     */
    initializeTextPickers() {
        // Text Color
        if (this.editor.dom.textColorPicker) {
            this.pickers.textColor = createPickrInstance(
                this.editor.dom.textColorPicker,
                this.editor.state.textColor,
                (color) => {
                    this.editor.state.textColor = color;
                    this.editor.updateAll();
                },
                () => this.editor.saveState()
            );
        }

        // Text Shadow Color
        if (this.editor.dom.textShadowColorPicker) {
            this.pickers.textShadowColor = createPickrInstance(
                this.editor.dom.textShadowColorPicker,
                this.editor.state.textShadowColor,
                (color) => {
                    this.editor.state.textShadowColor = color;
                    this.editor.updateAll();
                },
                () => this.editor.saveState()
            );
        }
    }

    /**
     * Get all picker instances
     * @returns {Object} Object containing all picker instances
     */
    getAllPickers() {
        return this.pickers;
    }
}
