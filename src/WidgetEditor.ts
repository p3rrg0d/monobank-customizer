import "../src/styles/styles.css";
import "../src/styles/circular-slider.css";
import "../src/styles/background.css";
import "../src/styles/preset-showcase.css";
import {
    hexToRgba,
    encodeWidgetState,
    decodeWidgetState,
} from "./utils/helpers.ts";
import { GradientPicker } from "./components/GradientPicker.ts";
import {
    PickrManager,
    setPickrColorSilent,
} from "./components/PickrManager.ts";
import { bindAllEvents } from "./controllers/EventHandlers.ts";
import { ModalManager } from "./managers/ModalManager.ts";
import {
    generateWidgetCSS,
    getBackgroundCSS,
    CSSExporter,
    getQRFrameSVG,
} from "./utils/CSSGenerator.ts";
import { PRESETS } from "./data/Presets.ts";
import { StateManager } from "./managers/StateManager.ts";
import { DragController } from "./controllers/DragController.ts";
import { ShowcaseManager } from "./managers/ShowcaseManager.ts";

// Import types
import { FillSettings, BorderSettings, ShadowSettings } from "./data/types.ts";

export class WidgetEditor {
    public state: any; // We'll type this more strictly if needed
    public defaultState: any;
    public isUpdatingUI: boolean = false;
    public dom: any;
    public stateManager: StateManager;
    public pickrManager: any;
    public dragController: any;
    public modalManager: any;
    public cssExporter: any;
    public showcaseManager: any;

    public bgGradientPicker: any;
    public trackGradientPicker: any;
    public fillGradientPicker: any;


