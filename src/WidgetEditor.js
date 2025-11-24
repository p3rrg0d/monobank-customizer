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
            borderEnabled: false,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#000000",
            borderOpacity: 0,
            borderRadius: 16,

            // 3. Progress
            progressRadius: 12,

            // 3.1 Progress Track (Підкладка)
            progTrackType: "gradient",  // Змінили з solid на gradient
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

        // Закешуємо елементі (за ID)
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

        // Встановлюємо початкові панелі відповідно до state
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
                        hex: true,   // Увімкнули hex input назад
                        rgba: false,
                        input: true, // Увімкнули input для hex
                        save: false, // Кнопка Save залишається вимкненою
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

            // Оновлюємо в реальному часі при зміні кольору
            pickr.on("change", (color) => {
                if (color) {
                    const hexColor = color.toHEXA().toString();

                    // Викликаємо onChange для оновлення state
                    onChange(hexColor);

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
            "rgba(255, 255, 255, 0)", // Start with transparent to show checkerboard
            (color) => {
                // Check if color is transparent (alpha = 0)
                const rgba = this.pickrPreviewBg.getColor().toRGBA();
                if (rgba[3] === 0) {
                    // If transparent, clear the inline style to show CSS checkerboard
                    this.dom.previewBox.style.background = "";
                } else {
                    // Otherwise set the color normally
                    this.dom.previewBox.style.background = color;
                }
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
        this.dom.borderCheckbox.addEventListener("change", (e) => {
            this.state.borderEnabled = e.target.checked;
            this.dom.borderControls.style.display = e.target.checked ? "block" : "none";
            if (!e.target.checked) {
                this.state.borderOpacity = 0;
            } else {
                this.state.borderOpacity = 1;
                this.dom.borderOpacity.value = 1;
            }
            this.updateAll();
        });

        this.dom.borderStyleSelect.addEventListener("change", (e) => {
            this.state.borderStyle = e.target.value;
            this.updateAll();
        });

        this.dom.borderWidthSlider.addEventListener("input", (e) => {
            this.state.borderWidth = parseInt(e.target.value);
            this.updateAll();
        });

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

        // === PREVIEW PROGRESS ===
        if (this.dom.previewProgressSlider) {
            this.dom.previewProgressSlider.addEventListener("input", (e) => {
                const val = e.target.value;
                const rangeValue = e.target.nextElementSibling;
                if (rangeValue) rangeValue.textContent = `${val}₴`;

                // Update widget progress
                if (this.dom.widget && this.dom.widget.shadowRoot) {
                    const progressBar = this.dom.widget.shadowRoot.querySelector('.progress');
                    const textBalance = this.dom.widget.shadowRoot.querySelector('.text-balance');
                    const textName = this.dom.widget.shadowRoot.querySelector('.text-name');

                    if (progressBar) progressBar.style.setProperty('--progress', `${val}%`);
                    if (textBalance) textBalance.textContent = `${val}₴`;
                    if (textName) textName.textContent = `${val}₴, ${val}%`;
                }
            });
        }

        // Reset Background Button
        const resetBgBtn = document.getElementById("reset-bg-btn");
        if (resetBgBtn) {
            resetBgBtn.addEventListener("click", () => {
                const previewArea = document.querySelector(".widget-preview");
                if (previewArea) {
                    // Clear inline style to revert to CSS default (checkerboard)
                    previewArea.style.background = "";
                }

                // Reset the Pickr color picker to transparent WITHOUT triggering change event
                // We need to prevent it from re-applying the background
                if (this.pickrPreviewBg) {
                    // Temporarily store the current color
                    const currentColor = this.pickrPreviewBg.getColor();

                    // Set to transparent - this will trigger the change event
                    // but we already cleared the inline style above
                    this.pickrPreviewBg.setColor("rgba(255, 255, 255, 0)", true);
                }
            });
        }
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
        const border = `${this.state.borderWidth}px ${this.state.borderStyle} ${hexToRgba(this.state.borderColor, this.state.borderOpacity)}`;

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
            s.setProperty("--widget-border-width", this.state.borderWidth + "px");
            s.setProperty("--widget-border-style", this.state.borderStyle);
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
                      <!-- Image Carousel -->
                      <div style="position: relative; margin: 20px 0;">
                          <div class="screenshot-carousel">
                              <img src="static/tutorial1.jpg" class="carousel-image active" data-step="0" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: block;" />
                              <img src="static/tutorial2.jpg" class="carousel-image" data-step="1" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: none;" />
                              <img src="static/tutorial3.jpg" class="carousel-image" data-step="2" style="width: 100%; border-radius: 8px; border: 2px solid #000; display: none;" />
                          </div>
                          
                          <!-- Navigation Buttons -->
                          <button class="carousel-btn carousel-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: 2px solid #000; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px; font-weight: bold;">‹</button>
                          <button class="carousel-btn carousel-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.7); color: white; border: 2px solid #000; border-radius: 50%; width: 40px; height: 40px; cursor: pointer; font-size: 20px; font-weight: bold;">›</button>
                          
                          <!-- Step Indicators -->
                          <div style="text-align: center; margin-top: 10px;">
                              <span class="step-indicator active" data-step="0" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ff5f57; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                              <span class="step-indicator" data-step="1" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                              <span class="step-indicator" data-step="2" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin: 0 5px; cursor: pointer; border: 2px solid #000;"></span>
                          </div>
                      </div>
                      
                      <p><strong>1. Відкрийте браузер віджета monobank:</strong></p>
                      <p style="margin-left: 20px;">Перейдіть за посиланням для отримання віджета на сайті monobank та скопіюйте URL віджета.</p>
                      
                      <p><strong>2. Додайте Browser Source в OBS:</strong></p>
                      <p style="margin-left: 20px;">• Клікніть правою кнопкою на "Sources" (Джерела)<br>
                      • Виберіть "Add" → "Browser"<br>
                      • Назвіть джерело (наприклад, "Monobank Widget")</p>
                      
                      <p><strong>3. Налаштуйте Browser Source:</strong></p>
                      <p style="margin-left: 20px;">• <b>URL:</b> вставте посилання на ваш віджет<br>
                      • <b>Width:</b> 380<br>
                      • <b>Height:</b> 136<br>
                      • Увімкніть "Shutdown source when not visible"</p>
                      
                      <p><strong>4. Додайте кастомний CSS:</strong></p>
                      <p style="margin-left: 20px;">• Скопіюйте згенерований CSS код нижче<br>
                      • Вставте його в поле "Custom CSS" в налаштуваннях Browser Source</p>
                      
                      <p style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 12px;">
                      <b>Порада:</b> Для прозорого фону віджета встановіть прозорість фону в налаштуваннях віджета.</p>
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

        // Carousel functionality
        let currentStep = 0;
        const images = modal.querySelectorAll(".carousel-image");
        const indicators = modal.querySelectorAll(".step-indicator");
        const prevBtn = modal.querySelector(".carousel-prev");
        const nextBtn = modal.querySelector(".carousel-next");

        const showStep = (step) => {
            images.forEach((img, i) => {
                img.style.display = i === step ? "block" : "none";
                img.classList.toggle("active", i === step);
            });
            indicators.forEach((ind, i) => {
                ind.style.background = i === step ? "#ff5f57" : "#ccc";
                ind.classList.toggle("active", i === step);
            });
            currentStep = step;
        };

        prevBtn.addEventListener("click", () => {
            const newStep = (currentStep - 1 + images.length) % images.length;
            showStep(newStep);
        });

        nextBtn.addEventListener("click", () => {
            const newStep = (currentStep + 1) % images.length;
            showStep(newStep);
        });

        indicators.forEach((indicator) => {
            indicator.addEventListener("click", () => {
                const step = parseInt(indicator.dataset.step);
                showStep(step);
            });
        });
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
