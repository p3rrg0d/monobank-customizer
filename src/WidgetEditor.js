import { hexToRgba } from './utils.js';
import { GradientPicker } from './GradientPicker.js';
import { PickrManager } from './PickrManager.js';
import { bindAllEvents } from './EventHandlers.js';
import { ModalManager } from './ModalManager.js';
import { generateWidgetCSS, getBackgroundCSS, CSSExporter, getQRFrameSVG } from './CSSGenerator.js';

// ================= MAIN CLASS =================
export class WidgetEditor {
    constructor() {
        this.state = {
            // 1. Widget BG
            bgType: "solid",
            bgSolidColor: "#000000",
            bgSolidOpacity: 1,
            bgGradientString: "",

            // 2. Border
            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 0, // Start with no border
            borderColor: "#000000",
            borderOpacity: 0,
            borderRadius: 16,

            // 3. Progress
            progressRadius: 12,

            // 3.1 Progress Track (Підкладка)
            progTrackType: "gradient",
            progTrackSolidColor: "#e7b5d3",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",

            // 3.2 Progress Fill (Активна)
            progFillType: "gradient",
            progFillSolidColor: "#b93e88",
            progFillSolidOpacity: 1,
            progFillGradientString: "",

            textColor: "#ffffff",

            // 4. Text
            textShadowEnabled: false,
            textShadowColor: "#ff0000",
            textShadowOpacity: 1,
            textShadowX: 0,
            textShadowY: 2,
            textShadowBlur: 0,

            // 5. QR Frame
            qrFrame: "standard",
        };

        // History for undo (max 20 states)
        this.history = [];
        this.maxHistoryLength = 20;

        // Cache DOM elements
        this.dom = {
            widget: document.querySelector("my-widget"),
            cssExport: document.querySelector(".css-export"),
            previewBox: document.querySelector(".widget-preview"),
            previewBgPicker: document.getElementById("preview-bg-picker"),
            previewProgressSlider: document.getElementById("preview-progress-slider"),

            // Widget BG Controls
            bgTypeSelect: document.getElementById("bg-type-select"),
            bgSolidPanel: document.getElementById("bg-solid-controls"),
            bgGradientPanel: document.getElementById("bg-gradient-controls"),
            bgSolidPicker: document.getElementById("bg-solid-picker"),
            bgSolidOpacity: document.getElementById("bg-solid-opacity"),

            // Border
            borderCheckbox: document.getElementById("border-enabled"),
            borderControls: document.getElementById("border-controls"),
            borderStyleSelect: document.getElementById("border-style-select"),
            borderWidthSlider: document.getElementById("border-width-slider"),
            borderPicker: document.getElementById("border-color-picker"),
            borderOpacity: document.getElementById("border-opacity"),
            radiusSlider: document.getElementById("border-radius-slider"),

            // Progress Controls
            progressRadius: document.getElementById("progress-radius-slider"),

            // Track Controls
            progTrackTypeSelect: document.getElementById("prog-track-type-select"),
            progTrackSolidPanel: document.getElementById("prog-track-solid-controls"),
            progTrackGradientPanel: document.getElementById("prog-track-gradient-controls"),
            progTrackSolidPicker: document.getElementById("prog-track-solid-picker"),
            progTrackSolidOpacity: document.getElementById("prog-track-solid-opacity"),

            // Fill Controls
            progFillTypeSelect: document.getElementById("prog-fill-type-select"),
            progFillSolidPanel: document.getElementById("prog-fill-solid-controls"),
            progFillGradientPanel: document.getElementById("prog-fill-gradient-controls"),
            progFillSolidPicker: document.getElementById("prog-fill-solid-picker"),
            progFillSolidOpacity: document.getElementById("prog-fill-solid-opacity"),

            // QR Frame Controls
            qrFrameSelect: document.getElementById("qr-frame-select"),

            // Text Controls
            textColorPicker: document.getElementById("text-color-picker"),
            textShadowCheckbox: document.getElementById("text-shadow-enabled"),
            textShadowControls: document.getElementById("text-shadow-controls"),
            textShadowColorPicker: document.getElementById("text-shadow-color-picker"),
            textShadowX: document.getElementById("text-shadow-x"),
            textShadowY: document.getElementById("text-shadow-y"),
            textShadowBlur: document.getElementById("text-shadow-blur"),

            // Action buttons
            randomizeBtn: document.getElementById("randomize-btn"),
            undoBtn: document.getElementById("undo-btn"),
        };

        this.init();
    }

