class GiveUsAHugSetup extends IAmHereWaveSetup {
    constructor() {
        super();

        this.myHugSize = new RangeValueOverTime([2, 2], [2, 2], 0, 0, true);
        this.myHugAngle = new RangeValueOverTime([40, 40], [40, 40], 0, 0, false);
        this.mySameHugAngle = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.mySameHugSize = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.myHugClonesSameDistance = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myMinAngleBetweenClonesHugging = new RangeValueOverTime([30, 30], [30, 30], 0, 0, false);
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new GiveUsAHug(ventRuntimeSetup, this, timeElapsed, refDirection);
    }

    getAverageClonesCount(timeElapsed) {
        return this.myClonesCount.getAverage(timeElapsed) * this.myHugSize.getAverage(timeElapsed);
    }

    getPrecomputed(timeElapsed) {
        let setup = new GiveUsAHugSetup();

        setup.myClonesCount = this.myClonesCount.get(timeElapsed);
        setup.mySpawnConeAngle = this.mySpawnConeAngle.get(timeElapsed);
        setup.myMinAngleBetweenClones = this.myMinAngleBetweenClones.get(timeElapsed);
        setup.myWaveStartAngle = this.myWaveStartAngle.get(timeElapsed);
        setup.mySameTimeBetweenClones = this.mySameTimeBetweenClones.get(timeElapsed);
        if (setup.mySameTimeBetweenClones >= 0) {
            setup.myTimeBetweenClones = this.myTimeBetweenClones.get(timeElapsed);
        } else {
            setup.myTimeBetweenClones = this.myTimeBetweenClones;
        }

        setup.myFirstCloneInTheMiddle = this.myFirstCloneInTheMiddle;
        setup.myDoneDelay = this.myDoneDelay.get(timeElapsed);
        setup.myTimeBeforeStart = this.myTimeBeforeStart.get(timeElapsed);

        setup.myDiscardOutsideValidAngle = this.myDiscardOutsideValidAngle.get(timeElapsed);

        setup.myRefDirection = this.myRefDirection;

        setup.mySameHugAngle = this.mySameHugAngle.get(timeElapsed);
        if (setup.mySameHugAngle >= 0) {
            setup.myHugAngle = this.myHugAngle.get(timeElapsed);
        } else {
            setup.myHugAngle = this.myHugAngle;
        }
        setup.mySameHugSize = this.mySameHugSize.get(timeElapsed);
        if (setup.mySameHugSize >= 0) {
            setup.myHugSize = this.myHugSize.get(timeElapsed);
        } else {
            setup.myHugSize = this.myHugSize;
        }

        setup.myHugClonesSameDistance = this.myHugClonesSameDistance.get(timeElapsed);
        setup.myMinAngleBetweenClonesHugging = this.myMinAngleBetweenClonesHugging.get(timeElapsed);

        return setup;
    }
}

class GiveUsAHug extends IAmHereWave {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);

        this._myHugSize = waveSetup.myHugSize.get(timeElapsed);
        this._myHugAngle = waveSetup.myHugAngle.get(timeElapsed);
        this._mySameHugAngle = waveSetup.mySameHugAngle.get(timeElapsed) >= 0;
        this._mySameHugSize = waveSetup.mySameHugSize.get(timeElapsed) >= 0;
        this._myHugClonesSameDistance = waveSetup.myHugClonesSameDistance.get(timeElapsed) >= 0;
        this._myMinAngleBetweenClonesHugging = waveSetup.myMinAngleBetweenClonesHugging.get(timeElapsed);
    }

    getAverageClonesCount() {
        return this._myTotalClonesCount * this._myHugSize;
    }

    _createCloneSetupsWithDirection(direction) {
        let cloneSetups = [];

        if (this._myHugClonesSameDistance) {
            let totalAngle = this._myHugAngle * 2;
            let sliceAngle = totalAngle / (this._myHugSize - 1);

            let startAngle = -this._myHugAngle;

            for (let i = 0; i < this._myHugSize; i++) {
                let angle = startAngle + sliceAngle * i;

                let cloneSetup = new MrNOTCloneSetup();
                cloneSetup.myDirection = direction.pp_clone();
                cloneSetup.myDirection.vec3_rotateAxis(angle, [0, 1, 0], cloneSetup.myDirection);
                if (this._areFarEnough(cloneSetup, cloneSetups)) {
                    cloneSetups.push(cloneSetup);
                } else {
                    cloneSetups.push(null);
                }
            }
        } else {
            let previousAngles = [];
            for (let i = 0; i < this._myHugSize; i++) {
                let attempts = 100;
                let angle = 0;

                let startDirection = [];
                while (attempts > 0) {
                    angle = Math.pp_random(0, this._myHugAngle) * Math.pp_randomSign();
                    let angleValid = true;

                    for (let previousAngle of previousAngles) {
                        if (Math.pp_angleDistance(angle, previousAngle) < this._myMinAngleBetweenClonesHugging) {
                            angleValid = false;
                            break;
                        }
                    }

                    if (angleValid) {
                        direction.vec3_rotateAxis(angle, [0, 1, 0], startDirection);
                        angleValid = this._checkVentAngleValid(startDirection);

                        if (angleValid) {
                            attempts = 0;
                        }
                    }

                    attempts--;
                }

                previousAngles.push(angle);

                let cloneSetup = new MrNOTCloneSetup();
                cloneSetup.myDirection = direction.pp_clone();
                cloneSetup.myDirection.vec3_rotateAxis(angle, [0, 1, 0], cloneSetup.myDirection);
                if (this._areFarEnough(cloneSetup, cloneSetups)) {
                    cloneSetups.push(cloneSetup);
                } else {
                    cloneSetups.push(null);
                }
            }
        }

        if (!this._mySameHugAngle) {
            this._myHugAngle = this._myWaveSetup.myHugAngle.get(this._myGameTimeElapsed);
        }

        if (!this._mySameHugSize) {
            this._myHugSize = this._myWaveSetup.myHugSize.get(this._myGameTimeElapsed);
        }

        return cloneSetups;
    }

    _areFarEnough(cloneSetupToTest, cloneSetups) {
        let valid = true;
        for (let cloneSetup of cloneSetups) {
            if (cloneSetup != null && cloneSetup.myDirection.vec3_angle(cloneSetupToTest.myDirection) < this._myMinAngleBetweenClonesHugging) {
                valid = false;
                break;
            }
        }

        return valid;
    }

    _checkDirectionValid(direction) {
        let isValid = true;

        if (this._myHugClonesSameDistance) {
            let totalAngle = this._myHugAngle * 2;
            let sliceAngle = totalAngle / (this._myHugSize - 1);

            let startAngle = -this._myHugAngle;

            let cloneDirection = direction.pp_clone();
            for (let i = 0; i < this._myHugSize; i++) {
                let angle = startAngle + sliceAngle * i;

                cloneDirection.pp_copy(direction);
                cloneDirection.vec3_rotateAxis(angle, [0, 1, 0], cloneDirection);
                if (!this._checkVentAngleValid(cloneDirection)) {
                    isValid = false;
                    break;
                }
            }
        } else {
            isValid = super._checkDirectionValid(direction);
        }

        return isValid;
    }
}