// Circular Slider Component for Angle Selection (Clock-style)
export class CircularSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`CircularSlider: Container ${containerId} not found`);
            return;
        }

        this.value = options.initialValue || 135;
        this.min = options.min || 0;
        this.max = options.max || 360;
        this.onChange = options.onChange || (() => { });
        this.size = options.size || 120;
        this.showValue = options.showValue !== false;
        this.isDragging = false;

        this.render();
        this.bindEvents();
        this.update();
    }

    render() {
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

        this.svg = this.container.querySelector('.circular-slider-svg');
        this.needle = this.container.querySelector('.slider-needle');
        this.valueDisplay = this.container.querySelector('.slider-value');
    }

    bindEvents() {
        const startDrag = (e) => {
            this.isDragging = true;
            this.updateFromEvent(e);
            e.preventDefault();
        };

        const drag = (e) => {
            if (!this.isDragging) return;
            this.updateFromEvent(e);
            e.preventDefault();
        };

        const endDrag = () => {
            this.isDragging = false;
        };

        // Mouse events
        this.svg.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);

        // Touch events for mobile
        this.svg.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
        document.addEventListener('touchmove', (e) => {
            if (this.isDragging) drag(e.touches[0]);
        });
        document.addEventListener('touchend', endDrag);
    }

    updateFromEvent(e) {
        const rect = this.svg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate angle from center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Normalize to 0-360
        angle = (angle + 90 + 360) % 360;

        this.setValue(Math.round(angle));
    }

    setValue(value) {
        // Clamp value
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

        // Update value display if shown
        if (this.valueDisplay) {
            this.valueDisplay.textContent = `${this.value}°`;
        }

        // Calculate needle end position (angle in radians, rotated by -90° to start at top)
        const angleRad = (this.value - 90) * (Math.PI / 180);
        const needleX = centerX + radius * Math.cos(angleRad);
        const needleY = centerY + radius * Math.sin(angleRad);

        // Update needle position
        this.needle.setAttribute('x2', needleX);
        this.needle.setAttribute('y2', needleY);
    }
}
