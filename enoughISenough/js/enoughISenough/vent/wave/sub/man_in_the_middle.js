class ManInTheMiddleSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBeforeOpposite = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameOppositeTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myOppositeTimeAsTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.myOppositeTimeLessThanTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myAllSameTimes = null;

        this.mySameTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new ManInTheMiddle(ventRuntimeSetup, this, timeElapsed, refDirection);
    }

    getPrecomputed(timeElapsed) {
        let setup = new ManInTheMiddleSetup();

        setup.myWavesCount = this.myWavesCount.get(timeElapsed);
        setup.mySameTimeBetweenWaves = this.mySameTimeBetweenWaves.get(timeElapsed);
        setup.myDoneDelay = this.myDoneDelay.get(timeElapsed);
        setup.myTimeBeforeStart = this.myTimeBeforeStart.get(timeElapsed);

        setup.myWaveStartAngle = this.myWaveStartAngle.get(timeElapsed);

        setup.myWavesSetup = this.myWavesSetup.pp_clone();
        setup.myWavesSetupPickOne = this.myWavesSetupPickOne.get(timeElapsed);
        setup.myWavesSetupPrecompute = this.myWavesSetupPrecompute.get(timeElapsed);

        setup.myAngleBetweenWaves = this.myAngleBetweenWaves.get(timeElapsed);
        setup.mySameOppositeTimeBetweenWaves = this.mySameOppositeTimeBetweenWaves.get(timeElapsed);
        setup.myOppositeTimeAsTimeBetweenWaves = this.myOppositeTimeAsTimeBetweenWaves.get(timeElapsed);

        setup.myOppositeTimeLessThanTimeBetweenWaves = this.myOppositeTimeLessThanTimeBetweenWaves.get(timeElapsed);

        setup.myAllSameTimes = this.myAllSameTimes;
        if (setup.myAllSameTimes != null) {
            setup.myAllSameTimes = setup.myAllSameTimes.get(timeElapsed);
            if (setup.myAllSameTimes >= 0) {
                setup.myOppositeTimeAsTimeBetweenWaves = 1;
                setup.mySameOppositeTimeBetweenWaves = 1;
                setup.mySameTimeBetweenWaves = 1;
            } else {
                setup.myOppositeTimeAsTimeBetweenWaves = -1;
                setup.mySameOppositeTimeBetweenWaves = -1;
                setup.mySameTimeBetweenWaves = -1;
            }
        }

        if (setup.mySameTimeBetweenWaves >= 0) {
            setup.myTimeBetweenWaves = this.myTimeBetweenWaves.get(timeElapsed);
        } else {
            setup.myTimeBetweenWaves = this.myTimeBetweenWaves;
        }

        if (setup.mySameOppositeTimeBetweenWaves >= 0) {
            setup.myTimeBeforeOpposite = this.myTimeBeforeOpposite.get(timeElapsed);
        } else {
            setup.myTimeBeforeOpposite = this.myTimeBeforeOpposite;
        }

        if (setup.myWavesSetup.length == 0) {
            setup.myWavesSetup.push([new IAmHereWaveSetup(), 1, "I_Am_Here"]);
        }

        if (setup.myWavesSetupPickOne >= 0) {
            setup._pickOneWave(timeElapsed);
        }

        if (setup.myWavesSetupPrecompute >= 0) {
            let wavesSetup = setup.myWavesSetup;
            setup.myWavesSetup = [];
            for (let setup of wavesSetup) {
                setup.myWavesSetup.push([setup[0].getPrecomputed(timeElapsed), setup[1], setup[2]]);
            }
        }

        return setup;
    }
}

