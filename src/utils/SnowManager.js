export class SnowManager {
    constructor(containerId = 'snow-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = containerId;
            document.body.prepend(this.container);
        }

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);

        this.snowflakeCount = 300;
        this.snowflakes = [];
        this.isRunning = false;

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.snowflakes = [];
        for (let i = 0; i < this.snowflakeCount; i++) {
            this.snowflakes.push(this.createSnowflake());
        }
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    createSnowflake() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 1 + 0.5,
            wind: Math.random() * 0.5 - 0.25,
            opacity: Math.random() * 0.5 + 0.3
        };
    }

    update() {
        for (let s of this.snowflakes) {
            s.y += s.speed;
            s.x += s.wind;

            if (s.y > this.canvas.height) {
                s.y = -s.radius;
                s.x = Math.random() * this.canvas.width;
            }
            if (s.x > this.canvas.width) s.x = 0;
            if (s.x < 0) s.x = this.canvas.width;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'white';

        for (let s of this.snowflakes) {
            this.ctx.beginPath();
            this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
            this.ctx.globalAlpha = s.opacity;
            this.ctx.fill();
        }
        this.ctx.globalAlpha = 1.0;
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}
