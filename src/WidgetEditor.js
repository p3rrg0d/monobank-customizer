import '../src/styles/styles.css';
import '../src/styles/circular-slider.css';
import '../src/styles/background.css';
import { hexToRgba, encodeWidgetState, decodeWidgetState } from './utils/helpers.js';
import { GradientPicker } from './components/GradientPicker.js';
import { PickrManager, setPickrColorSilent } from './components/PickrManager.js';
import { bindAllEvents } from './controllers/EventHandlers.js';
import { ModalManager } from './managers/ModalManager.js';
import { generateWidgetCSS, getBackgroundCSS, CSSExporter, getQRFrameSVG } from './utils/CSSGenerator.js';
import { PRESETS } from './utils/Presets.js';
import { StateManager } from './managers/StateManager.js';
import { DragController } from './controllers/DragController.js';

export class WidgetEditor {
    constructor() {
        // Define DEFAULT state first
        const DEFAULT_STATE = {
            bgType: "solid",
            bgSolidColor: "#000000",
            bgSolidOpacity: 1,
            bgGradientString: "",
            bgGradientStops: [
                { id: 1, color: "#000000", opacity: 1, position: 0 },
                { id: 2, color: "#444444", opacity: 0.8, position: 100 },
            ],
            bgGradientAngle: 135,

            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0,
            borderColor: "#000000",
            borderOpacity: 0,
            borderRadius: 16,

            progressRadius: 12,

            progTrackType: "gradient",
            progTrackSolidColor: "#e7b5d3",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",
            progTrackGradientStops: [
                { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
                { id: 2, color: "#eac6bb", opacity: 1, position: 100 },
            ],
            progTrackGradientAngle: 135,

            progFillType: "gradient",
            progFillSolidColor: "#b93e88",
            progFillSolidOpacity: 1,
            progFillGradientString: "",
            progFillGradientStops: [
                { id: 1, color: "#b93e88", opacity: 1, position: 0 },
                { id: 2, color: "#fca78c", opacity: 1, position: 100 },
            ],
            progFillGradientAngle: 135,

            textColor: "#ffffff",

            textShadowEnabled: false,
            textShadowColor: "#ff0000",
            textShadowOpacity: 1,
            textShadowX: 0,
            textShadowY: 2,
            textShadowBlur: 0,

            qrFrame: "standard",
        };

        // Check for state in URL BEFORE creating initialState
        let initialState = { ...DEFAULT_STATE };
        const urlParams = new URLSearchParams(window.location.search);
        const encodedState = urlParams.get('state');
        if (encodedState) {
            try {
                const decodedState = decodeWidgetState(encodedState);
                if (decodedState) {
                    // Merge decoded state with default structure
                    initialState = { ...initialState, ...decodedState };
                    // Clean URL immediately
                    window.history.replaceState({}, document.title, window.location.pathname);
                }
            } catch (err) {
                console.error("Failed to restore state from URL:", err);
            }
        }

        // Store default state reference for delta encoding
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
            presetSelect: document.getElementById("preset-select"),
        };

        // Initialize State Manager
        this.stateManager = new StateManager(initialState, {
            onStateChange: (newState) => {
                this.state = newState; // Keep reference for legacy access if needed, or remove
                this.syncUIToState();
                this.updateAll();
            },
            onUndoAvailabilityChange: (hasHistory) => {
                if (this.dom.undoBtn) {
                    this.dom.undoBtn.disabled = !hasHistory;
                }
            }
        });

        // Proxy state for compatibility
        this.state = this.stateManager.state;

        this.init();
    }

    init() {
        this.initGradientPickers();

        this.pickrManager = new PickrManager(this);
        this.pickrManager.initializeAll();

        bindAllEvents(this);

        this.setInitialPanelStates();

        // Initialize Drag Controller
        this.dragController = new DragController(this.dom.widget, this.dom.previewBox, {
            scale: 1.5
        });

        this.modalManager = new ModalManager();
        this.modalManager.create();

        this.cssExporter = new CSSExporter(
            this.dom.cssExport,
            () => this.modalManager.show(), // onFirstCopy
            () => this.modalManager.show()  // onTutorialClick
        );

        this.initPresets();
        this.updateAll();

        // Initialize Share Button (must be after CSSExporter init since button is created there)
        setTimeout(() => {
            this.dom.shareBtn = document.getElementById("share-btn");
            if (this.dom.shareBtn) {
                this.dom.shareBtn.addEventListener("click", () => this.shareState());
            }
        }, 100);
    }