class ManInTheMiddle extends WaveOfWaves {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);

        this._myWavesCount *= 2;
        this._myOppositeTimeAsTimeBetweenWaves = waveSetup.myOppositeTimeAsTimeBetweenWaves.get(timeElapsed) >= 0;
        this._mySameOppositeTimeBetweenWaves = waveSetup.mySameOppositeTimeBetweenWaves.get(timeElapsed) >= 0;
        let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
        this._myTimeBeforeOpposite = this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
        this._myOppositeTimeLessThanTimeBetweenWaves = waveSetup.myOppositeTimeLessThanTimeBetweenWaves.get(timeElapsed) >= 0;

        this._myAllSameTimes = null;
        if (waveSetup.myAllSameTimes != null) {
            this._myAllSameTimes = waveSetup.myAllSameTimes.get(timeElapsed) >= 0;
            if (this._myAllSameTimes) {
                this._myOppositeTimeAsTimeBetweenWaves = true;
                this._mySameOppositeTimeBetweenWaves = true;
                this._mySameTimeBetweenWaves = true;
            } else {
                this._myOppositeTimeAsTimeBetweenWaves = false;
                this._mySameOppositeTimeBetweenWaves = false;
                this._mySameTimeBetweenWaves = false;
            }
        }

        if (this._myOppositeTimeAsTimeBetweenWaves) {
            this._myTimeBeforeOpposite = this._myTimeBetweenWaves;
        }

        this._myFirst = true;

        this._myCurrentDirection = this._myWaveStartDirection.pp_clone();
        this._myIsOpposite = false;
    }

    _getSpawnTimer() {
        if (!this._myIsOpposite) {
            return super._getSpawnTimer();
        }

        if (this._myOppositeTimeAsTimeBetweenWaves) {
            this._myTimeBeforeOpposite = this._myTimeBetweenWaves;
        } else if (!this._mySameOppositeTimeBetweenWaves) {
            let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);

            let attempts = 100;
            while (attempts > 0) {
                this._myTimeBeforeOpposite = this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
                if (this._myTimeBeforeOpposite <= this._myTimeBetweenWaves || !this._myOppositeTimeLessThanTimeBetweenWaves) {
                    attempts = 0;
                }
                attempts--;
            }
        }

        if (this._myTimeBeforeOpposite > this._myTimeBetweenWaves && this._myOppositeTimeLessThanTimeBetweenWaves) {
            this._myTimeBeforeOpposite = this._myTimeBetweenWaves;
        }

        return this._myTimeBeforeOpposite;
    }

    _checkVentAngleValid(direction) {
        let angleValid = false;
        let oppositeAngleValid = false;
        for (let range of this._myVentRuntimeSetup.myValidAngleRanges) {
            let angle = direction.vec3_angleSigned(range[1], [0, 1, 0]);
            if (range[0].isInsideAngle(angle, Global.myVentDuration)) {
                angleValid = true;
                break;
            }
        }

        if (angleValid) {
            let negateDirection = direction.vec3_negate();
            for (let range of this._myVentRuntimeSetup.myValidAngleRanges) {
                let oppositeAngle = negateDirection.vec3_angleSigned(range[1], [0, 1, 0]);
                if (range[0].isInsideAngle(oppositeAngle, Global.myVentDuration)) {
                    oppositeAngleValid = true;
                    break;
                }
            }
        }

        return angleValid && oppositeAngleValid;
    }

    _createNextWaves() {
        let waves = [];

        if (!this._myFirst) {
            if (!this._myIsOpposite) {
                let angle = 0;
                let attempts = 100;

                let startDirection = [];
                while (attempts > 0) {
                    angle = this._myWaveSetup.myAngleBetweenWaves.get(this._myGameTimeElapsed) * Math.pp_randomSign();
                    this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0], startDirection);
                    if (this._checkVentAngleValid(startDirection)) {
                        attempts = 0;
                    }

                    attempts--;
                }

                this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0], this._myCurrentDirection);
                this._myCurrentDirection.vec3_normalize(this._myCurrentDirection);
            }
        } else {
            this._myFirst = false;
        }

        let direction = this._myCurrentDirection.pp_clone();
        if (this._myIsOpposite) {
            direction = direction.vec3_negate();
        }

        this._myIsOpposite = !this._myIsOpposite;

        waves.push(this._getWaveSetup().createWave(this._myVentRuntimeSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}