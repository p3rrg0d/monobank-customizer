import { hexToRgba } from './utils.js';
import { GradientPicker } from './GradientPicker.js';

// Copy entire WidgetEditor class from editor.js starting from line 272
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
            borderColor: "#000000",
            borderOpacity: 0,
            borderRadius: 16,

            // 3. Progress
            progressRadius: 12,

            // 3.1 Progress Track (Підкл адка)
            progTrackType: "solid",
            progTrackSolidColor: "#e7b5d3",
            progTrackSolidOpacity: 1,
            progTrackGradientString: "",

            // 3.2 Progress Fill (Активна)
            progFillType: "gradient",
            progFillSolidColor: "#b93e88",
            progFillSolidOpacity: 1,
            progFillGradientString: "",

            textColor: "#ffffff",
        };

        // Закешуємо елементи (за ID)
        this.dom = {
            widget: document.querySelector("my-widget"),
            cssExport: document.querySelector(".css-export"),
            previewBox: document.querySelector(".widget-preview"),
            previewBgPicker: document.getElementById("preview-bg-picker"),

            // Widget BG Controls
            bgTypeSelect: document.getElementById("bg-type-select"),
            bgSolidPanel: document.getElementById("bg-solid-controls"),
            bgGradientPanel: document.getElementById("bg-gradient-controls"),
            bgSolidPicker: document.getElementById("bg-solid-picker"),
            bgSolidOpacity: document.getElementById("bg-solid-opacity"),

            // Border
            borderPicker: document.getElementById("border-color-picker"),
            borderOpacity: document.getElementById("border-opacity"),
            radiusSlider: document.getElementById("border-radius-slider"),

            // Progress Controls
            progressRadius: document.getElementById("progress-radius-slider"),

            // Track Controls
            progTrackTypeSelect: document.getElementById("prog-track-type-select"),
            progTrackSolidPanel: document.getElementById("prog-track-solid-controls"),
            progTrackGradientPanel: document.getElementById(
                "prog-track-gradient-controls",
            ),
            progTrackSolidPicker: document.getElementById("prog-track-solid-picker"),
            progTrackSolidOpacity: document.getElementById(
                "prog-track-solid-opacity",
            ),

            // Fill Controls
            progFillTypeSelect: document.getElementById("prog-fill-type-select"),
            progFillSolidPanel: document.getElementById("prog-fill-solid-controls"),
            progFillGradientPanel: document.getElementById(
                "prog-fill-gradient-controls",
            ),
            progFillSolidPicker: document.getElementById("prog-fill-solid-picker"),
            progFillSolidOpacity: document.getElementById("prog-fill-solid-opacity"),
        };

        this.init();
    }

    init() {
        // 1. Ініціалізація трьох пікерів градієнта
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

        this.trackGradientPicker = new GradientPicker(
            "prog-track-gradient-picker",
            {
                initialStops: [
                    { id: 1, color: "#e7b5d3", opacity: 1, position: 0 },
                    { id: 2, color: "#eac6bb", opacity: 1, position: 100 },
                ],
                onChange: (css) => {
                    this.state.progTrackGradientString = css;
                    this.updateAll();
                },
            },
        );

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

        this.initPickrColorPickers();
        this.bindEvents();
        this.initDraggable();
        this.createModal();
        this.updateAll();
    }

    // --- ІНІЦІАЛІЗАЦІЯ PICKR COLOR PICKERS ---
    initPickrColorPickers() {
        // Helper function to create Pickr instance
        const createPickr = (el, defaultColor, onChange) => {
            const pickr = Pickr.create({
                el: el,
                theme: "nano",
                default: defaultColor,
                useAsButton: false, // ВАЖЛИВО: false щоб показувати колір!
                comparison: false,

                components: {
                    preview: true,
                    opacity: false,
                    hue: true,

                    interaction: {
                        hex: true,
                        rgba: false,
                        input: true,
                        save: true,
                        clear: false,
                    },
                },
            });

            // ПРИМУСОВО встановлюємо колір на кнопку після ініціалізації
            pickr.on("init", () => {
                const button = el.querySelector(".pcr-button");
                if (button) {
                    button.style.backgroundColor = defaultColor;
                    button.style.color = defaultColor;
                }
            });

            pickr.on("save", (color) => {
                if (color) {
                    const hexColor = color.toHEXA().toString();
                    onChange(hexColor);

                    // Оновлюємо колір кнопки
                    const button = el.querySelector(".pcr-button");
                    if (button) {
                        button.style.backgroundColor = hexColor;
                        button.style.color = hexColor;
                    }

                    pickr.hide();
                }
            });

            pickr.on("change", (color) => {
                if (color) {
                    const hexColor = color.toHEXA().toString();

                    // Оновлюємо колір кнопки в реальному часі
                    const button = el.querySelector(".pcr-button");
                    if (button) {
                        button.style.backgroundColor = hexColor;
                        button.style.color = hexColor;
                    }
                }
            });

            return pickr;
        };

        // Preview BG
        this.pickrPreviewBg = createPickr(
            this.dom.previewBgPicker,
            "#ffffff",
            (color) => {
                this.dom.previewBox.style.background = color;
            },
        );

        // Widget BG Solid
        this.pickrBgSolid = createPickr(
            this.dom.bgSolidPicker,
            this.state.bgSolidColor,
            (color) => {
                this.state.bgSolidColor = color;
                this.updateAll();
            },
        );

        // Border Color
        this.pickrBorder = createPickr(
            this.dom.borderPicker,
            this.state.borderColor,
            (color) => {
                this.state.borderColor = color;
                this.updateAll();
            },
        );

        // Progress Track Solid
        this.pickrProgTrackSolid = createPickr(
            this.dom.progTrackSolidPicker,
            this.state.progTrackSolidColor,
            (color) => {
                this.state.progTrackSolidColor = color;
                this.updateAll();
            },
        );

        // Progress Fill Solid
        this.pickrProgFillSolid = createPickr(
            this.dom.progFillSolidPicker,
            this.state.progFillSolidColor,
            (color) => {
                this.state.progFillSolidColor = color;
                this.updateAll();
            },
        );
    }

    // --- ЛОГІКА DRAGGABLE З ОБМЕЖЕННЯМИ ---
    initDraggable() {
        const widget = this.dom.widget;
        const container = this.dom.previewBox;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        widget.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;

            // Отримуємо поточні координати left/top без px
            // Використовуємо offsetLeft/Top щоб отримати пікселі, навіть якщо задано у %
            initialLeft = widget.offsetLeft;
            initialTop = widget.offsetTop;

            widget.style.cursor = "grabbing";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            e.preventDefault();

            // 1. На скільки змістилася мишка
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            // 2. Нові координати
            let newLeft = initialLeft + dx;
            let newTop = initialTop + dy;

            // 3. Розміри контейнера і віджета
            const containerWidth = container.clientWidth;
            const containerHeight = container.clientHeight;
            const widgetWidth = widget.offsetWidth;
            const widgetHeight = widget.offsetHeight;

            // 4. ОБМЕЖЕННЯ (CLAMP)
            // Віджет центрований через transform: translate(-50%, -50%)
            // Тому left/top - це координати центру віджета

            const halfWidth = widgetWidth / 2;
            const halfHeight = widgetHeight / 2;

            const minLeft = halfWidth;
            const maxLeft = containerWidth - halfWidth;
            const minTop = halfHeight;
            const maxTop = containerHeight - halfHeight;

            newLeft = Math.max(minLeft, Math.min(newLeft, maxLeft));
            newTop = Math.max(minTop, Math.min(newTop, maxTop));

            // 5. Застосовуємо
            widget.style.left = `${newLeft}px`;
            widget.style.top = `${newTop}px`;
        });

        document.addEventListener("mouseup", () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = "grab";
            }
        });

        // Додатково: якщо мишка вилетіла за межі вікна браузера
        document.addEventListener("mouseleave", () => {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = "grab";
            }
        });
    }

    bindEvents() {
        // === WIDGET BG ===
        this.dom.bgTypeSelect.addEventListener("change", (e) => {
            this.state.bgType = e.target.value;
            this.togglePanel(
                this.state.bgType,
                this.dom.bgSolidPanel,
                this.dom.bgGradientPanel,
                this.bgGradientPicker,
            );
            this.updateAll();
        });

        this.dom.bgSolidOpacity.addEventListener("input", (e) => {
            this.state.bgSolidOpacity = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent =
                this.state.bgSolidOpacity.toFixed(2);
            this.updateAll();
        });

        // === BORDER ===
        this.dom.borderOpacity.addEventListener("input", (e) => {
            this.state.borderOpacity = parseFloat(e.target.value);
            this.updateAll();
        });
        this.dom.radiusSlider.addEventListener("input", (e) => {
            this.state.borderRadius = parseInt(e.target.value);
            this.updateAll();
        });

        // === PROGRESS COMMON ===
        this.dom.progressRadius.addEventListener("input", (e) => {
            this.state.progressRadius = parseInt(e.target.value);
            this.updateAll();
        });

        // === PROGRESS TRACK ===
        this.dom.progTrackTypeSelect.addEventListener("change", (e) => {
            this.state.progTrackType = e.target.value;
            this.togglePanel(
                this.state.progTrackType,
                this.dom.progTrackSolidPanel,
                this.dom.progTrackGradientPanel,
                this.trackGradientPicker,
            );
            this.updateAll();
        });

        this.dom.progTrackSolidOpacity.addEventListener("input", (e) => {
            this.state.progTrackSolidOpacity = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent =
                this.state.progTrackSolidOpacity.toFixed(2);
            this.updateAll();
        });

        // === PROGRESS FILL ===
        this.dom.progFillTypeSelect.addEventListener("change", (e) => {
            this.state.progFillType = e.target.value;
            this.togglePanel(
                this.state.progFillType,
                this.dom.progFillSolidPanel,
                this.dom.progFillGradientPanel,
                this.fillGradientPicker,
            );
            this.updateAll();
        });

        this.dom.progFillSolidOpacity.addEventListener("input", (e) => {
            this.state.progFillSolidOpacity = parseFloat(e.target.value);
            e.target.nextElementSibling.textContent =
                this.state.progFillSolidOpacity.toFixed(2);
            this.updateAll();
        });
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

    // --- GENERATORS ---
    getBackgroundCSS(type, solidColor, solidOpacity, gradString) {
        if (type === "solid") {
            return hexToRgba(solidColor, solidOpacity);
        }
        return gradString;
    }

    generateCustomCSS() {
        const bg = this.getBackgroundCSS(
            this.state.bgType,
            this.state.bgSolidColor,
            this.state.bgSolidOpacity,
            this.state.bgGradientString,
        );
        const border = `1px solid ${hexToRgba(this.state.borderColor, this.state.borderOpacity)}`;

        const trackBg = this.getBackgroundCSS(
            this.state.progTrackType,
            this.state.progTrackSolidColor,
            this.state.progTrackSolidOpacity,
            this.state.progTrackGradientString,
        );
        const fillBg = this.getBackgroundCSS(
            this.state.progFillType,
            this.state.progFillSolidColor,
            this.state.progFillSolidOpacity,
            this.state.progFillGradientString,
        );

        return `
.widget.qr-with-progress-widget.color-scheme-black {
    border-radius: ${this.state.borderRadius}px;
    background: ${bg};
    border: ${border};
    color: ${this.state.textColor};
}

/* Радіуси */
.linear-horizontal-progress-widget.shape-scheme-rounded .background,
.linear-horizontal-progress-widget.shape-scheme-rounded .progress-clip,
.linear-horizontal-progress-widget.shape-scheme-rounded .progress {
    border-radius: ${this.state.progressRadius}px;
}

/* Фон підкладки */
.linear-horizontal-progress-widget .background {
    background: ${trackBg};
}

/* Активна смужка */
.linear-horizontal-progress-widget.color-scheme-pink .progress {
    background: ${fillBg};
}
        `.trim();
    }

    updateAll() {
        if (this.dom.widget) {
            const s = this.dom.widget.style;

            // Віджет
            const bg = this.getBackgroundCSS(
                this.state.bgType,
                this.state.bgSolidColor,
                this.state.bgSolidOpacity,
                this.state.bgGradientString,
            );
            s.setProperty("--widget-bg-color", bg);

            const borderCol = hexToRgba(
                this.state.borderColor,
                this.state.borderOpacity,
            );
            s.setProperty("--widget-border-color", borderCol);
            s.setProperty("--widget-border-radius", this.state.borderRadius + "px");

            // Прогрес
            s.setProperty("--progress-radius", this.state.progressRadius + "px");

            const trackBg = this.getBackgroundCSS(
                this.state.progTrackType,
                this.state.progTrackSolidColor,
                this.state.progTrackSolidOpacity,
                this.state.progTrackGradientString,
            );
            s.setProperty("--progress-bg-color", trackBg);

            const fillBg = this.getBackgroundCSS(
                this.state.progFillType,
                this.state.progFillSolidColor,
                this.state.progFillSolidOpacity,
                this.state.progFillGradientString,
            );
            s.setProperty("--progress-gradient", fillBg);
        }

        if (this.dom.cssExport) {
            this.updateCSSExport();
        }
    }

    createModal() {
        if (document.getElementById("globalHelpModal")) return;
        const modalHTML = `
              <div class="modal-overlay" id="modalOverlay"></div>
              <div class="help-modal" id="globalHelpModal">
                  <h3>
                      <span>Інструкція як додати в <b>OBS</b></span>
                  </h3>
                  <div class="help-content">
                      <p>1. <img src="static/tutorial1.jpg"/></p>
                      <p>2. <strong>Colors:</strong> Змінюйте кольори, градієнти та прозорість для всіх елементів.</p>
                      <p>3. <strong>Export:</strong> Скопіюйте CSS код та вставте його у налаштування віджета.</p>
                  </div>
                  <button class="copy-btn-wide" id="modalCloseBtn">Зрозуміло</button>
              </div>`;
        document.body.insertAdjacentHTML("beforeend", modalHTML);

        const overlay = document.getElementById("modalOverlay");
        const modal = document.getElementById("globalHelpModal");
        const closeBtn = document.getElementById("modalCloseBtn");
        const closeModal = () => {
            overlay.classList.remove("modal-open");
            modal.classList.remove("modal-open");
        };
        overlay.addEventListener("click", closeModal);
        closeBtn.addEventListener("click", closeModal);
    }

    updateCSSExport() {
        let codeBlock = this.dom.cssExport.querySelector("pre");
        if (!codeBlock) {
            this.dom.cssExport.innerHTML = `
                    <div class="code-title">
                        <span>CSS код</span>
                        <button class="btn red" id="helpBtn" style="width: 20px; height: 20px; font-weight: bold; display: flex; align-items: center; justify-content: center; font-size: 12px;">?</button>
                    </div>
                    <pre></pre>
                    <button class="copy-btn-wide" id="copyBtn">Скопіювати CSS код</button>
                `;
            codeBlock = this.dom.cssExport.querySelector("pre");
            const copyBtn = this.dom.cssExport.querySelector("#copyBtn");
            const helpBtn = this.dom.cssExport.querySelector("#helpBtn");

            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                    const originalText = copyBtn.textContent;
                    copyBtn.textContent = "Скопійовано!";
                    copyBtn.style.background = "var(--accent-secondary)";
                    copyBtn.style.color = "var(--text-main)";
                    setTimeout(() => {
                        copyBtn.textContent = originalText;
                        copyBtn.style.background = "";
                        copyBtn.style.color = "";
                    }, 2000);
                });
            });
            helpBtn.addEventListener("click", () => {
                document.getElementById("modalOverlay").classList.add("modal-open");
                document.getElementById("globalHelpModal").classList.add("modal-open");
            });
        }
        codeBlock.textContent = this.generateCustomCSS();
    }
}