    initPresets() {
        if (!this.dom.presetSelect) return;

        PRESETS.forEach((preset, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = preset.name;
            this.dom.presetSelect.appendChild(option);
        });

        this.dom.presetSelect.addEventListener("change", (e) => {
            const index = e.target.value;
            if (index === "") return;
            this.loadPreset(parseInt(index));
        });
    }

    loadPreset(index) {
        const preset = PRESETS[index];
        if (!preset) return;

        // Force update internal pickers too?
        // Ideally, StateManager handles the data, but Pickers need to be told about new stops manually 
        // because they maintain their own internal state (objects vs arrays).

        // We do this BEFORE telling StateManager to replace state, so the UI update loop uses correct picker data if queried
        // Actually, we should update Pickers AFTER state replacement but BEFORE UI sync.

        const newState = JSON.parse(JSON.stringify(preset.state));

        // Save current state to history BEFORE applying the new preset.
        // We do not manually update pickers here because stateManager.replace() will trigger onStateChange,
        // which calls syncUIToState(), which correctly updates pickers silently.
        this.stateManager.save();

        this.stateManager.replace(newState, false);

        // Wait, original logic: saveState() then replace. 
        // Our replace method doesn't push to history automatically.
        // let's assume global saveState was called before this if triggered by user action? 
        // No, let's just use replace.
    }

