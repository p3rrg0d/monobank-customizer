export interface CircularSliderOptions {
    initialValue?: number;
    min?: number;
    max?: number;
    onChange?: (value: number) => void;
    onStart?: () => void;
    onEnd?: () => void;
    size?: number;
    showValue?: boolean;
}

export class CircularSlider {
    private container: HTMLElement | null;
    private value: number;
    private min: number;
    private max: number;
    private onChange: (value: number) => void;
    private onStart: () => void;
    private onEnd: () => void;
    private size: number;
    private showValue: boolean;
    private isDragging: boolean = false;

    private svg: SVGSVGElement | null = null;
    private needle: SVGLineElement | null = null;
    private valueDisplay: HTMLElement | null = null;

    constructor(containerId: string, options: CircularSliderOptions = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`CircularSlider: Container ${containerId} not found`);
            this.value = 0;
            this.min = 0;
            this.max = 0;
            this.onChange = () => { };
            this.onStart = () => { };
            this.onEnd = () => { };
            this.size = 0;
            this.showValue = false;
            return;
        }

        this.value = options.initialValue || 135;
        this.min = options.min || 0;
        this.max = options.max || 360;
        this.onChange = options.onChange || (() => { });
        this.onStart = options.onStart || (() => { });
        this.onEnd = options.onEnd || (() => { });
        this.size = options.size || 120;
        this.showValue = options.showValue !== false;

        this.render();
        this.bindEvents();
        this.update();
    }

    render() {
        if (!this.container) return;
        const radius = 50;
        const strokeWidth = 3;

        const valueHTML = this.showValue ? `<div class="slider-value">${this.value}°</div>` : '';

        this.container.innerHTML = `
            <div class="circular-slider" style="width: ${this.size}px; height: ${this.size}px;">
                <svg viewBox="0 0 120 120" class="circular-slider-svg">
                    <!-- Background track (circle) -->
                    <circle 
                        cx="60" 
                        cy="60" 
                        r="${radius}" 
                        class="slider-track"
                        fill="none"
                        stroke="var(--border-color)"
                        stroke-width="${strokeWidth}"
                    />
                    <!-- Clock needle (line from center to edge) -->
                    <line 
                        class="slider-needle"
                        x1="60"
                        y1="60"
                        x2="60"
                        y2="10"
                        stroke="var(--accent-primary)"
                        stroke-width="2"
                        stroke-linecap="round"
                    />
                    <!-- Center dot -->
                    <circle
                        cx="60"
                        cy="60"
                        r="4"
                        fill="var(--accent-primary)"
                    />
                </svg>
                ${valueHTML}
            </div>
        `;

        this.svg = this.container.querySelector('.circular-slider-svg') as SVGSVGElement;
        this.needle = this.container.querySelector('.slider-needle') as SVGLineElement;
        this.valueDisplay = this.container.querySelector('.slider-value') as HTMLElement;
    }

    bindEvents() {
        if (!this.svg) return;

        const startDrag = (e: MouseEvent | Touch) => {
            this.isDragging = true;
            this.onStart();
            this.updateFromEvent(e);
        };

        const drag = (e: MouseEvent | Touch) => {
            if (!this.isDragging) return;
            this.updateFromEvent(e);
        };

        const endDrag = () => {
            if (this.isDragging) {
                this.isDragging = false;
                this.onEnd();
            }
        };

        this.svg.addEventListener('mousedown', (e) => {
            startDrag(e);
            e.preventDefault();
        });
        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                drag(e);
                e.preventDefault();
            }
        });
        document.addEventListener('mouseup', endDrag);

        this.svg.addEventListener('touchstart', (e) => {
            startDrag(e.touches[0]);
            e.preventDefault();
        }, { passive: false });
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) {
                drag(e.touches[0]);
                e.preventDefault();
            }
        }, { passive: false });
        document.addEventListener('touchend', endDrag);
    }

    updateFromEvent(e: MouseEvent | Touch) {
        if (!this.svg) return;
        const rect = this.svg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        angle = (angle + 90 + 360) % 360;

        this.setValue(Math.round(angle));
    }

    setValue(value: number) {
        value = Math.max(this.min, Math.min(this.max, value));

        if (this.value !== value) {
            this.value = value;
            this.update();
            this.onChange(this.value);
        }
    }

    update() {
        if (!this.needle) return;

        const radius = 50;
        const centerX = 60;
        const centerY = 60;

        if (this.valueDisplay) {
            this.valueDisplay.textContent = `${this.value}°`;
        }

        const angleRad = (this.value - 90) * (Math.PI / 180);
        const needleX = centerX + radius * Math.cos(angleRad);
        const needleY = centerY + radius * Math.sin(angleRad);

        this.needle.setAttribute('x2', needleX.toString());
        this.needle.setAttribute('y2', needleY.toString());
    }
}
