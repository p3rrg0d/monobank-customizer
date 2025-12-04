import { hexToRgba } from './utils.js';
import { CircularSlider } from './CircularSlider.js';

// ================= COMPONENT: GRADIENT PICKER =================
export class GradientPicker {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.stops = options.initialStops || [
            { id: 1, color: "#b93e88", opacity: 1, position: 0 },
            { id: 2, color: "#fca78c", opacity: 1, position: 100 },
        ];
        this.angle = options.initialAngle || 135;
        this.nextId = 100;
        this.activeStopId = null;
        this.onChange = options.onChange || (() => { });

        this.renderUI();
        this.updatePreview();
    }

    getGradientString() {
        const sorted = [...this.stops].sort((a, b) => a.position - b.position);
        const cssStops = sorted
            .map((s) => {
                const rgba = hexToRgba(s.color, s.opacity);
                return `${rgba} ${s.position}%`;
            })
            .join(", ");
        return `linear-gradient(${this.angle}deg, ${cssStops})`;
    }

    renderUI() {
        this.container.innerHTML = `
            <div class="gradient-ui">
                <div class="gradient-top-row">
                    <div class="clock-section">
                        <div id="${this.container.id}-angle-slider" class="angle-clock"></div>
                        <div class="clock-label">Кут</div>
                    </div>
                    <div class="gradient-preview-box">
                        <div class="gradient-live-view"></div>
                    </div>
                </div>

                <div class="stop-settings">
                    <div style="font-size: 12px; font-weight: bold; margin-bottom: 8px; text-transform: uppercase; color: var(--text-secondary);">Налаштування точки</div>
                    <div class="stop-settings-grid">
                        <div class="stop-color-section">
                            <label>Колір</label>
                            <div class="stop-color-picker"></div>
                        </div>
                        <div class="stop-opacity-section">
                            <label>Прозорість: <span class="opacity-value">1.00</span></label>
                            <div class="range">
                                <input type="range" class="stop-opacity-input" min="0" max="1" step="0.01">
                            </div>
                        </div>
                        <button class="delete-stop-btn" title="Видалити точку">×</button>
                    </div>
                </div>
            </div>

        `;
        this.bindEvents();
        this.renderHandles();
    }

    bindEvents() {
        // Initialize circular angle slider (clock-style)
        this.angleSlider = new CircularSlider(`${this.container.id}-angle-slider`, {
            initialValue: this.angle,
            size: 60,
            showValue: false,
            onChange: (value) => {
                this.angle = value;
                this.updatePreview();
            }
        });

        const previewBox = this.container.querySelector(".gradient-preview-box");
        const settingsPanel = this.container.querySelector(".stop-settings");
        const colorPickerDiv = settingsPanel.querySelector(".stop-color-picker");
        const opacityInput = settingsPanel.querySelector(".stop-opacity-input");
        const delBtn = settingsPanel.querySelector(".delete-stop-btn");

        // Клік на смужку для створення нового stop
        previewBox.addEventListener("click", (e) => {
            // Перевіряємо що клікнули не на handle
            if (e.target.classList.contains("grad-handle")) return;

            const rect = previewBox.getBoundingClientRect();
            let pos = ((e.clientX - rect.left) / rect.width) * 100;
            pos = Math.max(0, Math.min(100, pos));

            const newStop = {
                id: this.nextId++,
                color: "#888888",
                opacity: 1,
                position: Math.round(pos),
            };

            this.stops.push(newStop);
            this.renderHandles();
            this.updatePreview();
            this.selectStop(newStop.id);
        });

        // Ініціалізуємо Pickr для кольору точки
        this.stopColorPickr = Pickr.create({
            el: colorPickerDiv,
            theme: "nano",
            default: "#888888",
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
                    save: true,
                    clear: false,
                },
            },
        });

        // Оновлюємо колір кнопки Pickr
        this.stopColorPickr.on("init", () => {
            const button = colorPickerDiv.querySelector(".pcr-button");
            if (button) {
                button.style.backgroundColor = "#888888";
                button.style.color = "#888888";
            }
        });

        this.stopColorPickr.on("change", (color) => {
            if (!this.activeStopId || !color) return;

            const hexColor = color.toHEXA().toString();
            const stop = this.stops.find((s) => s.id === this.activeStopId);
            if (stop) {
                stop.color = hexColor;
                const handle = this.container.querySelector(`[data-id="${stop.id}"]`);
                if (handle) handle.style.background = hexColor;

                // Оновлюємо колір кнопки Pickr
                const button = colorPickerDiv.querySelector(".pcr-button");
                if (button) {
                    button.style.backgroundColor = hexColor;
                    button.style.color = hexColor;
                }

                this.updatePreview();
            }
        });

        this.stopColorPickr.on("save", (color) => {
            if (color) {
                this.stopColorPickr.hide();
            }
        });

        opacityInput.addEventListener("input", () => {
            if (!this.activeStopId) return;
            const stop = this.stops.find((s) => s.id === this.activeStopId);
            if (stop) {
                stop.opacity = parseFloat(opacityInput.value);
                // Update opacity value display
                const opacityDisplay = settingsPanel.querySelector(".opacity-value");
                if (opacityDisplay) {
                    opacityDisplay.textContent = stop.opacity.toFixed(2);
                }
                this.updatePreview();
            }
        });

        delBtn.addEventListener("click", () => {
            if (this.stops.length <= 2) {
                alert("Мінімум 2 кольори!");
                return;
            }
            this.stops = this.stops.filter((s) => s.id !== this.activeStopId);
            this.activeStopId = null;
            settingsPanel.classList.remove("visible");
            this.renderHandles();
            this.updatePreview();
        });
    }

    renderHandles() {
        const box = this.container.querySelector(".gradient-preview-box");
        box.querySelectorAll(".grad-handle").forEach((el) => el.remove());

        this.stops.forEach((stop) => {
            const handle = document.createElement("div");
            handle.className = "grad-handle";
            if (stop.id === this.activeStopId) handle.classList.add("active");
            handle.style.left = stop.position + "%";
            handle.style.background = stop.color;
            handle.dataset.id = stop.id;

            handle.addEventListener("mousedown", (e) => {
                e.preventDefault(); // Prevent text selection
                e.stopPropagation();
                this.selectStop(stop.id);
                const rect = box.getBoundingClientRect();
                const move = (ev) => {
                    ev.preventDefault();
                    let pos = ((ev.clientX - rect.left) / rect.width) * 100;
                    pos = Math.max(0, Math.min(100, pos));
                    stop.position = Math.round(pos);
                    handle.style.left = stop.position + "%";
                    this.updatePreview();
                };
                const up = () => {
                    document.removeEventListener("mousemove", move);
                    document.removeEventListener("mouseup", up);
                };
                document.addEventListener("mousemove", move);
                document.addEventListener("mouseup", up);
            });

            // Right-click to delete
            handle.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                if (this.stops.length <= 2) {
                    alert("Мінімум 2 кольори!");
                    return;
                }
                this.stops = this.stops.filter((s) => s.id !== stop.id);
                if (this.activeStopId === stop.id) {
                    this.activeStopId = null;
                    const settingsPanel = this.container.querySelector(".stop-settings");
                    settingsPanel.classList.remove("visible");
                }
                this.renderHandles();
                this.updatePreview();
            });

            box.appendChild(handle);
        });
    }

    selectStop(id) {
        this.activeStopId = id;
        const stop = this.stops.find((s) => s.id === id);
        this.container.querySelectorAll(".grad-handle").forEach((h) => {
            h.classList.toggle("active", h.dataset.id == id);
        });
        const settingsPanel = this.container.querySelector(".stop-settings");
        if (!settingsPanel) return; // Safety check

        settingsPanel.classList.add("visible");

        // Оновлюємо Pickr
        if (this.stopColorPickr) {
            this.stopColorPickr.setColor(stop.color);

            // Оновлюємо колір кнопки Pickr
            const colorPickerDiv = settingsPanel.querySelector(".stop-color-picker");
            if (colorPickerDiv) {
                const button = colorPickerDiv.querySelector(".pcr-button");
                if (button) {
                    button.style.backgroundColor = stop.color;
                    button.style.color = stop.color;
                }
            }
        }

        const opacityInput = settingsPanel.querySelector(".stop-opacity-input");
        if (opacityInput) {
            opacityInput.value = stop.opacity;
            // Update opacity value display
            const opacityDisplay = settingsPanel.querySelector(".opacity-value");
            if (opacityDisplay) {
                opacityDisplay.textContent = stop.opacity.toFixed(2);
            }
        }
    }

    updatePreview() {
        const bg = this.getGradientString();
        const view = this.container.querySelector(".gradient-live-view");
        if (view) view.style.background = bg;
        this.onChange(bg);
    }

    /**
     * Set new stops and angle programmatically (for randomize)
     * @param {Array} newStops - Array of stop objects {color, opacity, position}
     * @param {number} newAngle - Gradient angle in degrees
     */
    setStops(newStops, newAngle) {
        // Assign new IDs to stops
        this.stops = newStops.map((stop, i) => ({
            id: this.nextId++,
            color: stop.color,
            opacity: stop.opacity ?? 1,
            position: stop.position
        }));

        this.angle = newAngle;
        this.activeStopId = null;

        // Update angle slider if exists
        if (this.angleSlider && this.angleSlider.setValue) {
            this.angleSlider.setValue(newAngle);
        }

        // Hide settings panel
        const settingsPanel = this.container.querySelector(".stop-settings");
        if (settingsPanel) settingsPanel.classList.remove("visible");

        // Re-render
        this.renderHandles();
        this.updatePreview();
    }
}
