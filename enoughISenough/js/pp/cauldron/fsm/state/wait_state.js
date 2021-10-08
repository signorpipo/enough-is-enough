PP.WaitState = class WaitState extends PP.State {
    constructor(timeToWait = 0, transitionToPerformOnEnd = null, ...transitionArgs) {
        super();

        this._myTimeToWait = timeToWait;
        this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
        this._myTransitionArgs = transitionArgs;

        this._myTimer = new PP.Timer(timeToWait);
    }

    onEnd(callback, id = null) {
        this._myTimer.onEnd(callback, id);
    }

    unregisterOnEnd(id = null) {
        this._myTimer.unregisterOnEnd(id);
    }

    update(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            if (this._myTransitionToPerformOnEnd != null) {
                fsm.perform(this._myTransitionToPerformOnEnd, ...this._myTransitionArgs);
            }
        }
    }

    start(fsm, transition, timeToWait = null, transitionToPerformOnEnd = null, ...transitionArgs) {
        this._myTimer.start(timeToWait);
        if (transitionToPerformOnEnd != null) {
            this._myTransitionToPerformOnEnd = transitionToPerformOnEnd;
            this._myTransitionArgs = transitionArgs;
        }
    }
};