    initGradientPickers() {
        this.bgGradientPicker = new GradientPicker("bg-gradient-picker", {
            initialStops: this.state.bgGradientStops,
            initialAngle: this.state.bgGradientAngle,
            onChange: (css) => {
                this.state.bgGradientString = css;
                if (this.bgGradientPicker) {
                    this.state.bgGradientStops = JSON.parse(JSON.stringify(this.bgGradientPicker.stops));
                    this.state.bgGradientAngle = this.bgGradientPicker.angle;
                }
                this.updateAll(); // Direct update for performance during drag
            },
            onSaveState: () => this.saveState(), // Delegate to wrapper
        });

        this.trackGradientPicker = new GradientPicker("prog-track-gradient-picker", {
            initialStops: this.state.progTrackGradientStops,
            initialAngle: this.state.progTrackGradientAngle,
            onChange: (css) => {
                this.state.progTrackGradientString = css;
                if (this.trackGradientPicker) {
                    this.state.progTrackGradientStops = JSON.parse(JSON.stringify(this.trackGradientPicker.stops));
                    this.state.progTrackGradientAngle = this.trackGradientPicker.angle;
                }
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
        });

        this.fillGradientPicker = new GradientPicker("prog-fill-gradient-picker", {
            initialStops: this.state.progFillGradientStops,
            initialAngle: this.state.progFillGradientAngle,
            onChange: (css) => {
                this.state.progFillGradientString = css;
                if (this.fillGradientPicker) {
                    this.state.progFillGradientStops = JSON.parse(JSON.stringify(this.fillGradientPicker.stops));
                    this.state.progFillGradientAngle = this.fillGradientPicker.angle;
                }
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
        });
    }

    setInitialPanelStates() {
        this.togglePanel(
            this.state.bgType,
            this.dom.bgSolidPanel,
            this.dom.bgGradientPanel,
            this.bgGradientPicker
        );

        this.togglePanel(
            this.state.progTrackType,
            this.dom.progTrackSolidPanel,
            this.dom.progTrackGradientPanel,
            this.trackGradientPicker
        );

        this.togglePanel(
            this.state.progFillType,
            this.dom.progFillSolidPanel,
            this.dom.progFillGradientPanel,
            this.fillGradientPicker
        );
    }

    togglePanel(type, solidPanel, gradPanel, pickerInstance) {
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
        if (this.dom.widget) {
            const s = this.dom.widget.style;

            const bg = getBackgroundCSS(
                this.state.bgType,
                this.state.bgSolidColor,
                this.state.bgSolidOpacity,
                this.state.bgGradientString
            );
            s.setProperty("--widget-bg-color", bg);

            const borderCol = hexToRgba(this.state.borderColor, this.state.borderOpacity);
            s.setProperty("--widget-border-color", borderCol);
            s.setProperty("--widget-border-width", this.state.borderWidth + "px");
            s.setProperty("--widget-border-style", this.state.borderStyle);
            s.setProperty("--widget-border-radius", this.state.borderRadius + "px");

            s.setProperty("--progress-radius", this.state.progressRadius + "px");

            const trackBg = getBackgroundCSS(
                this.state.progTrackType,
                this.state.progTrackSolidColor,
                this.state.progTrackSolidOpacity,
                this.state.progTrackGradientString
            );
            s.setProperty("--progress-bg-color", trackBg);

            const fillBg = getBackgroundCSS(
                this.state.progFillType,
                this.state.progFillSolidColor,
                this.state.progFillSolidOpacity,
                this.state.progFillGradientString
            );
            console.log("updateAll: setting --progress-gradient to", fillBg, "Type:", this.state.progFillType, "Color:", this.state.progFillSolidColor);
            s.setProperty("--progress-gradient", fillBg);

            s.setProperty("--qr-frame-bg", getQRFrameSVG(this.state.qrFrame));

            if (['frame2', 'frame3'].includes(this.state.qrFrame)) {
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

            s.setProperty("--widget-text-color", this.state.textColor);
            const textShadow = this.state.textShadowEnabled
                ? `${this.state.textShadowX}px ${this.state.textShadowY}px ${this.state.textShadowBlur}px ${hexToRgba(this.state.textShadowColor, this.state.textShadowOpacity)}`
                : 'none';
            s.setProperty("--widget-text-shadow", textShadow);
        }

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
        // Since undoing triggers onStateChange -> syncUIToState -> updateAll, we might need to manually sync complex pickers
        // We will do it in syncUIToState
    }

    updateUndoButton() {
        if (this.dom.undoBtn) {
            this.dom.undoBtn.disabled = this.stateManager.history.length === 0;
        }
    }

    syncUIToState() {
        this.isUpdatingUI = true;

        if (this.dom.bgTypeSelect) this.dom.bgTypeSelect.value = this.state.bgType;
        if (this.dom.bgSolidOpacity) {
            this.dom.bgSolidOpacity.value = this.state.bgSolidOpacity;
            const rangeVal = this.dom.bgSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.bgSolidOpacity.toFixed(2);
        }

        if (this.dom.borderCheckbox) this.dom.borderCheckbox.checked = this.state.borderEnabled;
        if (this.dom.borderControls) this.dom.borderControls.style.display = this.state.borderEnabled ? "block" : "none";
        if (this.dom.borderStyleSelect) this.dom.borderStyleSelect.value = this.state.borderStyle;
        if (this.dom.borderWidthSlider) {
            this.dom.borderWidthSlider.value = this.state.borderWidth;
            const rangeVal = this.dom.borderWidthSlider.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.borderWidth}px`;
        }
        if (this.dom.borderOpacity) {
            this.dom.borderOpacity.value = this.state.borderOpacity;
            const rangeVal = this.dom.borderOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.borderOpacity.toFixed(2);
        }
        if (this.dom.radiusSlider) {
            this.dom.radiusSlider.value = this.state.borderRadius;
            const rangeVal = this.dom.radiusSlider.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.borderRadius}px`;
        }

        if (this.dom.progressRadius) {
            this.dom.progressRadius.value = this.state.progressRadius;
            const rangeVal = this.dom.progressRadius.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.progressRadius}px`;
        }
        if (this.dom.progTrackTypeSelect) this.dom.progTrackTypeSelect.value = this.state.progTrackType;
        if (this.dom.progTrackSolidOpacity) {
            this.dom.progTrackSolidOpacity.value = this.state.progTrackSolidOpacity;
            const rangeVal = this.dom.progTrackSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.progTrackSolidOpacity.toFixed(2);
        }
        if (this.dom.progFillTypeSelect) this.dom.progFillTypeSelect.value = this.state.progFillType;
        if (this.dom.progFillSolidOpacity) {
            this.dom.progFillSolidOpacity.value = this.state.progFillSolidOpacity;
            const rangeVal = this.dom.progFillSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.progFillSolidOpacity.toFixed(2);
        }

        if (this.dom.qrFrameSelect) this.dom.qrFrameSelect.value = this.state.qrFrame;

        if (this.dom.textShadowCheckbox) this.dom.textShadowCheckbox.checked = this.state.textShadowEnabled;
        if (this.dom.textShadowControls) this.dom.textShadowControls.style.display = this.state.textShadowEnabled ? "block" : "none";
        if (this.dom.textShadowX) {
            this.dom.textShadowX.value = this.state.textShadowX;
            const rangeVal = this.dom.textShadowX.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.textShadowX}px`;
        }
        if (this.dom.textShadowY) {
            this.dom.textShadowY.value = this.state.textShadowY;
            const rangeVal = this.dom.textShadowY.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.textShadowY}px`;
        }
        if (this.dom.textShadowBlur) {
            this.dom.textShadowBlur.value = this.state.textShadowBlur;
            const rangeVal = this.dom.textShadowBlur.nextElementSibling;
            if (rangeVal) rangeVal.textContent = `${this.state.textShadowBlur}px`;
        }

        this.togglePanel(this.state.bgType, this.dom.bgSolidPanel, this.dom.bgGradientPanel, this.bgGradientPicker);
        this.togglePanel(this.state.progTrackType, this.dom.progTrackSolidPanel, this.dom.progTrackGradientPanel, this.trackGradientPicker);
        this.togglePanel(this.state.progFillType, this.dom.progFillSolidPanel, this.dom.progFillGradientPanel, this.fillGradientPicker);

        if (this.pickrManager) {
            setPickrColorSilent(this.pickrManager.pickers.bgSolid, this.state.bgSolidColor);
            setPickrColorSilent(this.pickrManager.pickers.border, this.state.borderColor);
            setPickrColorSilent(this.pickrManager.pickers.progTrackSolid, this.state.progTrackSolidColor);
            setPickrColorSilent(this.pickrManager.pickers.progFillSolid, this.state.progFillSolidColor);
            setPickrColorSilent(this.pickrManager.pickers.textColor, this.state.textColor);
            setPickrColorSilent(this.pickrManager.pickers.textShadowColor, this.state.textShadowColor);
        }

        // Sync Gradient Pickers explicitly if stops changed (e.g. undo or randomize)
        // Pass 'true' to silent mode to avoid triggering onChange -> state update -> updateAll recursion
        if (this.bgGradientPicker && this.state.bgGradientStops) {
            this.bgGradientPicker.setStops(this.state.bgGradientStops, this.state.bgGradientAngle, true);
        }
        if (this.trackGradientPicker && this.state.progTrackGradientStops) {
            this.trackGradientPicker.setStops(this.state.progTrackGradientStops, this.state.progTrackGradientAngle, true);
        }
        if (this.fillGradientPicker && this.state.progFillGradientStops) {
            this.fillGradientPicker.setStops(this.state.progFillGradientStops, this.state.progFillGradientAngle, true);
        }

        this.isUpdatingUI = false;
    }

    randomize() {
        this.stateManager.randomize();
        // No need to manually sync pickers here, as StateManager.randomize() triggers onStateChange,
        // which calls syncUIToState(), which updates pickers silently.
    }

    shareState() {
        // Create delta: only include values that differ from default
        const delta = {};

        for (const key in this.state) {
            const currentValue = this.state[key];
            const defaultValue = this.defaultState[key];

            // Deep comparison for arrays and objects
            if (JSON.stringify(currentValue) !== JSON.stringify(defaultValue)) {
                delta[key] = currentValue;
            }
        }

        const encoded = encodeWidgetState(delta);
        if (!encoded) return;

        const url = new URL(window.location.href);
        url.searchParams.set('state', encoded);

        // Copy to clipboard
        navigator.clipboard.writeText(url.toString()).then(() => {
            if (!this.dom.shareBtn) return;

            // Save original HTML
            const originalHTML = this.dom.shareBtn.innerHTML;

            // Replace icon with checkmark
            this.dom.shareBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;

            // Animate background to green with scale effect
            this.dom.shareBtn.style.background = "#4ade80";
            this.dom.shareBtn.style.transform = "scale(1.1)";
            this.dom.shareBtn.style.transition = "all 0.2s ease";

            setTimeout(() => {
                this.dom.shareBtn.innerHTML = originalHTML;
                this.dom.shareBtn.style.background = "#febc2e";
                this.dom.shareBtn.style.transform = "";
            }, 1500);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert("Failed to copy link. Check console.");
        });
    }
}