    constructor() {
        const DEFAULT_STATE = {
            background: {
                type: "solid",
                color: "#000000",
                opacity: 1,
                gradientString: "",
                gradientStops: [
                    { id: 1, color: "#000000", opacity: 1, position: 0 },
                    { id: 2, color: "#444444", opacity: 0.8, position: 100 },
                ],
                gradientAngle: 135,
            } as FillSettings,
            border: {
                enabled: false,
                style: "solid",
                width: 0,
                color: "#000000",
                opacity: 0,
                radius: 16,
            } as BorderSettings,
            progress: {
                radius: 12,
                track: {
                    type: "gradient",
                    color: "#e7b5d3",
                    opacity: 1,
                    gradientString: "",
                    gradientStops: [
                        { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
                        { id: 2, color: "#eac6bb", opacity: 1, position: 100 },
                    ],
                    gradientAngle: 135,
                } as FillSettings,
                fill: {
                    type: "gradient",
                    color: "#b93e88",
                    opacity: 1,
                    gradientString: "",
                    gradientStops: [
                        { id: 1, color: "#b93e88", opacity: 1, position: 0 },
                        { id: 2, color: "#fca78c", opacity: 1, position: 100 },
                    ],
                    gradientAngle: 135,
                } as FillSettings,
            },
            text: {
                color: "#ffffff",
                shadow: {
                    enabled: false,
                    color: "#ff0000",
                    opacity: 1,
                    x: 0,
                    y: 2,
                    blur: 0,
                } as ShadowSettings,
            },
            qrFrame: "standard",
        };

        let initialState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        const urlParams = new URLSearchParams(window.location.search);
        const encodedState = urlParams.get("state");
        if (encodedState) {
            try {
                const decodedState = decodeWidgetState(encodedState);
                if (decodedState) {
                    // In a real app we'd deep merge, but for now let's assume structure is flat in encoded form
                    // or properly nested if we updated the encoder (which we did).
                    initialState = { ...initialState, ...decodedState };
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (err) {
                console.error("Failed to restore state from URL:", err);
            }
        }

        this.defaultState = DEFAULT_STATE;
        this.isUpdatingUI = false;

        this.dom = {
            widget: document.querySelector("my-widget"),
            cssExport: document.querySelector(".css-export"),
            previewBox: document.querySelector(".widget-preview"),
            previewBgPicker: document.getElementById("preview-bg-picker"),
            resetBgBtn: document.getElementById("reset-bg-btn"),
            previewProgressSlider: document.getElementById("preview-progress-slider"),

            bgTypeSelect: document.getElementById("bg-type-select"),
            bgSolidPanel: document.getElementById("bg-solid-controls"),
            bgGradientPanel: document.getElementById("bg-gradient-controls"),
            bgSolidPicker: document.getElementById("bg-solid-picker"),
            bgSolidOpacity: document.getElementById("bg-solid-opacity"),

            borderCheckbox: document.getElementById("border-enabled"),
            borderControls: document.getElementById("border-controls"),
            borderStyleSelect: document.getElementById("border-style-select"),
            borderWidthSlider: document.getElementById("border-width-slider"),
            borderPicker: document.getElementById("border-color-picker"),
            borderOpacity: document.getElementById("border-opacity"),
            radiusSlider: document.getElementById("border-radius-slider"),

            progressRadius: document.getElementById("progress-radius-slider"),

            progTrackTypeSelect: document.getElementById("prog-track-type-select"),
            progTrackSolidPanel: document.getElementById("prog-track-solid-controls"),
            progTrackGradientPanel: document.getElementById("prog-track-gradient-controls"),
            progTrackSolidPicker: document.getElementById("prog-track-solid-picker"),
            progTrackSolidOpacity: document.getElementById("prog-track-solid-opacity"),

            progFillTypeSelect: document.getElementById("prog-fill-type-select"),
            progFillSolidPanel: document.getElementById("prog-fill-solid-controls"),
            progFillGradientPanel: document.getElementById("prog-fill-gradient-controls"),
            progFillSolidPicker: document.getElementById("prog-fill-solid-picker"),
            progFillSolidOpacity: document.getElementById("prog-fill-solid-opacity"),

            qrFrameSelect: document.getElementById("qr-frame-select"),

            textColorPicker: document.getElementById("text-color-picker"),
            textShadowCheckbox: document.getElementById("text-shadow-enabled"),
            textShadowControls: document.getElementById("text-shadow-controls"),
            textShadowColorPicker: document.getElementById("text-shadow-color-picker"),
            textShadowX: document.getElementById("text-shadow-x"),
            textShadowY: document.getElementById("text-shadow-y"),
            textShadowBlur: document.getElementById("text-shadow-blur"),

            randomizeBtn: document.getElementById("randomize-btn"),
            undoBtn: document.getElementById("undo-btn"),
            redoBtn: document.getElementById("redo-btn"),
            showcaseBtn: document.getElementById("open-presets-showcase"),
        };

        this.stateManager = new StateManager(initialState, {
            onStateChange: (newState) => {
                this.state = newState;
                this.syncUIToState();
                this.updateAll();
            },
            onUndoAvailabilityChange: (hasHistory) => {
                if (this.dom.undoBtn) this.dom.undoBtn.disabled = !hasHistory;
            },
            onRedoAvailabilityChange: (hasRedoHistory) => {
                if (this.dom.redoBtn) this.dom.redoBtn.disabled = !hasRedoHistory;
            },
        });

        this.state = this.stateManager.get();
        this.init();
    }

    init() {
        this.initGradientPickers();
        this.pickrManager = new PickrManager(this);
        this.pickrManager.initializeAll();
        bindAllEvents(this);
        this.setInitialPanelStates();

        this.dragController = new DragController(this.dom.widget, this.dom.previewBox, { scale: 1.5 });
        this.modalManager = new ModalManager();
        this.modalManager.create();

        this.cssExporter = new CSSExporter(
            this.dom.cssExport,
            () => this.modalManager.show(),
            () => this.modalManager.show(),
        );

        this.showcaseManager = new ShowcaseManager(this);
        this.initPresets();
        this.updateAll();

        setTimeout(() => {
            this.dom.shareBtn = document.getElementById("share-btn");
            if (this.dom.shareBtn) {
                this.dom.shareBtn.addEventListener("click", () => this.shareState());
            }
        }, 100);
    }

    initPresets() {
        if (!this.dom.showcaseBtn) return;
        this.dom.showcaseBtn.addEventListener("click", () => {
            this.showcaseManager.open();
        });
    }

    loadPreset(index: number) {
        const preset = PRESETS[index];
        if (!preset) return;
        const newState = JSON.parse(JSON.stringify(preset.state));
        this.stateManager.save();
        this.stateManager.replace(newState, false);
    }

    initGradientPickers() {
        this.bgGradientPicker = new GradientPicker("bg-gradient-picker", {
            initialStops: this.state.background.gradientStops,
            initialAngle: this.state.background.gradientAngle,
            onChange: (css: string) => {
                this.state.background.gradientString = css;
                if (this.bgGradientPicker) {
                    this.state.background.gradientStops = JSON.parse(JSON.stringify(this.bgGradientPicker.stops));
                    this.state.background.gradientAngle = this.bgGradientPicker.angle;
                }
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
        });

        this.trackGradientPicker = new GradientPicker("prog-track-gradient-picker", {
            initialStops: this.state.progress.track.gradientStops,
            initialAngle: this.state.progress.track.gradientAngle,
            onChange: (css: string) => {
                this.state.progress.track.gradientString = css;
                if (this.trackGradientPicker) {
                    this.state.progress.track.gradientStops = JSON.parse(JSON.stringify(this.trackGradientPicker.stops));
                    this.state.progress.track.gradientAngle = this.trackGradientPicker.angle;
                }
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
        });

        this.fillGradientPicker = new GradientPicker("prog-fill-gradient-picker", {
            initialStops: this.state.progress.fill.gradientStops,
            initialAngle: this.state.progress.fill.gradientAngle,
            onChange: (css: string) => {
                this.state.progress.fill.gradientString = css;
                if (this.fillGradientPicker) {
                    this.state.progress.fill.gradientStops = JSON.parse(JSON.stringify(this.fillGradientPicker.stops));
                    this.state.progress.fill.gradientAngle = this.fillGradientPicker.angle;
                }
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
        });
    }

    setInitialPanelStates() {
        this.togglePanel(this.state.background.type, this.dom.bgSolidPanel, this.dom.bgGradientPanel, this.bgGradientPicker);
        this.togglePanel(this.state.progress.track.type, this.dom.progTrackSolidPanel, this.dom.progTrackGradientPanel, this.trackGradientPicker);
        this.togglePanel(this.state.progress.fill.type, this.dom.progFillSolidPanel, this.dom.progFillGradientPanel, this.fillGradientPicker);
    }

    togglePanel(type: string, solidPanel: HTMLElement, gradPanel: HTMLElement, pickerInstance: any) {
        if (type === "solid") {
            solidPanel.style.display = "block";
            gradPanel.style.display = "none";
        } else {
            solidPanel.style.display = "none";
            gradPanel.style.display = "block";
            if (pickerInstance) pickerInstance.renderHandles();
        }
    }

    updateAll() {
        if (!this.dom.widget) return;
        const s = this.dom.widget.style;

        const bg = getBackgroundCSS(this.state.background);
        s.setProperty("--widget-bg-color", bg);

        const borderCol = hexToRgba(this.state.border.color, this.state.border.opacity);
        s.setProperty("--widget-border-color", borderCol);
        s.setProperty("--widget-border-width", (this.state.border.enabled ? this.state.border.width : 0) + "px");
        s.setProperty("--widget-border-style", this.state.border.style);
        s.setProperty("--widget-border-radius", this.state.border.radius + "px");

        s.setProperty("--progress-radius", this.state.progress.radius + "px");

        const trackBg = getBackgroundCSS(this.state.progress.track);
        s.setProperty("--progress-bg-color", trackBg);

        const fillBg = getBackgroundCSS(this.state.progress.fill);
        s.setProperty("--progress-gradient", fillBg);

        s.setProperty("--qr-frame-bg", getQRFrameSVG(this.state.qrFrame));

        if (this.state.qrFrame === "frame2") {
            s.setProperty("--qr-container-width", "180px");
            s.setProperty("--qr-container-pos-x", "-20.1px");
            s.setProperty("--qr-container-pos-y", "-19.5px");
            s.setProperty("--qr-width", "50%");
            s.setProperty("--qr-top", "17px");
            s.setProperty("--qr-left", "13.4%");
            s.setProperty("--qr-position", "relative");
        } else {
            s.setProperty("--qr-container-width", "145px");
            s.setProperty("--qr-container-pos-x", "-5px");
            s.setProperty("--qr-container-pos-y", "0px");
            s.setProperty("--qr-width", "45%");
            s.setProperty("--qr-top", "23%");
            s.setProperty("--qr-left", "26.5%");
            s.setProperty("--qr-position", "absolute");
        }

        s.setProperty("--widget-text-color", this.state.text.color);
        const shadow = this.state.text.shadow;
        const textShadow = shadow.enabled
            ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${hexToRgba(shadow.color, shadow.opacity)}`
            : "none";
        s.setProperty("--widget-text-shadow", textShadow);

        if (this.cssExporter) {
            const css = generateWidgetCSS(this.state);
            this.cssExporter.updateCSS(css);
        }
    }

    saveState() {
        if (this.isUpdatingUI) return;
        this.stateManager.save();
    }

    undo() {
        this.stateManager.undo();
    }

    redo() {
        this.stateManager.redo();
    }

    syncUIToState() {
        this.isUpdatingUI = true;

        if (this.dom.bgTypeSelect) this.dom.bgTypeSelect.value = this.state.background.type;
        if (this.dom.bgSolidOpacity) {
            this.dom.bgSolidOpacity.value = this.state.background.opacity;
            const rangeVal = this.dom.bgSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.background.opacity.toFixed(2);
        }

        if (this.dom.borderCheckbox) this.dom.borderCheckbox.checked = this.state.border.enabled;
        if (this.dom.borderControls) this.dom.borderControls.style.display = this.state.border.enabled ? "block" : "none";
        if (this.dom.borderStyleSelect) this.dom.borderStyleSelect.value = this.state.border.style;
        if (this.dom.borderWidthSlider) {
            this.dom.borderWidthSlider.value = this.state.border.width;
            const rangeVal = this.dom.borderWidthSlider.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.border.width}px`;
        }
        if (this.dom.borderOpacity) {
            this.dom.borderOpacity.value = this.state.border.opacity;
            const rangeVal = this.dom.borderOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.border.opacity.toFixed(2);
        }
        if (this.dom.radiusSlider) {
            this.dom.radiusSlider.value = this.state.border.radius;
            const rangeVal = this.dom.radiusSlider.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.border.radius}px`;
        }

        if (this.dom.progressRadius) {
            this.dom.progressRadius.value = this.state.progress.radius;
            const rangeVal = this.dom.progressRadius.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.progress.radius}px`;
        }
        if (this.dom.progTrackTypeSelect) this.dom.progTrackTypeSelect.value = this.state.progress.track.type;
        if (this.dom.progTrackSolidOpacity) {
            this.dom.progTrackSolidOpacity.value = this.state.progress.track.opacity;
            const rangeVal = this.dom.progTrackSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.progress.track.opacity.toFixed(2);
        }
        if (this.dom.progFillTypeSelect) this.dom.progFillTypeSelect.value = this.state.progress.fill.type;
        if (this.dom.progFillSolidOpacity) {
            this.dom.progFillSolidOpacity.value = this.state.progress.fill.opacity;
            const rangeVal = this.dom.progFillSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.progress.fill.opacity.toFixed(2);
        }

        if (this.dom.qrFrameSelect) this.dom.qrFrameSelect.value = this.state.qrFrame;

        if (this.dom.textShadowCheckbox) this.dom.textShadowCheckbox.checked = this.state.text.shadow.enabled;
        if (this.dom.textShadowControls) this.dom.textShadowControls.style.display = this.state.text.shadow.enabled ? "block" : "none";
        if (this.dom.textShadowX) {
            this.dom.textShadowX.value = this.state.text.shadow.x;
            const rangeVal = this.dom.textShadowX.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.text.shadow.x}px`;
        }
        if (this.dom.textShadowY) {
            this.dom.textShadowY.value = this.state.text.shadow.y;
            const rangeVal = this.dom.textShadowY.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.text.shadow.y}px`;
        }
        if (this.dom.textShadowBlur) {
            this.dom.textShadowBlur.value = this.state.text.shadow.blur;
            const rangeVal = this.dom.textShadowBlur.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.text.shadow.blur}px`;
        }

        this.setInitialPanelStates();

        if (this.pickrManager) {
            setPickrColorSilent(this.pickrManager.pickers.bgSolid, this.state.background.color);
            setPickrColorSilent(this.pickrManager.pickers.border, this.state.border.color);
            setPickrColorSilent(this.pickrManager.pickers.progTrackSolid, this.state.progress.track.color);
            setPickrColorSilent(this.pickrManager.pickers.progFillSolid, this.state.progress.fill.color);
            setPickrColorSilent(this.pickrManager.pickers.textColor, this.state.text.color);
            setPickrColorSilent(this.pickrManager.pickers.textShadowColor, this.state.text.shadow.color);
        }

        if (this.bgGradientPicker) this.bgGradientPicker.setStops(this.state.background.gradientStops, this.state.background.gradientAngle, true);
        if (this.trackGradientPicker) this.trackGradientPicker.setStops(this.state.progress.track.gradientStops, this.state.progress.track.gradientAngle, true);
        if (this.fillGradientPicker) this.fillGradientPicker.setStops(this.state.progress.fill.gradientStops, this.state.progress.fill.gradientAngle, true);

        this.isUpdatingUI = false;
    }

    randomize() {
        this.stateManager.randomize();
    }

    shareState() {
        const delta: any = {};
        for (const key in this.state) {
            const currentValue = this.state[key];
            const defaultValue = (this.defaultState as any)[key];
            if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
                delta[key] = currentValue;
            }
        }

        const encoded = encodeWidgetState(delta);
        if (!encoded) return;

        const url = new URL(window.location.href);
        url.searchParams.set("state", encoded);

        navigator.clipboard.writeText(url.toString()).then(() => {
            if (!this.dom.shareBtn) return;
            const originalHTML = this.dom.shareBtn.innerHTML;
            this.dom.shareBtn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;
            this.dom.shareBtn.style.background = "#4ade80";
            this.dom.shareBtn.style.transform = "scale(1.1)";
            this.dom.shareBtn.style.transition = "all 0.2s ease";

            setTimeout(() => {
                this.dom.shareBtn.innerHTML = originalHTML;
                this.dom.shareBtn.style.background = "#febc2e";
                this.dom.shareBtn.style.transform = "";
            }, 1500);
        });
    }
}