    init() {
        // Initialize gradient pickers
        this.initGradientPickers();

        // Initialize Pickr color pickers using PickrManager
        this.pickrManager = new PickrManager(this);
        this.pickrManager.initializeAll();

        // Bind all events using EventHandlers
        bindAllEvents(this);

        // Set initial panel states
        this.setInitialPanelStates();

        // Initialize draggable widget
        this.initDraggable();

        // Create help modal using ModalManager
        this.modalManager = new ModalManager();
        this.modalManager.create();

        // Initialize CSS exporter
        this.cssExporter = new CSSExporter(this.dom.cssExport);

        // Initial update
        this.updateAll();
    }

    /**
     * Initialize gradient pickers
     */
    initGradientPickers() {
        this.bgGradientPicker = new GradientPicker("bg-gradient-picker", {
            initialStops: [
                { id: 1, color: "#000000", opacity: 1, position: 0 },
                { id: 2, color: "#444444", opacity: 0.8, position: 100 },
            ],
            onChange: (css) => {
                this.state.bgGradientString = css;
                this.updateAll();
            },
        });

        this.trackGradientPicker = new GradientPicker("prog-track-gradient-picker", {
            initialStops: [
                { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
                { id: 2, color: "#eac6bb", opacity: 1, position: 100 },
            ],
            onChange: (css) => {
                this.state.progTrackGradientString = css;
                this.updateAll();
            },
        });

        this.fillGradientPicker = new GradientPicker("prog-fill-gradient-picker", {
            initialStops: [
                { id: 1, color: "#b93e88", opacity: 1, position: 0 },
                { id: 2, color: "#fca78c", opacity: 1, position: 100 },
            ],
            onChange: (css) => {
                this.state.progFillGradientString = css;
                this.updateAll();
            },
        });
    }

    /**
     * Set initial panel states based on state
     */
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

    /**
     * Initialize draggable widget functionality
     */
    initDraggable() {
        const widget = this.dom.widget;
        const container = this.dom.previewBox;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        widget.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = widget.offsetLeft;
            initialTop = widget.offsetTop;
            widget.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // Get container and widget dimensions
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const widgetWidth = widget.offsetWidth;
            const widgetHeight = widget.offsetHeight;

            // Calculate boundaries (widget is centered with transform: translate(-50%, -50%))
            const halfWidth = widgetWidth / 2;
            const halfHeight = widgetHeight / 2;

            const minLeft = halfWidth;
            const maxLeft = containerWidth - halfWidth;
            const minTop = halfHeight;
            const maxTop = containerHeight - halfHeight;

            // Clamp to boundaries
            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));

