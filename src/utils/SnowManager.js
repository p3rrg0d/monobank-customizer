export class SnowManager {
    constructor(containerId = 'snow-container') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = containerId;
            document.body.prepend(this.container);
        }
        this.snowflakeCount = 150;
        this.snowflakes = [];
    }

    init() {
        for (let i = 0; i < this.snowflakeCount; i++) {
            this.createSnowflake();
        }
    }

    createSnowflake() {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';

        const size = Math.random() * 5 + 2 + 'px';
        const left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 10 + 10 + 's';
        const delay = Math.random() * -20 + 's';
        const opacity = Math.random() * 0.5 + 0.3;

        snowflake.style.width = size;
        snowflake.style.height = size;
        snowflake.style.left = left;
        snowflake.style.animationDuration = duration;
        snowflake.style.animationDelay = delay;
        snowflake.style.opacity = opacity;

        this.container.appendChild(snowflake);
        this.snowflakes.push(snowflake);
    }
}
