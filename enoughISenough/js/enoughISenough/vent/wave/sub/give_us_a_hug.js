class GiveUsAHugSetup extends IAmHereWaveSetup {
    constructor() {
        super();

        this.myHugSize = new RangeValueOverTime([2, 2], [2, 2], 0, 0, true);
        this.myHugAngle = new RangeValueOverTime([40, 40], [40, 40], 0, 0, false);
        this.mySameHugAngle = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.mySameHugSize = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.myEqualDistance = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myMinAngleBetweenClonesHugging = new RangeValueOverTime([10, 10], [10, 10], 0, 0, false);
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new GiveUsAHug(ventSetup, this, timeElapsed, refDirection);
    }

    getAverageClonesCount(timeElapsed) {
        return this.myClonesCount.getAverage(timeElapsed) * this.myHugSize.getAverage(timeElapsed);
    }
}

class GiveUsAHug extends IAmHereWave {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myHugSize = waveSetup.myHugSize.get(timeElapsed);
        this._myHugAngle = waveSetup.myHugAngle.get(timeElapsed);
        this._mySameHugAngle = waveSetup.mySameHugAngle.get(timeElapsed) >= 0;
        this._mySameHugSize = waveSetup.mySameHugSize.get(timeElapsed) >= 0;
        this._myEqualDistance = waveSetup.myEqualDistance.get(timeElapsed) >= 0;
        this._myMinAngleBetweenClonesHugging = waveSetup.myMinAngleBetweenClonesHugging.get(timeElapsed);
    }

    getAverageClonesCount() {
        return this._myTotalClonesCount * this._myHugSize;
    }

    _createCloneSetupsWithDirection(direction) {
        let cloneSetups = [];

        if (this._myEqualDistance) {
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
                        attempts = 0;
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
            if (cloneSetup.myDirection.vec3_angle(cloneSetupToTest.myDirection) < this._myMinAngleBetweenClonesHugging) {
                valid = false;
                break;
            }
        }

        return valid;
    }

}