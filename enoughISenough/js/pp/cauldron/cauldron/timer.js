PP.Timer = class Timer {
    constructor(duration, autoStart = true) {
        this._myDuration = duration;
        this._myOnEndCallbacks = new Map();

        this._myIsDone = false;
        this._myStarted = false;

        if (autoStart) {
            this.start();
        }
    }

    start(duration = null) {
        this.reset(duration);
        this._myStarted = true;
    }

    reset(duration = null) {
        if (duration != null) {
            this._myDuration = duration;
        }

        this._myTimer = this._myDuration;
        this._myIsDone = false;
        this._myStarted = false;
    }

    update(dt) {
        if (this._myStarted && !this._myIsDone) {
            this._myTimer = Math.max(0, this._myTimer - dt);
            if (this._myTimer == 0) {
                this._done();
            }
        }
    }

    isRunning() {
        return this._myStarted;
    }

    isDone() {
        return this.isRunning() && this._myIsDone;
    }

    getDuration() {
        return this._myDuration;
    }

    getTimer() {
        return this._myTimer;
    }

    getPercentage() {
        let percentage = 1;
        if (this._myTimer > 0) {
            percentage = (this._myDuration - this._myTimer) / this._myDuration;
        }
        return Math.pp_clamp(percentage, 0, 1);
    }

    setDuration(duration) {
        this._myDuration = duration;
        this.reset();
    }

    onEnd(callback, id = null) {
        this._myOnEndCallbacks.set(id, callback);
    }

    unregisterOnEnd(id = null) {
        this._myOnEndCallbacks.delete(id);
    }

    _done() {
        this._myTimer = 0;
        this._myIsDone = true;
        for (let value of this._myOnEndCallbacks.values()) {
            value();
        }
    }
};