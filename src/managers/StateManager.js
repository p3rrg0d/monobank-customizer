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

        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        const randomFloat = (min, max) => Math.random() * (max - min) + min;
        const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const randomGradientData = () => {
            const angle = randomInt(0, 360);
            const numStops = randomInt(2, 4);
            const stops = [];
            for (let i = 0; i < numStops; i++) {
                stops.push({ color: randomColor(), opacity: 1, position: Math.round((i / (numStops - 1)) * 100) });
            }
            return { stops, angle };
        };

        const overrides = {};

        if (Math.random() > 0.5) {
            overrides.bgType = "solid";
            overrides.bgSolidColor = randomColor();
            overrides.bgSolidOpacity = randomFloat(0.7, 1);
        } else {
            overrides.bgType = "gradient";
            const gradData = randomGradientData();
            overrides.bgGradientStops = gradData.stops;
            overrides.bgGradientAngle = gradData.angle;
        }

        overrides.borderEnabled = Math.random() > 0.5;
        overrides.borderStyle = randomChoice(["solid", "dashed", "dotted", "double"]);
        overrides.borderWidth = overrides.borderEnabled ? randomInt(1, 5) : 0;
        overrides.borderColor = randomColor();
        overrides.borderOpacity = overrides.borderEnabled ? randomFloat(0.5, 1) : 0;
        overrides.borderRadius = randomInt(0, 40);
        overrides.progressRadius = randomInt(0, 16);

        if (Math.random() > 0.7) {
            overrides.progTrackType = "solid";
            overrides.progTrackSolidColor = randomColor();
            overrides.progTrackSolidOpacity = randomFloat(0.5, 1);
        } else {
            overrides.progTrackType = "gradient";
            const gradData = randomGradientData();
            overrides.progTrackGradientStops = gradData.stops;
            overrides.progTrackGradientAngle = gradData.angle;
        }

        if (Math.random() > 0.7) {
            overrides.progFillType = "solid";
            overrides.progFillSolidColor = randomColor();
            overrides.progFillSolidOpacity = randomFloat(0.8, 1);
        } else {
            overrides.progFillType = "gradient";
            const gradData = randomGradientData();
            overrides.progFillGradientStops = gradData.stops;
            overrides.progFillGradientAngle = gradData.angle;
        }

        overrides.qrFrame = randomChoice(["standard", "frame1", "frame2"]);

        overrides.textColor = randomColor();
        overrides.textShadowEnabled = Math.random() > 0.5;
        overrides.textShadowColor = randomColor();
        overrides.textShadowX = randomInt(-5, 5);
        overrides.textShadowY = randomInt(-5, 5);
        overrides.textShadowBlur = randomInt(0, 5);

        // Merge overrides into current state
        Object.assign(this.state, overrides);
        this.onStateChange(this.state);

        this._preventSave = false;

        return overrides; // Return what changed in case UI needs to know specifically
    }
}
