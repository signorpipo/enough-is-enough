class IAmHereWaveSetup {
    constructor() {
        this.myClonesCount = new RangeValueOverTime([1, 1], [1, 1], 0, 0, true);
        this.mySpawnConeAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myMinAngleBetweenClones = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBetweenClones = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameTimeBetweenClones = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.myFirstCloneInTheMiddle = true;
        this.myDoneDelay = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myRefDirection = null;
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new IAmHereWave(ventSetup, this, timeElapsed, refDirection);
    }

    getAverageClonesCount(timeElapsed) {
        return this.myClonesCount.getAverage(timeElapsed);
    }
}

class IAmHereWave {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentSetup = ventSetup;

        this._myTotalClonesCount = this._myWaveSetup.myClonesCount.get(timeElapsed);
        this._myClonesCount = this._myTotalClonesCount;
        this._mySpawnConeAngle = this._myWaveSetup.mySpawnConeAngle.get(timeElapsed);
        this._myMinAngleBetweenClones = this._myWaveSetup.myMinAngleBetweenClones.get(timeElapsed);
        this._myPreviousAngle = 0;

        this._mySameTimeBetweenClones = waveSetup.mySameTimeBetweenClones.get(timeElapsed) >= 0;

        this._computeWaveStartDirection(refDirection);

        this._myTimeBetweenClones = this._myWaveSetup.myTimeBetweenClones.get(this._myGameTimeElapsed);
        this._mySpawnTimer = new PP.Timer(0);
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed), false);

        this._myFirst = true;
        this._myLastSign = Math.pp_randomSign();
        this._myOneCloneSetupValid = false;
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

                cloneSetups.pp_removeAll(element => element == null);

                if (cloneSetups.length > 0) {
                    this._myOneCloneSetupValid = true;
                }

                if (this._myClonesCount <= 0) {
                    if (this._myOneCloneSetupValid) {
                        if (cloneSetups.length > 0) {
                            this._myDoneDelayTimer.start();
                        } else {
                            this._myDoneDelayTimer.start(this._myDoneDelayTimer.getDuration() - this._mySpawnTimer.getDuration());
                        }
                    } else {
                        this._myDoneDelayTimer.start(0);
                    }
                } else {
                    if (cloneSetups.length > 0) {
                        this._mySpawnTimer.start(this._myTimeBetweenClones);
                        if (!this._mySameTimeBetweenClones) {
                            this._myTimeBetweenClones = this._myWaveSetup.myTimeBetweenClones.get(this._myGameTimeElapsed);
                        }
                    } else {
                        this._mySpawnTimer.start(0);
                    }
                }
            }
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        }

        return cloneSetups;
    }

    getAverageClonesCount() {
        return this._myTotalClonesCount;
    }

    isDone() {
        return this._myDoneDelayTimer.isDone();
    }

    _createCloneSetups() {
        let cloneSetups = [];

        let direction = null;

        if (this._myFirst && this._myWaveSetup.myFirstCloneInTheMiddle) {
            this._myFirst = false;
            direction = this._myWaveStartDirection.pp_clone();
            direction.vec3_normalize(direction);

            this._myPreviousAngle = 0;
        } else {

            let attempts = 100;
            let angle = 0;

            while (attempts > 0) {
                angle = Math.pp_random(0, this._mySpawnConeAngle) * -this._myLastSign;
                if (Math.pp_angleDistance(angle, this._myPreviousAngle) >= this._myMinAngleBetweenClones || this._myFirst) {
                    let startDirection = this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0]);
                    let angleValid = this._checkVentAngleValid(startDirection);

                    if (angleValid) {
                        attempts = 0;
                    }
                }
                attempts--;
            }

            direction = this._myWaveStartDirection.pp_clone();
            direction.vec3_rotateAxis(angle, [0, 1, 0], direction);
            direction.vec3_normalize(direction);
            this._myLastSign *= -1;
            this._myPreviousAngle = angle;

            this._myFirst = false;
        }

        let tempCloneSetups = this._createCloneSetupsWithDirection(direction);

        for (let cloneSetup of tempCloneSetups) {
            if (cloneSetup != null && this._checkVentAngleValid(cloneSetup.myDirection)) {
                cloneSetups.push(cloneSetup);
            } else {
                cloneSetups.push(null);
            }
        }

        return cloneSetups;
    }

    _createCloneSetupsWithDirection(direction) {
        let cloneSetups = [];

        let cloneSetup = new MrNOTCloneSetup();
        cloneSetup.myDirection = direction;

        cloneSetups.push(cloneSetup);

        return cloneSetups;
    }

    _checkVentAngleValid(direction) {
        let angleValid = false;
        let angle = direction.vec3_angleSigned([0, 0, -1], [0, 1, 0]);
        for (let range of this._myVentSetup.myValidAngleRanges) {
            if (range.isInside(angle, this._myGameTimeElapsed)) {
                angleValid = true;
                break;
            }
        }

        return angleValid;
    }

    _computeWaveStartDirection(refDirection) {
        if (this._myWaveSetup.myRefDirection != null) {
            refDirection = this._myWaveSetup.myRefDirection;
        } else if (refDirection == null) {
            refDirection = Global.myPlayerForward;
        }

        let attempts = 100;
        let angleValid = false;

        let flatRefDirection = refDirection.vec3_removeComponentAlongAxis([0, 1, 0]);

        while (attempts > 0 && !angleValid) {
            this._myWaveStartAngle = this._myWaveSetup.myWaveStartAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
            let startDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);

            angleValid = this._checkVentAngleValid(startDirection);

            attempts--;
        }

        this._myWaveStartDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
        this._myWaveStartDirection.vec3_normalize(this._myWaveStartDirection);
    }
}