            widget.style.left = `${newLeft}px`;
            widget.style.top = `${newTop}px`;
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = "grab";
            }
        });

        document.addEventListener("mouseleave", () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = "grab";
            }
        });
    }

    /**
     * Toggle panel visibility based on type
     */
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

    /**
     * Update all widget styles and CSS export
     */
    updateAll() {
        if (this.dom.widget) {
            const s = this.dom.widget.style;

            // Widget background
            const bg = getBackgroundCSS(
                this.state.bgType,
                this.state.bgSolidColor,
                this.state.bgSolidOpacity,
                this.state.bgGradientString
            );
            s.setProperty("--widget-bg-color", bg);

            // Border
            const borderCol = hexToRgba(this.state.borderColor, this.state.borderOpacity);
            s.setProperty("--widget-border-color", borderCol);
            s.setProperty("--widget-border-width", this.state.borderWidth + "px");
            s.setProperty("--widget-border-style", this.state.borderStyle);
            s.setProperty("--widget-border-radius", this.state.borderRadius + "px");

            // Progress
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
            s.setProperty("--progress-gradient", fillBg);

            // QR Frame
            s.setProperty("--qr-frame-bg", getQRFrameSVG(this.state.qrFrame));

            // QR Frame sizing (для frame2 - кастомні розміри)
            if (this.state.qrFrame === 'frame2') {
                s.setProperty("--qr-container-width", "180px");
                s.setProperty("--qr-container-pos-x", "-20.1px");
                s.setProperty("--qr-container-pos-y", "-19.5px");
                s.setProperty("--qr-width", "50%");
                s.setProperty("--qr-top", "17px");
                s.setProperty("--qr-left", "13.4%");
                s.setProperty("--qr-position", "relative");
            } else {
                // Дефолтні значення для standard/frame1
                s.setProperty("--qr-container-width", "145px");
                s.setProperty("--qr-container-pos-x", "-5px");
                s.setProperty("--qr-container-pos-y", "0px");
                s.setProperty("--qr-width", "45%");
                s.setProperty("--qr-top", "23%");
                s.setProperty("--qr-left", "26.5%");
                s.setProperty("--qr-position", "absolute");
            }

            // Text styles
            s.setProperty("--widget-text-color", this.state.textColor);
            const textShadow = this.state.textShadowEnabled
                ? `${this.state.textShadowX}px ${this.state.textShadowY}px ${this.state.textShadowBlur}px ${hexToRgba(this.state.textShadowColor, this.state.textShadowOpacity)}`
                : 'none';
            s.setProperty("--widget-text-shadow", textShadow);
        }

        // Update CSS export
        if (this.cssExporter) {
            const css = generateWidgetCSS(this.state);
            this.cssExporter.updateCSS(css);
        }
    }

    /**
     * Save current state to history (for undo)
     */
    saveState() {
        const stateCopy = JSON.parse(JSON.stringify(this.state));
        this.history.push(stateCopy);
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
        this.updateUndoButton();
    }

    /**
     * Undo last change
     */
    undo() {
        if (this.history.length === 0) return;
        const previousState = this.history.pop();
        this.state = previousState;
        this.syncUIToState();
        this.updateAll();
        this.updateUndoButton();
    }

    /**
     * Update undo button enabled/disabled state
     */
    updateUndoButton() {
        if (this.dom.undoBtn) {
            this.dom.undoBtn.disabled = this.history.length === 0;
        }
    }

    /**
     * Sync UI controls to current state
     */
    syncUIToState() {
        if (this.dom.bgTypeSelect) this.dom.bgTypeSelect.value = this.state.bgType;
        if (this.dom.bgSolidOpacity) {
            this.dom.bgSolidOpacity.value = this.state.bgSolidOpacity;
            const rangeVal = this.dom.bgSolidOpacity.nextElementSibling;
            if (rangeVal) rangeVal.textContent = this.state.bgSolidOpacity.toFixed(2);
        }
        if (this.dom.borderCheckbox) this.dom.borderCheckbox.checked = this.state.borderEnabled;
        if (this.dom.borderControls) this.dom.borderControls.style.display = this.state.borderEnabled ? "block" : "none";
        if (this.dom.borderStyleSelect) this.dom.borderStyleSelect.value = this.state.borderStyle;
        if (this.dom.borderWidthSlider) this.dom.borderWidthSlider.value = this.state.borderWidth;
        if (this.dom.borderOpacity) this.dom.borderOpacity.value = this.state.borderOpacity;
        if (this.dom.radiusSlider) this.dom.radiusSlider.value = this.state.borderRadius;
        if (this.dom.progressRadius) this.dom.progressRadius.value = this.state.progressRadius;
        if (this.dom.progTrackTypeSelect) this.dom.progTrackTypeSelect.value = this.state.progTrackType;
        if (this.dom.progFillTypeSelect) this.dom.progFillTypeSelect.value = this.state.progFillType;
        if (this.dom.qrFrameSelect) this.dom.qrFrameSelect.value = this.state.qrFrame;

        // Text controls
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
            if (this.pickrManager.pickers.bgSolid) this.pickrManager.pickers.bgSolid.setColor(this.state.bgSolidColor, true);
            if (this.pickrManager.pickers.borderColor) this.pickrManager.pickers.borderColor.setColor(this.state.borderColor, true);
            if (this.pickrManager.pickers.progTrackSolid) this.pickrManager.pickers.progTrackSolid.setColor(this.state.progTrackSolidColor, true);
            if (this.pickrManager.pickers.progFillSolid) this.pickrManager.pickers.progFillSolid.setColor(this.state.progFillSolidColor, true);
            if (this.pickrManager.pickers.textColor) this.pickrManager.pickers.textColor.setColor(this.state.textColor, true);
            if (this.pickrManager.pickers.textShadowColor) this.pickrManager.pickers.textShadowColor.setColor(this.state.textShadowColor, true);
        }
    }

    /**
     * Randomize widget settings
     */
    randomize() {
        this.saveState();
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomFloat = (min, max) => Math.random() * (max - min) + min;
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomGradientData = () => {
            const angle = randomInt(0, 360);
            const numStops = randomInt(2, 4);
            const stops = [];
            for (let i = 0; i < numStops; i++) {
                stops.push({ color: randomColor(), opacity: 1, position: Math.round((i / (numStops - 1)) * 100) });
            }
            return { stops, angle };
        };

        if (Math.random() > 0.5) {
            this.state.bgType = "solid";
            this.state.bgSolidColor = randomColor();
            this.state.bgSolidOpacity = randomFloat(0.7, 1);
        } else {
            this.state.bgType = "gradient";
            const gradData = randomGradientData();
            if (this.bgGradientPicker) this.bgGradientPicker.setStops(gradData.stops, gradData.angle);
        }

        this.state.borderEnabled = Math.random() > 0.5;
        this.state.borderStyle = randomChoice(["solid", "dashed", "dotted", "double"]);
        this.state.borderWidth = this.state.borderEnabled ? randomInt(1, 5) : 0;
        this.state.borderColor = randomColor();
        this.state.borderOpacity = this.state.borderEnabled ? randomFloat(0.5, 1) : 0;
        this.state.borderRadius = randomInt(0, 40);
        this.state.progressRadius = randomInt(0, 16);

        if (Math.random() > 0.7) {
            this.state.progTrackType = "solid";
            this.state.progTrackSolidColor = randomColor();
            this.state.progTrackSolidOpacity = randomFloat(0.5, 1);
        } else {
            this.state.progTrackType = "gradient";
            const gradData = randomGradientData();
            if (this.trackGradientPicker) this.trackGradientPicker.setStops(gradData.stops, gradData.angle);
        }

        if (Math.random() > 0.7) {
            this.state.progFillType = "solid";
            this.state.progFillSolidColor = randomColor();
            this.state.progFillSolidOpacity = randomFloat(0.8, 1);
        } else {
            this.state.progFillType = "gradient";
            const gradData = randomGradientData();
            if (this.fillGradientPicker) this.fillGradientPicker.setStops(gradData.stops, gradData.angle);
        }

        this.state.qrFrame = randomChoice(["standard", "frame1", "frame2"]);

        // Randomize text settings
        this.state.textColor = randomColor();
        this.state.textShadowEnabled = Math.random() > 0.5;
        this.state.textShadowColor = randomColor();
        this.state.textShadowX = randomInt(-5, 5);
        this.state.textShadowY = randomInt(-5, 5);
        this.state.textShadowBlur = randomInt(0, 5);

        this.syncUIToState();
        this.updateAll();
    }
}
