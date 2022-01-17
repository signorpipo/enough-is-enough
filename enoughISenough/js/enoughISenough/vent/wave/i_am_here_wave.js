class IAmHereWaveSetup {
    constructor() {
        this.myClonesCount = new RangeValueOverTime([1, 1], [1, 1], 0, 0, true);
        this.myWaveAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myMinAngleBetweenClones = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myWaveStartAngleDisplacement = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBetweenClones = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myFirstCloneInTheMiddle = true;
        this.myDoneDelay = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    }

    createWave(ventSetup, timeElapsed) {
        return new IAmHereWave(ventSetup, this, timeElapsed);
    }
}

class IAmHereWave {
    constructor(ventSetup, waveSetup, timeElapsed) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentSetup = ventSetup;

        this._myClonesCount = this._myWaveSetup.myClonesCount.get(timeElapsed);
        this._myWaveAngle = this._myWaveSetup.myWaveAngle.get(timeElapsed);
        this._myMinAngleBetweenClones = this._myWaveSetup.myMinAngleBetweenClones.get(timeElapsed);
        this._myPreviousAngle = 0;

        this._computeWaveStartDirection();

        this._mySpawnTimer = new PP.Timer(0);
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed), false);

        this._myFirst = this._myWaveSetup.myFirstCloneInTheMiddle;
        this._myLastSign = Math.pp_randomSign();
    }

    update(dt) {
        if (this.isDone()) {
            return [];
        }

        let cloneSetups = [];

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                cloneSetups = this._createCloneSetups();
                this._myClonesCount -= cloneSetups.length;

                if (this._myClonesCount <= 0) {
                    this._myDoneDelayTimer.start();
                } else {
                    this._mySpawnTimer.start(this._myWaveSetup.myTimeBetweenClones.get(this._myGameTimeElapsed));
                }
            }
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        }

        return cloneSetups;
    }

    isDone() {
        return this._myClonesCount <= 0 && this._myDoneDelayTimer.isDone();
    }

    _createCloneSetups() {
        let cloneSetups = [];

        if (this._myFirst) {
            this._myFirst = false;
            let cloneSetup = new MrNOTCloneSetup();
            cloneSetup.myDirection = this._myWaveStartDirection.pp_clone();

            cloneSetups.push(cloneSetup);
        } else {
            let cloneSetup = new MrNOTCloneSetup();
            cloneSetup.myDirection = this._myWaveStartDirection.pp_clone();

            let attempts = 100;
            let angle = 0;

            while (attempts > 0) {
                angle = Math.pp_random(0, this._myWaveAngle) * -this._myLastSign;
                if (Math.abs(angle - this._myPreviousAngle) > this._myMinAngleBetweenClones) {
                    attempts = 0;
                }
                attempts--;
            }

            cloneSetup.myDirection.vec3_rotateAxis(angle, [0, 1, 0], cloneSetup.myDirection);
            this._myLastSign *= -1;
            this._myPreviousAngle = angle;

            cloneSetups.push(cloneSetup);
        }

        return cloneSetups;
    }

    _computeWaveStartDirection() {
        let attempts = 100;
        let angleValid = false;

        let referenceDirection = Global.myPlayerForward.vec3_removeComponentAlongAxis([0, 1, 0]);
        referenceDirection.vec3_rotateAxis(this._myWaveSetup.myWaveStartAngleDisplacement.get(this._myGameTimeElapsed), [0, 1, 0], referenceDirection);

        while (attempts > 0 && !angleValid) {
            this._myWaveStartAngle = this._myWaveSetup.myWaveStartAngle.get(this._myGameTimeElapsed);
            let startDirection = referenceDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
            let angle = -startDirection.vec3_angleSigned([0, 0, 1], [0, 1, 0]);
            for (let range of this._myVentSetup.myValidAngleRangeList) {
                if (angle >= range[0] && angle <= range[1]) {
                    angleValid = true;
                    break;
                }
            }

            attempts--;
        }

        this._myWaveStartDirection = referenceDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
    }
}