import { PRESETS } from '../data/Presets.ts';
import { getBackgroundCSS, getQRFrameSVG } from '../utils/CSSGenerator.ts';
import { hexToRgba } from '../utils/helpers.ts';

export class ShowcaseManager {
    private editor: any;
    private overlay: HTMLElement | null = null;
    private modal: HTMLElement | null = null;
    private grid: HTMLElement | null = null;

    constructor(editor: any) {
        this.editor = editor;

        // Bind methods
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
    }

    create() {
        if (this.overlay) return;

        this.overlay = document.createElement('div');
        this.overlay.className = 'showcase-overlay';
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.close();
        });

        this.modal = document.createElement('div');
        this.modal.className = 'showcase-modal';

        const header = document.createElement('div');
        header.className = 'showcase-header';
        header.innerHTML = `
            <h2>Галерея пресетів</h2>
            <button class="showcase-close-btn" title="Закрити">&times;</button>
        `;
        header.querySelector('.showcase-close-btn')?.addEventListener('click', this.close);

        this.modal.appendChild(header);

        this.grid = document.createElement('div');
        this.grid.className = 'showcase-grid';
        this.modal.appendChild(this.grid);

        this.populate();

        this.overlay.appendChild(this.modal);
        document.body.appendChild(this.overlay);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay?.classList.contains('active')) {
                this.close();
            }
        });
    }

    populate() {
        if (!this.grid) return;
        this.grid.innerHTML = '';

        PRESETS.forEach((preset, index) => {
            const card = document.createElement('div');
            card.className = 'showcase-card';

            const preview = document.createElement('div');
            preview.className = 'showcase-card-preview';

            const widgetContainer = document.createElement('div');
            widgetContainer.className = 'mini-widget-wrapper';

            const widget = document.createElement('my-widget') as any;
            widget.className = 'mini-widget';

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

            this.grid?.appendChild(card);
        });
    }

    applyPresetStyles(el: HTMLElement, s: any) {
        const style = el.style;

        // Background
        const bg = getBackgroundCSS(s.background);
        style.setProperty('--widget-bg-color', bg);

        // Border
        style.setProperty('--widget-border-color', hexToRgba(s.border.color, s.border.opacity));
        style.setProperty('--widget-border-width', (s.border.enabled ? s.border.width : 0) + "px");
        style.setProperty('--widget-border-style', s.border.style);
        style.setProperty('--widget-border-radius', s.border.radius + "px");

        // Progress
        style.setProperty('--progress-radius', s.progress.radius + "px");

        const trackBg = getBackgroundCSS(s.progress.track);
        style.setProperty('--progress-bg-color', trackBg);

        const fillBg = getBackgroundCSS(s.progress.fill);
        style.setProperty('--progress-gradient', fillBg);

        // Text
        style.setProperty('--widget-text-color', s.text.color);

        const shadow = s.text.shadow;
        const textShadow = shadow.enabled
            ? `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${hexToRgba(shadow.color, shadow.opacity)}`
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

        style.setProperty("--border-enabled", s.border.enabled ? "solid" : "none");

        const root = el.shadowRoot || el;
        const qrPath = root.querySelector('.qr path');
        if (qrPath) qrPath.setAttribute('fill', s.text.color || '#fff');
    }

    open() {
        if (!this.overlay) this.create();
        this.overlay?.classList.add('active');
        document.body.classList.add('modal-open');
        this.populate();
    }

    close() {
        if (!this.overlay) return;
        this.overlay.classList.remove('active');
        document.body.classList.remove('modal-open');
    }
}
