import { hexToRgba } from './utils.js';
import { GradientPicker } from './GradientPicker.js';
import { PickrManager } from './PickrManager.js';
import { bindAllEvents } from './EventHandlers.js';
import { ModalManager } from './ModalManager.js';
import { generateWidgetCSS, getBackgroundCSS, CSSExporter } from './CSSGenerator.js';

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
            
            // 
        };

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
        }

        // Update CSS export
        if (this.cssExporter) {
            const css = generateWidgetCSS(this.state);
            this.cssExporter.updateCSS(css);
        }
    }
}
