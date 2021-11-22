class Vent {
    constructor() {


        this._myMrNOTClones = [];

        //Setup
        this._myStartDistance = 20;
        this._myTimeToReachTarget = 5;
    }

    start() {
        this._myMrNOTClones = [];
        this._myTimer = new PP.Timer(1);
    }

    update(dt) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            this._myTimer.start(1);

            let angle = Math.pp_random(0, 360);
            let direction = [0, 0, 1];
            direction.vec3_rotateAxis([0, 1, 0], angle, direction);
            direction.vec3_normalize(direction);
            direction.vec3_scale(this._myStartDistance, direction);

            let mrNOTClone = new MrNOTClone(direction.vec3_add([0, 2.5, 0]), [0, 1.7, 0], this._myTimeToReachTarget);
            this._myMrNOTClones.push(mrNOTClone);
        }

        for (let clone of this._myMrNOTClones) {
            clone.update(dt);
        }

        this._myMrNOTClones.pp_removeAll(element => element.isDone());
    }

    stop() {
        for (let clone of this._myMrNOTClones) {
            clone.destroy();
        }
        this._myMrNOTClones = [];
    }
}