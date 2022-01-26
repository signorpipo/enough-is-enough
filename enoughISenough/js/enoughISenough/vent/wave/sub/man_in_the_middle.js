class ManInTheMiddleSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBeforeOpposite = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameOppositeTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myOppositeTimeAsTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true

        this.mySameTimeBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new ManInTheMiddle(ventSetup, this, timeElapsed, refDirection);
    }
}

class ManInTheMiddle extends WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myWavesCount *= 2;
        this._myOppositeTimeAsTimeBetweenWaves = waveSetup.myOppositeTimeAsTimeBetweenWaves.get(timeElapsed) >= 0;
        this._mySameOppositeTimeBetweenWaves = waveSetup.mySameOppositeTimeBetweenWaves.get(timeElapsed) >= 0;
        this._myTimeBeforeOpposite = this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed);
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
                this._myTimeBeforeOpposite = this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed);
            }
        }

        return this._myTimeBeforeOpposite;
    }

    _createNextWaves() {
        let waves = [];

        if (!this._myFirst) {
            if (!this._myIsOpposite) {
                let angle = 0;
                let attempts = 100;

                while (attempts > 0) {
                    angle = this._myWaveSetup.myAngleBetweenWaves.get(this._myGameTimeElapsed) * Math.pp_randomSign();
                    let direction = this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0]);
                    if (this._checkVentAngleValid(direction)) {
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

        waves.push(this._getWaveSetup().createWave(this._myVentSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}