class Vent {
    constructor() {


        this._myMrNOTClones = [];

        this._myOnVentLostCallback = null;
        this._myOnVentCompletedCallback = null;

        this._myIsCleaning = false;
        this._myHitCounter = 0;

        //Setup
        this._myStartDistance = 20;
        this._myTimeToReachTarget = 5;
    }

    start() {
        this._myMrNOTClones = [];
        this._myTimer = new PP.Timer(1);

        this._myIsCleaning = false;
        this._myHitCounter = 0;
    }

    update(dt) {
        if (!this._myIsCleaning) {
            this._myTimer.update(dt);
            if (this._myTimer.isDone()) {
                this._myTimer.start(1);

                let angle = Math.pp_random(160, 200);
                let direction = [0, 0, 1];
                direction.vec3_rotateAxis([0, 1, 0], angle, direction);
                direction.vec3_normalize(direction);
                direction.vec3_scale(this._myStartDistance, direction);

                let mrNOTClone = new MrNOTClone(direction.vec3_add([0, 2.5, 0]), [0, 1.7, 0], this._myTimeToReachTarget, this._mrNOTCloneHitByYou.bind(this), this._mrNOTCloneReachYou.bind(this));
                this._myMrNOTClones.push(mrNOTClone);
            }
        }

        for (let clone of this._myMrNOTClones) {
            clone.update(dt);
        }

        this._myMrNOTClones.pp_removeAll(element => element.isDone());
    }

    isDone() {
        return this._myMrNOTClones.length == 0;
    }

    stop() {
        for (let clone of this._myMrNOTClones) {
            clone.destroy();
        }
        this._myMrNOTClones = [];
    }

    clean() {
        this._myIsCleaning = true;
        for (let clone of this._myMrNOTClones) {
            clone.unspawn();
        }
    }

    onVentLost(callback) {
        this._myOnVentLostCallback = callback;
    }

    onVentCompleted(callback) {
        this._myOnVentCompletedCallback = callback;
    }

    _mrNOTCloneHitByYou() {
        this._myHitCounter++;

        if (this._myHitCounter > 5) {
            if (this._myOnVentCompletedCallback) {
                this._myOnVentCompletedCallback();
            }
        }
    }

    _mrNOTCloneReachYou() {
        if (this._myOnVentLostCallback) {
            this._myOnVentLostCallback();
        }
    }


}