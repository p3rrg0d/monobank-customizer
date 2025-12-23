import Pickr from '@simonwep/pickr';
import '@simonwep/pickr/dist/themes/nano.min.css';

export function createPickrInstance(el: HTMLElement, defaultColor: string, onChange: (color: string) => void, onSaveState?: () => void) {
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

    (pickr as any)._el = el;

    pickr.on("init", () => {
        const button = el.querySelector(".pcr-button") as HTMLElement;
        if (button) {
            button.style.backgroundColor = defaultColor;
            button.style.color = defaultColor;
        }
    });

    pickr.on("change", (color: any) => {
        if (color) {
            if (!hasSavedState && onSaveState) {
                onSaveState();
                hasSavedState = true;
            }

            const hexColor = color.toHEXA().toString();

            onChange(hexColor);

            const button = el.querySelector(".pcr-button") as HTMLElement;
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

export function setPickrColorSilent(pickr: any, color: string) {
    if (!pickr) return;

    pickr.setColor(color, true);

    if (pickr._el) {
        const button = pickr._el.querySelector(".pcr-button") as HTMLElement;
        if (button) {
            button.style.backgroundColor = color;
            button.style.color = color;
        }
    }
}

export class PickrManager {
    private editor: any;
    public pickers: Record<string, any> = {};

    constructor(editor: any) {
        this.editor = editor;
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
            this.editor.state.background.color,
            (color) => {
                this.editor.state.background.color = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

        this.pickers.border = createPickrInstance(
            this.editor.dom.borderPicker,
            this.editor.state.border.color,
            (color) => {
                this.editor.state.border.color = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );
    }

    initializeProgressPickers() {
        this.pickers.progTrackSolid = createPickrInstance(
            this.editor.dom.progTrackSolidPicker,
            this.editor.state.progress.track.color,
            (color) => {
                this.editor.state.progress.track.color = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );

        this.pickers.progFillSolid = createPickrInstance(
            this.editor.dom.progFillSolidPicker,
            this.editor.state.progress.fill.color,
            (color) => {
                this.editor.state.progress.fill.color = color;
                this.editor.updateAll();
            },
            () => this.editor.saveState()
        );
    }

    initializeTextPickers() {
        if (this.editor.dom.textColorPicker) {
            this.pickers.textColor = createPickrInstance(
                this.editor.dom.textColorPicker,
                this.editor.state.text.color,
                (color) => {
                    this.editor.state.text.color = color;
                    this.editor.updateAll();
                },
                () => this.editor.saveState()
            );
        }

        if (this.editor.dom.textShadowColorPicker) {
            this.pickers.textShadowColor = createPickrInstance(
                this.editor.dom.textShadowColorPicker,
                this.editor.state.text.shadow.color,
                (color) => {
                    this.editor.state.text.shadow.color = color;
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
