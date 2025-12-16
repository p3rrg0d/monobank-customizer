export class DragController {
    constructor(element, container, options = {}) {
        this.element = element;
        this.container = container;
        this.previewScale = options.scale || 1.5;
        this.isCustomPositioned = false;

        this.onDragStart = options.onDragStart || (() => { });
        this.onDragEnd = options.onDragEnd || (() => { });

        this.init();
    }

    init() {
        if (!this.element || !this.container) return;

        this.element.style.position = "absolute";
        this.element.style.transformOrigin = "center center"; // Ensure scale works from center

        // Ensure initial scale is applied even before drag
        if (!this.isCustomPositioned) {
            this.element.style.left = "50%";
            this.element.style.top = "50%";
            this.element.style.transform = `translate(-50%, -50%) scale(${this.previewScale})`;
        }

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
    }

    onMouseDown(e) {
        if (e.button !== 0) return;
        this.isDragging = true;

        this.startX = e.clientX;
        this.startY = e.clientY;

        // Temporarily disable transition
        this.element.style.transition = 'none';

        if (!this.isCustomPositioned) {
            // Switch from center-based positioning to top-left based positioning
            const rect = this.element.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();

            // Calculate where the element currently is visually inside the container
            const visualLeft = rect.left - containerRect.left;
            const visualTop = rect.top - containerRect.top;

            // Freeze it there, but change origin to top-left (0 0)
            this.element.style.transformOrigin = "0 0";
            this.element.style.transform = `scale(${this.previewScale})`;
            this.element.style.left = `${visualLeft}px`;
            this.element.style.top = `${visualTop}px`;

            this.isCustomPositioned = true;

            // Force reflow
            void this.element.offsetWidth;
        }

        this.startLeft = parseFloat(this.element.style.left);
        this.startTop = parseFloat(this.element.style.top);

        this.element.style.cursor = "grabbing";

        this.onDragStart(); // Save state before dragging starts

        this.boundMouseMove = this.onMouseMove.bind(this);
        this.boundMouseUp = this.onMouseUp.bind(this);

        window.addEventListener("mousemove", this.boundMouseMove);
        window.addEventListener("mouseup", this.boundMouseUp);
    }

    onMouseMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();

        const dx = e.clientX - this.startX;
        const dy = e.clientY - this.startY;

        let newLeft = this.startLeft + dx;
        let newTop = this.startTop + dy;

        const containerWidth = this.container.clientWidth;
        const containerHeight = this.container.clientHeight;

        const visualWidth = this.element.getBoundingClientRect().width;
        const visualHeight = this.element.getBoundingClientRect().height;

        const maxLeft = containerWidth - visualWidth;
        const maxTop = containerHeight - visualHeight;

        if (maxLeft > 0) {
            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
        } else {
            newLeft = 0;
        }

        if (maxTop > 0) {
            newTop = Math.max(0, Math.min(newTop, maxTop));
        } else {
            newTop = 0;
        }

        this.element.style.left = `${newLeft}px`;
        this.element.style.top = `${newTop}px`;
    }

    onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.style.cursor = "grab";
            this.element.style.transition = 'transform 0.1s ease-out';

            window.removeEventListener("mousemove", this.boundMouseMove);
            window.removeEventListener("mouseup", this.boundMouseUp);

            // Return current position for state update
            const currentLeft = parseFloat(this.element.style.left);
            const currentTop = parseFloat(this.element.style.top);
            this.onDragEnd({ left: currentLeft, top: currentTop });
        }
    }

    setPosition(left, top) {
        if (left === undefined || top === undefined) {
            return;
        }

        this.isCustomPositioned = true;
        this.element.style.transformOrigin = "0 0";
        this.element.style.transform = `scale(${this.previewScale})`;

        this.element.style.left = `${left}px`;
        this.element.style.top = `${top}px`;
    }
}
