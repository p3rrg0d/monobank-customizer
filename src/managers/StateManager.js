import { Randomizer } from './Randomizer.js';

export class StateManager {
    constructor(initialState = {}, callbacks = {}) {
        this.state = { ...initialState };
        this.defaultState = JSON.parse(JSON.stringify(initialState));
        this.history = [];
        this.redoHistory = []; // Stack for redo operations
        this.maxHistoryLength = 20;
        this._preventSave = false;

        this.onStateChange = callbacks.onStateChange || (() => { });
        this.onUndoAvailabilityChange = callbacks.onUndoAvailabilityChange || (() => { });
        this.onRedoAvailabilityChange = callbacks.onRedoAvailabilityChange || (() => { });
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

        // Clear redo history on new change
        if (this.redoHistory.length > 0) {
            this.redoHistory = [];
            this.onRedoAvailabilityChange(false);
        }

        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        }
        this.onUndoAvailabilityChange(this.history.length > 0);
    }

    undo() {
        if (this.history.length === 0) return;

        this._preventSave = true;

        // Save current state to redo history
        this.redoHistory.push(JSON.parse(JSON.stringify(this.state)));
        this.onRedoAvailabilityChange(true);

        const previousState = this.history.pop();
        this.replace(previousState, true);

        this.onUndoAvailabilityChange(this.history.length > 0);
        this._preventSave = false;
    }

    redo() {
        if (this.redoHistory.length === 0) return;

        this._preventSave = true;

        // Save current state to normal history
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        this.onUndoAvailabilityChange(true);

        const nextState = this.redoHistory.pop();
        this.replace(nextState, true);

        this.onRedoAvailabilityChange(this.redoHistory.length > 0);
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
