import { hexToRgba } from './utils.js';
import { GradientPicker } from './GradientPicker.js';
import { PickrManager, setPickrColorSilent } from './PickrManager.js';
import { bindAllEvents } from './EventHandlers.js';
import { ModalManager } from './ModalManager.js';
import { generateWidgetCSS, getBackgroundCSS, CSSExporter, getQRFrameSVG } from './CSSGenerator.js';

export class WidgetEditor {
    constructor() {
        this.state = {
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

        this.history = [];
        this.maxHistoryLength = 20;
        this._preventSave = false;

        this.previewScale = 1.5;
        this.isCustomPositioned = false;

        this.dom = {
            widget: document.querySelector("my-widget"),
            cssExport: document.querySelector(".css-export"),
            previewBox: document.querySelector(".widget-preview"),
            previewBgPicker: document.getElementById("preview-bg-picker"),
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
        };

        this.init();
    }

    init() {
        this.initGradientPickers();

        this.pickrManager = new PickrManager(this);
        this.pickrManager.initializeAll();

        bindAllEvents(this);

        this.setInitialPanelStates();

        this.initDraggable();

        this.modalManager = new ModalManager();
        this.modalManager.create();

        this.cssExporter = new CSSExporter(this.dom.cssExport);

        this.updateAll();
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
                this.updateAll();
            },
            onSaveState: () => this.saveState(),
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

    initDraggable() {
        const widget = this.dom.widget;
        const container = this.dom.previewBox;

        let isDragging = false;
        let startX, startY;
        let startLeft, startTop;

        // Ensure initial scale is applied even before drag
        if (!this.isCustomPositioned) {
            widget.style.transform = `translate(-50%, -50%) scale(${this.previewScale})`;
        }

        const onMouseDown = (e) => {
            if (e.button !== 0) return;
            isDragging = true;

            startX = e.clientX;
            startY = e.clientY;

            // Temporarily disable transition
            widget.style.transition = 'none';

            if (!this.isCustomPositioned) {
                // Switch from center-based positioning to top-left based positioning
                // to make drag math simpler and prevent jumping.

                const rect = widget.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();

                // Calculate where the element currently is visually inside the container
                const visualLeft = rect.left - containerRect.left;
                const visualTop = rect.top - containerRect.top;

                // Freeze it there, but change origin to top-left (0 0)
                // so subsequent scale() expands right/down, which is easier to clamp.
                widget.style.transformOrigin = "0 0";
                widget.style.transform = `scale(${this.previewScale})`;
                widget.style.left = `${visualLeft}px`;
                widget.style.top = `${visualTop}px`;

                this.isCustomPositioned = true;

                // Force reflow
                void widget.offsetWidth;
            }

            startLeft = parseFloat(widget.style.left);
            startTop = parseFloat(widget.style.top);

            widget.style.cursor = "grabbing";

            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;

            // Visual width/height is the actual screen space taken
            const visualWidth = widget.getBoundingClientRect().width;
            const visualHeight = widget.getBoundingClientRect().height;

            // Clamp so the visual box never leaves the container
            const maxLeft = containerWidth - visualWidth;
            const maxTop = containerHeight - visualHeight;

            // Simple clamping
            if (maxLeft > 0) {
                newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            } else {
                newLeft = 0; // Or center it? User said "exactly size of container", implying containment
            }

            if (maxTop > 0) {
                newTop = Math.max(0, Math.min(newTop, maxTop));
            } else {
                newTop = 0;
            }

            widget.style.left = `${newLeft}px`;
            widget.style.top = `${newTop}px`;
        };

        const onMouseUp = () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = "grab";
                widget.style.transition = 'transform 0.1s ease-out';

                window.removeEventListener("mousemove", onMouseMove);
                window.removeEventListener("mouseup", onMouseUp);
            }
        };

        widget.addEventListener("mousedown", onMouseDown);
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
        if (this._preventSave) return;

        const stateCopy = JSON.parse(JSON.stringify(this.state));
        this.history.push(stateCopy);
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
        this.updateUndoButton();
    }

    undo() {
        if (this.history.length === 0) return;

        this._preventSave = true;

        const previousState = this.history.pop();
        this.state = previousState;
        this.syncUIToState();
        this.updateAll();
        this.updateUndoButton();

        this._preventSave = false;
    }

    updateUndoButton() {
        if (this.dom.undoBtn) {
            this.dom.undoBtn.disabled = this.history.length === 0;
        }
    }

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

        if (this.bgGradientPicker && this.state.bgGradientStops) {
            this.bgGradientPicker.setStops(this.state.bgGradientStops, this.state.bgGradientAngle);
        }
        if (this.trackGradientPicker && this.state.progTrackGradientStops) {
            this.trackGradientPicker.setStops(this.state.progTrackGradientStops, this.state.progTrackGradientAngle);
        }
        if (this.fillGradientPicker && this.state.progFillGradientStops) {
            this.fillGradientPicker.setStops(this.state.progFillGradientStops, this.state.progFillGradientAngle);
        }
    }

    randomize() {
        this.saveState();
        this._preventSave = true;

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
            this.state.bgGradientStops = gradData.stops;
            this.state.bgGradientAngle = gradData.angle;
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
            this.state.progTrackGradientStops = gradData.stops;
            this.state.progTrackGradientAngle = gradData.angle;
            if (this.trackGradientPicker) this.trackGradientPicker.setStops(gradData.stops, gradData.angle);
        }

        if (Math.random() > 0.7) {
            this.state.progFillType = "solid";
            this.state.progFillSolidColor = randomColor();
            this.state.progFillSolidOpacity = randomFloat(0.8, 1);
        } else {
            this.state.progFillType = "gradient";
            const gradData = randomGradientData();
            this.state.progFillGradientStops = gradData.stops;
            this.state.progFillGradientAngle = gradData.angle;
            if (this.fillGradientPicker) this.fillGradientPicker.setStops(gradData.stops, gradData.angle);
        }

        this.state.qrFrame = randomChoice(["standard", "frame1", "frame2", "frame3"]);

        this.state.textColor = randomColor();
        this.state.textShadowEnabled = Math.random() > 0.5;
        this.state.textShadowColor = randomColor();
        this.state.textShadowX = randomInt(-5, 5);
        this.state.textShadowY = randomInt(-5, 5);
        this.state.textShadowBlur = randomInt(0, 5);

        this.syncUIToState();
        this.updateAll();

        this._preventSave = false;
    }
}
