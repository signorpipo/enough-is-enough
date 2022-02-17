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
        this.myTimeBeforeStart = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myDiscardOutsideValidAngle = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.myRefDirection = null;
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new IAmHereWave(ventRuntimeSetup, this, timeElapsed, refDirection);
    }

    getAverageClonesCount(timeElapsed) {
        return this.myClonesCount.getAverage(timeElapsed);
    }
}

class IAmHereWave {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentRuntimeSetup = ventRuntimeSetup;

        this._myTotalClonesCount = this._myWaveSetup.myClonesCount.get(timeElapsed);
        this._myClonesCount = this._myTotalClonesCount;
        this._mySpawnConeAngle = this._myWaveSetup.mySpawnConeAngle.get(timeElapsed);
        this._myMinAngleBetweenClones = this._myWaveSetup.myMinAngleBetweenClones.get(timeElapsed);
        this._myPreviousAngle = 0;

        this._mySameTimeBetweenClones = waveSetup.mySameTimeBetweenClones.get(timeElapsed) >= 0;

        this._myDiscardOutsideValidAngle = waveSetup.myDiscardOutsideValidAngle.get(timeElapsed) >= 0;

        if (refDirection == null) {
            this._myRefDirectionParams = Global.myPlayerForward.pp_clone();
        } else {
            this._myRefDirectionParams = refDirection.pp_clone();
        }

        let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
        this._myTimeBetweenClones = this._myWaveSetup.myTimeBetweenClones.get(this._myGameTimeElapsed) * spawnTimeMultiplier;

        this._mySpawnTimer = new PP.Timer(this._myWaveSetup.myTimeBeforeStart.get(this._myGameTimeElapsed) * spawnTimeMultiplier);
        let doneTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.myDoneTimeMultiplier.get(this._myGameTimeElapsed);
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed) * doneTimeMultiplier, false);

        this._myFirst = true;
        this._myLastSign = null;

        this._myOneCloneSetupValid = false;
        this._myLastValidSpawnTimer = this._mySpawnTimer.getDuration();

        this._myFirstUpdate = true;

        this._myDuration = 0;
        this._myActualClonesCount = 0;
    }

    update(dt) {
        if (this.isDone()) {
            return [];
        }

        this._myDuration += dt;

        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._computeWaveStartDirection(this._myRefDirectionParams);
        }

        let cloneSetups = [];

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {

                if (this._myClonesCount > 0) {
                    cloneSetups = this._createCloneSetups();

                    if (cloneSetups.length > 0) {
                        this._myClonesCount -= 1;
                    }

                    cloneSetups.pp_removeAll(element => element == null);

                    if (cloneSetups.length > 0) {
                        this._myOneCloneSetupValid = true;
                    }
                }

                if (this._myClonesCount <= 0) {
                    if (this._myOneCloneSetupValid) {
                        if (cloneSetups.length > 0) {
                            this._myDoneDelayTimer.start();
                        } else {
                            this._myDoneDelayTimer.start(this._myDoneDelayTimer.getDuration() - this._myLastValidSpawnTimer);
                        }
                    } else {
                        this._myDoneDelayTimer.start(0);
                    }
                } else {
                    if (cloneSetups.length > 0) {
                        this._mySpawnTimer.start(this._myTimeBetweenClones);
                        if (!this._mySameTimeBetweenClones) {
                            let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
                            this._myTimeBetweenClones = this._myWaveSetup.myTimeBetweenClones.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
                        }
                        this._myLastValidSpawnTimer = this._mySpawnTimer.getDuration();
                    } else {
                        this._mySpawnTimer.start(0);
                    }
                }
            }
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        }

        this._myActualClonesCount += cloneSetups.length;

        return cloneSetups;
    }

    getDuration() {
        return this._myDuration;
    }

    getActualClonesCount() {
        return this._myActualClonesCount;
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

            let angleValid = false;
            let startDirection = [];
            while (attempts > 0) {
                if (this._myLastSign != null) {
                    angle = Math.pp_random(0, this._mySpawnConeAngle) * -this._myLastSign;
                } else {
                    angle = Math.pp_random(0, this._mySpawnConeAngle) * Math.pp_randomSign();
                }
                if (Math.pp_angleDistance(angle, this._myPreviousAngle) >= this._myMinAngleBetweenClones || this._myFirst) {
                    this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0], startDirection);
                    angleValid = this._checkDirectionValid(startDirection);

                    if (angleValid) {
                        attempts = 0;
                    }
                }
                attempts--;
            }

            if (this._myLastSign == null) {
                this._myLastSign = Math.pp_sign(angle);
            } else {
                this._myLastSign *= -1;
            }

            direction = this._myWaveStartDirection.pp_clone();
            direction.vec3_rotateAxis(angle, [0, 1, 0], direction);
            direction.vec3_normalize(direction);
            this._myPreviousAngle = angle;

            this._myFirst = false;
        }

        let tempCloneSetups = this._createCloneSetupsWithDirection(direction);

        for (let cloneSetup of tempCloneSetups) {
            if (cloneSetup != null && (!this._myDiscardOutsideValidAngle || this._checkVentAngleValid(cloneSetup.myDirection))) {
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
        for (let range of this._myVentRuntimeSetup.myValidAngleRanges) {
            let angle = direction.vec3_angleSigned(range[1], [0, 1, 0]);
            if (range[0].isInsideAngle(angle, Global.myVentDuration)) {
                angleValid = true;
                break;
            }
        }

        return angleValid;
    }

    _checkDirectionValid(direction) {
        return this._checkVentAngleValid(direction);
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

        let startDirection = [];
        while (attempts > 0 && !angleValid) {
            this._myWaveStartAngle = this._myWaveSetup.myWaveStartAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
            flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0], startDirection);
            angleValid = this._checkDirectionValid(startDirection);

            attempts--;
        }

        this._myWaveStartDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
        this._myWaveStartDirection.vec3_normalize(this._myWaveStartDirection);
    }
}