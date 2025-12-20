import { PRESETS } from '../data/Presets.js';
import { getBackgroundCSS, getQRFrameSVG } from '../utils/CSSGenerator.js';
import { hexToRgba } from '../utils/helpers.js';

export class ShowcaseManager {
    constructor(editor) {
        this.editor = editor;
        this.overlay = null;
        this.modal = null;
        this.grid = null;

        // State
        this.currentCategory = 'all';

        // Bind methods
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    create() {
        if (this.overlay) return;

        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'showcase-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        // Create modal
        this.modal = document.createElement('div');
        this.modal.className = 'showcase-modal';

        // Header
        const header = document.createElement('div');
        header.className = 'showcase-header';
        header.innerHTML = `
            <h2>Галерея пресетів</h2>
            <button class="showcase-close-btn" title="Закрити">&times;</button>
        `;
        header.querySelector('.showcase-close-btn').addEventListener('click', this.close);

        this.modal.appendChild(header);

        // Grid
        this.grid = document.createElement('div');
        this.grid.className = 'showcase-grid';
        this.modal.appendChild(this.grid);

        // Populate grid
        this.populate();

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        // ESC handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    populate() {
        this.grid.innerHTML = '';

        PRESETS.forEach((preset, index) => {
            const card = document.createElement('div');
            card.className = 'showcase-card';

            const preview = document.createElement('div');
            preview.className = 'showcase-card-preview';

            const widgetContainer = document.createElement('div');
            widgetContainer.className = 'mini-widget-wrapper';

            // Use actual custom element for perfect replication
            const widget = document.createElement('my-widget');
            widget.className = 'mini-widget';

            // Apply styles from preset state
            this.applyPresetStyles(widget, preset.state);

            widgetContainer.appendChild(widget);
            preview.appendChild(widgetContainer);

            const name = document.createElement('div');
            name.className = 'showcase-card-name';
            name.textContent = preset.name;

            card.appendChild(preview);
            card.appendChild(name);

            card.addEventListener('click', () => {
                this.editor.loadPreset(index);
                this.close();
            });

            this.grid.appendChild(card);
        });
    }

    applyPresetStyles(el, s) {
        const style = el.style;

        // Background
        const bg = getBackgroundCSS(
            s.bgType,
            s.bgSolidColor,
            s.bgSolidOpacity,
            s.bgGradientString
        );
        style.setProperty('--widget-bg-color', bg);

        // Border
        style.setProperty('--widget-border-color', hexToRgba(s.borderColor, s.borderOpacity));
        style.setProperty('--widget-border-width', (s.borderEnabled ? s.borderWidth : 0) + "px");
        style.setProperty('--widget-border-style', s.borderStyle);
        style.setProperty('--widget-border-radius', s.borderRadius + "px");

        // Progress
        style.setProperty('--progress-radius', s.progressRadius + "px");

        const trackBg = getBackgroundCSS(
            s.progTrackType,
            s.progTrackSolidColor,
            s.progTrackSolidOpacity,
            s.progTrackGradientString
        );
        style.setProperty('--progress-bg-color', trackBg);

        const fillBg = getBackgroundCSS(
            s.progFillType,
            s.progFillSolidColor,
            s.progFillSolidOpacity,
            s.progFillGradientString
        );
        style.setProperty('--progress-gradient', fillBg);

        // Text
        style.setProperty('--widget-text-color', s.textColor);

        const textShadow = s.textShadowEnabled
            ? `${s.textShadowX}px ${s.textShadowY}px ${s.textShadowBlur}px ${hexToRgba(s.textShadowColor, s.textShadowOpacity)}`
            : 'none';
        style.setProperty('--widget-text-shadow', textShadow);

        // QR Frame details
        style.setProperty("--qr-frame-bg", getQRFrameSVG(s.qrFrame));

        if (s.qrFrame === 'frame2') {
            style.setProperty("--qr-container-width", "180px");
            style.setProperty("--qr-container-pos-x", "-20.1px");
            style.setProperty("--qr-container-pos-y", "-19.5px");
            style.setProperty("--qr-width", "50%");
            style.setProperty("--qr-top", "17px");
            style.setProperty("--qr-left", "13.4%");
            style.setProperty("--qr-position", "relative");
        } else {
            style.setProperty("--qr-container-width", "145px");
            style.setProperty("--qr-container-pos-x", "-5px");
            style.setProperty("--qr-container-pos-y", "0px");
            style.setProperty("--qr-width", "45%");
            style.setProperty("--qr-top", "23%");
            style.setProperty("--qr-left", "26.5%");
            style.setProperty("--qr-position", "absolute");
        }

        // Additional variables for perfect replication
        style.setProperty("--border-enabled", s.borderEnabled ? "solid" : "none");

        // Ensure QR SVG inside widget (even if inside shadow DOM) is visible
        const root = el.shadowRoot || el;
        const qrPath = root.querySelector('.qr path');
        if (qrPath) qrPath.setAttribute('fill', s.textColor || '#fff');
    }

    open() {
        if (!this.overlay) this.create();
        this.overlay.classList.add('active');
        document.body.classList.add('modal-open');
        this.populate(); // Refresh on open
    }

    close() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}
