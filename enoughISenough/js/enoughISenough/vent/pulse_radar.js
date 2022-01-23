class PulseRadar {
    constructor() {
        this._myPulseIntensity = 0.35;

        this._myDownDuration = 1.5;
        this._myPulseDuration = 0.35;

        this._myMinAngle = 45;
        this._myBehindMinAngle = 160;

        this._myLeftPulseDownTimer = new PP.Timer(this._myDownDuration, false);
        this._myLeftPulseActiveTimer = new PP.Timer(this._myPulseDuration, false);
        this._myRightPulseDownTimer = new PP.Timer(this._myDownDuration, false);
        this._myRightPulseActiveTimer = new PP.Timer(this._myPulseDuration, false);

        this._myPositionsDelayed = [];
    }

    start() {
        this._myLeftPulseDownTimer.reset();
        this._myLeftPulseActiveTimer.reset();
        this._myRightPulseDownTimer.reset();
        this._myRightPulseActiveTimer.reset();
    }

    addSignal(position) {
        this._myPositionsDelayed.push([position.pp_clone(), 0.35]);
    }

    update(dt) {
        for (let positionDelayed of this._myPositionsDelayed) {
            positionDelayed[1] -= dt;
            if (positionDelayed[1] < 0) {
                this._addSignal(positionDelayed[0]);
            }
        }
        this._myPositionsDelayed.pp_removeAll(element => element[1] < 0);

        this._myLeftPulseDownTimer.update(dt);
        this._myRightPulseDownTimer.update(dt);

        if (this._myLeftPulseActiveTimer.isRunning()) {
            this._myLeftPulseActiveTimer.update(dt);
            PP.myLeftGamepad.pulse(this._myPulseIntensity, 0);
            if (this._myLeftPulseActiveTimer.isDone()) {
                this._myLeftPulseDownTimer.start();
            }
        }

        if (this._myRightPulseActiveTimer.isRunning()) {
            this._myRightPulseActiveTimer.update(dt);
            PP.myRightGamepad.pulse(this._myPulseIntensity, 0);
            if (this._myRightPulseActiveTimer.isDone()) {
                this._myRightPulseDownTimer.start();
            }
        }
    }

    _addSignal(position) {
        let playerDirection = position.vec3_sub(Global.myPlayerPosition);
        playerDirection.vec3_removeComponentAlongAxis([0, 1, 0], playerDirection);
        let flatPlayerForward = Global.myPlayerForward.vec3_removeComponentAlongAxis([0, 1, 0]);

        let angleSigned = flatPlayerForward.vec3_angleSigned(playerDirection, [0, 1, 0]);
        if (angleSigned >= this._myBehindMinAngle || angleSigned <= -this._myBehindMinAngle) {
            if (!this._myLeftPulseActiveTimer.isRunning() && !this._myLeftPulseDownTimer.isRunning()) {
                this._myLeftPulseActiveTimer.start();
                this._myRightPulseActiveTimer.start();
            } else if (!this._myRightPulseActiveTimer.isRunning() && !this._myRightPulseDownTimer.isRunning()) {
                this._myLeftPulseActiveTimer.start();
                this._myRightPulseActiveTimer.start();
            }
        } else if (angleSigned >= this._myMinAngle) {
            if (!this._myLeftPulseActiveTimer.isRunning() && !this._myLeftPulseDownTimer.isRunning()) {
                this._myLeftPulseActiveTimer.start();
            }
        } else if (angleSigned <= -this._myMinAngle) {
            if (!this._myRightPulseActiveTimer.isRunning() && !this._myRightPulseDownTimer.isRunning()) {
                this._myRightPulseActiveTimer.start();
            }
        }
    }
}