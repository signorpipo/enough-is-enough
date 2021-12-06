class Vent {
    constructor(ventSetup) {
        this._myVentSetup = ventSetup;

        this._myMrNOTClones = [];

        this._myOnVentLostCallback = null;
        this._myOnVentCompletedCallback = null;

        this._myIsCleaning = true;
        this._myHitCounter = 0;

        //Setup
        this._myStartDistance = 20;
        this._myTimeToReachTarget = 5;
    }

    start() {
        this._myMrNOTClones = [];
        this._myTimer = new PP.Timer(3);

        this._myIsCleaning = false;
        this._myHitCounter = 0;

        this._startAngle = Math.pp_random(160, 200);
        this._myFirst = true;
        this._mySignChange = Math.pp_randomInt(1, 3);
        this._mySign = Math.pp_randomSign();
    }

    update(dt) {
        if (!this._myIsCleaning) {
            this._myTimer.update(dt);
            if (this._myTimer.isDone()) {
                if (this._myVentSetup == 1) {
                    this._myTimer.start(Math.pp_random(1, 2.5));
                } else {
                    this._myTimer.start(Math.pp_random(1.5, 3.5));
                }

                let angle = this._startAngle;

                if (this._myFirst) {
                    this._myFirst = false;
                } else {
                    if (this._myVentSetup == 1) {
                        angle = this._startAngle + Math.pp_random(20, 75) * this._mySign;
                    } else {
                        angle = this._startAngle + Math.pp_random(20, 55) * this._mySign;
                    }
                }

                let direction = [0, 0, 1];
                direction.vec3_rotateAxis([0, 1, 0], angle, direction);
                direction.vec3_normalize(direction);
                direction.vec3_scale(this._myStartDistance, direction);

                let mrNOTClone = new MrNOTClone(direction.vec3_add([0, 2.5, 0]), [0, 1.7, 0], this._myTimeToReachTarget, this._mrNOTCloneHitByYou.bind(this), this._mrNOTCloneReachYou.bind(this));
                this._myMrNOTClones.push(mrNOTClone);

                this._startAngle = angle;

                this._mySignChange--;
                if (this._mySignChange == 0) {
                    this._mySignChange = Math.pp_randomInt(1, 3);
                    this._mySign = Math.pp_randomSign();

                }
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
        this._myIsCleaning = true;

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

        let maxCounter = 15;
        if (this._myVentSetup == 1) {
            maxCounter = 25;
        }

        if (this._myHitCounter > maxCounter) {
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