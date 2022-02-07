class ManInTheMiddleSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBeforeOpposite = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameOppositeTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myOppositeTimeAsTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.mySameTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new ManInTheMiddle(ventRuntimeSetup, this, timeElapsed, refDirection);
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

        if (!this._mySameOppositeTimeBetweenWaves) {
            if (this._myOppositeTimeAsTimeBetweenWaves) {
                this._myTimeBeforeOpposite = this._myTimeBetweenWaves;
            } else {
                let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
                this._myTimeBeforeOpposite = this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
            }
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