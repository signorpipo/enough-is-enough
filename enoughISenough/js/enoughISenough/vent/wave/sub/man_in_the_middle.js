class ManInTheMiddleSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myTimeBeforeOpposite = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new ManInTheMiddle(ventSetup, this, timeElapsed, refDirection);
    }
}

class ManInTheMiddle extends WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myWavesCount *= 2;
        this._myWaveAngle = new RangeValue([0, 80]);

        this._myFirst = true;

        this._myCurrentDirection = this._myWaveStartDirection;
        this._myIsOpposite = false;
    }

    _getSpawnTimer() {
        if (!this._myIsOpposite) {
            return super._getSpawnTimer();
        }

        return this._myWaveSetup.myTimeBeforeOpposite.get(this._myGameTimeElapsed);
    }

    _createNextWaves() {
        let waves = [];

        if (!this._myFirst) {
            if (!this._myIsOpposite) {
                let attempts = 100;
                let angle = 0;

                while (attempts > 0) {
                    angle = this._myWaveAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
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

        let direction = this._myCurrentDirection;
        if (this._myIsOpposite) {
            direction = direction.vec3_negate();
        }

        this._myIsOpposite = !this._myIsOpposite;

        waves.push(this._getWaveSetup().createWave(this._myVentSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}