import { Randomizer } from "./Randomizer.ts";

export interface StateChangeCallback {
    (state: any): void;
}

export interface StateManagerCallbacks {
    onStateChange?: StateChangeCallback;
    onUndoAvailabilityChange?: (available: boolean) => void;
    onRedoAvailabilityChange?: (available: boolean) => void;
}

export class StateManager {
    private state: any;
    private history: any[] = [];
    private redoHistory: any[] = [];
    private maxHistoryLength: number = 20;
    private _preventSave: boolean = false;

    private onStateChange: StateChangeCallback;
    private onUndoAvailabilityChange: (available: boolean) => void;
    private onRedoAvailabilityChange: (available: boolean) => void;

    constructor(initialState: any = {}, callbacks: StateManagerCallbacks = {}) {
        this.state = JSON.parse(JSON.stringify(initialState));

        this.onStateChange = callbacks.onStateChange || (() => { });
        this.onUndoAvailabilityChange =
            callbacks.onUndoAvailabilityChange || (() => { });
        this.onRedoAvailabilityChange =
            callbacks.onRedoAvailabilityChange || (() => { });
    }

    get(): any {
        return this.state;
    }

    set(partialState: any) {

        Object.assign(this.state, partialState);
        this.onStateChange(this.state);
    }

    replace(newState: any, preventSave: boolean = false) {
        if (preventSave) this._preventSave = true;
        this.state = JSON.parse(JSON.stringify(newState));
        this.onStateChange(this.state);
        if (preventSave) this._preventSave = false;
    }

    save() {
        if (this._preventSave) return;

        const stateCopy = JSON.parse(JSON.stringify(this.state));
        this.history.push(stateCopy);

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
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        this.onUndoAvailabilityChange(true);

        const nextState = this.redoHistory.pop();
        this.replace(nextState, true);

        this.onRedoAvailabilityChange(this.redoHistory.length > 0);
        this._preventSave = false;
    }

    randomize(): any {
        this.save();
        this._preventSave = true;

        const overrides = Randomizer.generate();

        Object.assign(this.state, overrides);
        this.onStateChange(this.state);

        this._preventSave = false;
        return overrides;
    }
}
