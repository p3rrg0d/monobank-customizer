import { Randomizer } from './Randomizer.js';

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

        const stateCopy = JSON.parse(JSON.stringify(this.state));
        this.history.push(stateCopy);
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
        this.onUndoAvailabilityChange(this.history.length > 0);
    }

    undo() {
        if (this.history.length === 0) return;

        this._preventSave = true;
        const previousState = this.history.pop();
        this.replace(previousState, true);
        this.onUndoAvailabilityChange(this.history.length > 0);
        this._preventSave = false;
    }

    randomize() {
        this.save();
        this._preventSave = true;

        const overrides = Randomizer.generate();

        // Apply everything
        Object.assign(this.state, overrides);
        this.onStateChange(this.state);

        this._preventSave = false;
        return overrides;
    }
}
