interface DragControllerOptions {
    scale?: number;
    onDragStart?: () => void;
    onDragEnd?: (pos: { left: number; top: number }) => void;
}

export class DragController {
    private element: HTMLElement;
    private container: HTMLElement;
    private previewScale: number;
    private isCustomPositioned: boolean = false;
    private isTouchDevice: boolean;
    private onDragStart: () => void;
    private onDragEnd: (pos: { left: number; top: number }) => void;

    private isDragging: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private startLeft: number = 0;
    private startTop: number = 0;

    private boundMouseMove: (e: MouseEvent) => void;
    private boundMouseUp: (e: MouseEvent) => void;

    constructor(element: HTMLElement, container: HTMLElement, options: DragControllerOptions = {}) {
        this.element = element;
        this.container = container;
        this.previewScale = options.scale || 1.5;
        this.isCustomPositioned = false;

        this.isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

        this.onDragStart = options.onDragStart || (() => { });
        this.onDragEnd = options.onDragEnd || (() => { });

        this.boundMouseMove = this.onMouseMove.bind(this);
        this.boundMouseUp = this.onMouseUp.bind(this);

        this.init();
    }

    init() {
        if (!this.element || !this.container) return;

        if (this.isTouchDevice) {
            this.element.style.position = "absolute";
            this.element.style.transformOrigin = "center center";
            this.element.style.left = "50%";
            this.element.style.top = "50%";
            this.element.style.transform = `translate(-50%, -50%) scale(${this.previewScale})`;
            return;
        }

        this.element.style.position = "absolute";
        this.element.style.transformOrigin = "center center";

        if (!this.isCustomPositioned) {
            this.element.style.left = "50%";
            this.element.style.top = "50%";
            this.element.style.transform = `translate(-50%, -50%) scale(${this.previewScale})`;
        }

        this.element.addEventListener("mousedown", this.onMouseDown.bind(this));
    }

    private onMouseDown(e: MouseEvent) {
        if (e.button !== 0) return;
        this.isDragging = true;

        this.startX = e.clientX;
        this.startY = e.clientY;

        this.element.style.transition = 'none';

        if (!this.isCustomPositioned) {
            const rect = this.element.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();

            const visualLeft = rect.left - containerRect.left;
            const visualTop = rect.top - containerRect.top;

            this.element.style.transformOrigin = "0 0";
            this.element.style.transform = `scale(${this.previewScale})`;
            this.element.style.left = `${visualLeft}px`;
            this.element.style.top = `${visualTop}px`;

            this.isCustomPositioned = true;

            void this.element.offsetWidth;
        }

        this.startLeft = parseFloat(this.element.style.left) || 0;
        this.startTop = parseFloat(this.element.style.top) || 0;

        this.element.style.cursor = "grabbing";

        this.onDragStart();

        window.addEventListener("mousemove", this.boundMouseMove);
        window.addEventListener("mouseup", this.boundMouseUp);
    }

    private onMouseMove(e: MouseEvent) {
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

    private onMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.style.cursor = "grab";
            this.element.style.transition = 'transform 0.1s ease-out';

            window.removeEventListener("mousemove", this.boundMouseMove);
            window.removeEventListener("mouseup", this.boundMouseUp);

            const currentLeft = parseFloat(this.element.style.left) || 0;
            const currentTop = parseFloat(this.element.style.top) || 0;
            this.onDragEnd({ left: currentLeft, top: currentTop });
        }
    }

    setPosition(left: number | undefined, top: number | undefined) {
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
