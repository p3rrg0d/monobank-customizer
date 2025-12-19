export class StateManager {
    constructor(initialState = {}, callbacks = {}) {
        this.state = { ...initialState };
        this.defaultState = JSON.parse(JSON.stringify(initialState));
        this.history = [];
        this.maxHistoryLength = 20;
        this._preventSave = false;

        this.onStateChange = callbacks.onStateChange || (() => { });
        this.onUndoAvailabilityChange = callbacks.onUndoAvailabilityChange || (() => { });
    }

    get() {
        return this.state;
    }

    set(partialState) {
        Object.assign(this.state, partialState);
        this.onStateChange(this.state);
    }

    // Replace the entire state (used for Undo and Presets)
    replace(newState, preventSave = false) {
        if (preventSave) this._preventSave = true;
        this.state = JSON.parse(JSON.stringify(newState));
        this.onStateChange(this.state);
        if (preventSave) this._preventSave = false;
    }

    save() {
        if (this._preventSave) return;

        // Debugging history spam
        console.groupCollapsed("StateManager.save called. History size: " + this.history.length);
        console.trace();
        console.groupEnd();

        const stateCopy = JSON.parse(JSON.stringify(this.state));
        this.history.push(stateCopy);
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
        console.log("State Saved. History size:", this.history.length);
        this.onUndoAvailabilityChange(this.history.length > 0);
    }

    undo() {
        if (this.history.length === 0) return;

        this._preventSave = true;
        const previousState = this.history.pop();
        console.log("Undoing. New History size:", this.history.length);
        this.replace(previousState, true);
        this.onUndoAvailabilityChange(this.history.length > 0);
        this._preventSave = false;
    }

    randomize() {
        this.save();
        this._preventSave = true;

        // --- CORE HELPERS ---
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomFloat = (min, max) => Math.random() * (max - min) + min;
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];

        const hslToHex = (h, s, l) => {
            h = (h + 360) % 360;
            l = Math.max(0, Math.min(100, l)) / 100;
            s = Math.max(0, Math.min(100, s)) / 100;
            const a = s * Math.min(l, 1 - l);
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        };

        const getLuminance = (hex) => {
            const hexClean = hex.startsWith('#') ? hex.slice(1) : hex;
            const rgb = hexClean.match(/[A-Za-z0-9]{2}/g).map(v => parseInt(v, 16) / 255);
            const res = rgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
            return 0.2126 * res[0] + 0.7152 * res[1] + 0.0722 * res[2];
        };

        // --- THE "SUPER SMART" DECISION ENGINE ---
        const overrides = {};
        const isChaosMode = Math.random() > 0.75; // 25% chance for "Pure Chaos"
        const isGlassMode = Math.random() > 0.7; // 30% chance for Glassmorphism

        // 1. Base Colors
        let h1 = randomInt(0, 360);
        let s1 = isChaosMode ? randomInt(40, 100) : randomInt(20, 80);
        let l1 = isChaosMode ? randomInt(5, 95) : randomChoice([randomInt(5, 20), randomInt(80, 95)]); // Dark or Light preference unless chaos
        let alpha1 = isGlassMode ? randomFloat(0.1, 0.4) : (Math.random() > 0.8 ? randomFloat(0.4, 0.7) : 1);

        const color1 = hslToHex(h1, s1, l1);

        // Pick contrasting text
        const lum = getLuminance(color1);
        // If very transparent, we usually want Black or White depending on what's behind (usually light)
        const textColor = (alpha1 < 0.4) ? '#000000' : (lum > 0.4 ? '#000000' : '#ffffff');

        // 2. Background Strategy
        if (Math.random() > 0.3) {
            overrides.bgType = "gradient";
            const stopCount = randomChoice([2, 2, 2, 3]);
            const stops = [{ id: 1, color: color1, opacity: alpha1, position: 0 }];

            for (let i = 2; i <= stopCount; i++) {
                let h2, s2, l2, a2;
                if (isChaosMode) {
                    h2 = randomInt(0, 360); s2 = randomInt(50, 100); l2 = randomInt(30, 70); a2 = randomFloat(0.3, 1);
                } else {
                    // Harmonious shift
                    const shift = randomChoice([30, 60, 120, 180]);
                    h2 = h1 + shift;
                    s2 = s1;
                    l2 = l1 > 50 ? l1 - 20 : l1 + 20;
                    a2 = alpha1;
                }
                stops.push({ id: i, color: hslToHex(h2, s2, l2), opacity: a2, position: Math.round(((i - 1) / (stopCount - 1)) * 100) });
            }
            overrides.bgGradientStops = stops;
            overrides.bgGradientAngle = randomInt(0, 360);
        } else {
            overrides.bgType = "solid";
            overrides.bgSolidColor = color1;
            overrides.bgSolidOpacity = alpha1;
        }

        // 3. Structural Variety
        overrides.borderRadius = randomChoice([0, 4, 8, 16, 24, 32, 48, 64]);
        overrides.borderEnabled = Math.random() > 0.4;
        if (overrides.borderEnabled) {
            overrides.borderStyle = randomChoice(["solid", "dashed", "dotted", "double"]);
            overrides.borderWidth = randomInt(1, 5);
            // Border color: contrast or accent
            if (Math.random() > 0.5) {
                overrides.borderColor = textColor; // Matches text for "clean" look
            } else {
                overrides.borderColor = hslToHex(h1 + 180, 80, 50); // Complementary pop
            }
            overrides.borderOpacity = isGlassMode ? 0.6 : randomFloat(0.3, 1);
        } else {
            overrides.borderWidth = 0;
            overrides.borderOpacity = 0;
        }

        // 4. Progress Bar (Extreme variety)
        overrides.progressRadius = randomChoice([0, 4, 8, 12, 20, 50]);
        overrides.progTrackType = randomChoice(["solid", "gradient"]);
        overrides.progTrackSolidColor = textColor === '#ffffff' ? '#ffffff' : '#000000';
        overrides.progTrackSolidOpacity = randomFloat(0.05, 0.2);

        overrides.progFillType = randomChoice(["solid", "gradient"]);
        const fillH = h1 + randomChoice([30, 90, 150, 180, 270]);
        const fillS = 90;
        const fillL = 60;
        const fillHex = hslToHex(fillH, fillS, fillL);

        if (overrides.progFillType === "solid") {
            overrides.progFillSolidColor = fillHex;
            overrides.progFillSolidOpacity = 1;
        } else {
            overrides.progFillGradientStops = [
                { id: 1, color: fillHex, opacity: 1, position: 0 },
                { id: 2, color: hslToHex(fillH + 40, fillS, 40), opacity: 1, position: 100 }
            ];
            overrides.progFillGradientAngle = randomInt(0, 360);
        }

        // 5. Radical Text Shadows
        overrides.textColor = textColor;
        overrides.textShadowEnabled = Math.random() > 0.3;
        if (overrides.textShadowEnabled) {
            const shadowType = randomChoice(['neon-glow', 'retro-hard', 'deep-soft', 'multi-glow', 'none']);
            if (shadowType === 'none') {
                overrides.textShadowEnabled = false;
            } else {
                overrides.textShadowOpacity = randomFloat(0.5, 0.9);
                switch (shadowType) {
                    case 'neon-glow':
                        overrides.textShadowColor = hslToHex(randomInt(0, 360), 100, 50);
                        overrides.textShadowBlur = randomInt(8, 20);
                        overrides.textShadowX = 0; overrides.textShadowY = 0;
                        break;
                    case 'retro-hard': // 80s / Brutalist
                        overrides.textShadowColor = randomChoice(['#ff00ff', '#00ffff', '#ffff00', '#000000']);
                        overrides.textShadowBlur = 0;
                        overrides.textShadowX = 3; overrides.textShadowY = 3;
                        break;
                    case 'deep-soft':
                        overrides.textShadowColor = '#000000';
                        overrides.textShadowBlur = 8;
                        overrides.textShadowX = 0; overrides.textShadowY = 4;
                        break;
                    case 'multi-glow':
                        overrides.textShadowColor = fillHex;
                        overrides.textShadowBlur = 15;
                        overrides.textShadowX = 0; overrides.textShadowY = 0;
                        break;
                }
            }
        }

        // 6. QR
        overrides.qrFrame = randomChoice(["standard", "frame1", "frame2", "frame3"]);

        // Apply everything
        Object.assign(this.state, overrides);
        this.onStateChange(this.state);

        this._preventSave = false;
        console.log(`Deep Chaos v4 applied! (Mode: ${isChaosMode ? 'CHAOS' : 'HARMONY'})`);
        return overrides;
    }
}
