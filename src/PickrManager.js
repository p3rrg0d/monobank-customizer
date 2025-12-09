export function createPickrInstance(el, defaultColor, onChange, onSaveState) {
    let hasSavedState = false;

    const pickr = Pickr.create({
        el: el,
        theme: "nano",
        default: defaultColor,
        useAsButton: false,
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

    pickr._el = el;

    pickr.on("init", () => {
        const button = el.querySelector(".pcr-button");
        if (button) {
            button.style.backgroundColor = defaultColor;
            button.style.color = defaultColor;
        }
    });

    pickr.on("change", (color) => {
        if (color) {
            if (!hasSavedState && onSaveState) {
                onSaveState();
                hasSavedState = true;
            }

            const hexColor = color.toHEXA().toString();

            onChange(hexColor);

            const button = el.querySelector(".pcr-button");
            if (button) {
                button.style.backgroundColor = hexColor;
                button.style.color = hexColor;
            }
        }
    });

    pickr.on("hide", () => {
        hasSavedState = false;
    });

    return pickr;
}

export function setPickrColorSilent(pickr, color) {
    if (!pickr) return;

    pickr.setColor(color, true);

    if (pickr._el) {
        const button = pickr._el.querySelector(".pcr-button");
        if (button) {
            button.style.backgroundColor = color;
            button.style.color = color;
        }
    }
}

export class PickrManager {
    constructor(editor) {
        this.editor = editor;
        this.pickers = {};
    }

    initializeAll() {
        this.initializePreviewPicker();
        this.initializeWidgetPickers();
        this.initializeProgressPickers();
        this.initializeTextPickers();
    }

    initializePreviewPicker() {
        this.pickers.previewBg = createPickrInstance(
            this.editor.dom.previewBgPicker,
            "rgba(255, 255, 255, 0)",
            (color) => {
                const rgba = this.pickers.previewBg.getColor().toRGBA();
                if (rgba[3] === 0) {
                    this.editor.dom.previewBox.style.background = "";
                } else {
                    this.editor.dom.previewBox.style.background = color;
                }
            }
        );
    }

    initializeWidgetPickers() {
        this.pickers.bgSolid = createPickrInstance(
            this.editor.dom.bgSolidPicker,
            this.editor.state.bgSolidColor,
            (color) => {
                this.editor.state.bgSolidColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

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

    initializeProgressPickers() {
        this.pickers.progTrackSolid = createPickrInstance(
            this.editor.dom.progTrackSolidPicker,
            this.editor.state.progTrackSolidColor,
            (color) => {
                this.editor.state.progTrackSolidColor = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

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

    initializeTextPickers() {
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

    getAllPickers() {
        return this.pickers;
    }
}
