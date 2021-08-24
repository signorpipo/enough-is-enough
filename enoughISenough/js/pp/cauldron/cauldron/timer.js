PP.Timer = class Timer {
    constructor(duration, autoStart = true) {
        this._myDuration = duration;
        this._myOnEndCallbacks = new Map();

        this._myIsDone = false;
        this._myActive = false;

        if (autoStart) {
            this.start();
        }
    }

    start() {
        this.reset();
        this._myActive = true;
    }

    reset() {
        this._myTimer = this._myDuration;
        this._myIsDone = false;
        this._myActive = false;
    }

    update(dt) {
        if (this._myActive && !this._myIsDone) {
            this._myTimer = Math.max(0, this._myTimer - dt);
            if (this._myTimer == 0) {
                this._myIsDone = true;
                for (let value of this._myOnEndCallbacks.values()) {
                    value();
                }
            }
        }
    }

    isDone() {
        return this._myActive && this._myIsDone;
    }

    onEnd(callback, id = null) {
        this._myOnEndCallbacks.set(id, callback);
    }

    unregisterOnEnd(id = null) {
        this._myOnEndCallbacks.delete(id);
    }

    setDuration(duration) {
        this._myDuration = duration;
    }
};