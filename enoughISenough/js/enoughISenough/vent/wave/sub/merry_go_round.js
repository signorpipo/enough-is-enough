class MerryGoRoundSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myWaveDirection = null;
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new MerryGoRound(ventSetup, this, timeElapsed, refDirection);
    }
}

class MerryGoRound extends WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myWaveDirection = Math.pp_randomSign();
        if (this._myWaveSetup.myWaveDirection != null) {
            this._myWaveDirection = (this._myWaveSetup.myWaveDirection >= 0) ? 1 : -1;
        }

        this._myPreviousAngle = 0;
        this._myFirst = true;
    }

    _createNextWaves() {
        let waves = [];

        let angle = 0;

        if (!this._myFirst) {
            angle = this._myPreviousAngle + this._myWaveSetup.myAngleBetweenWaves.get(this._myGameTimeElapsed) * this._myWaveDirection;
        } else {
            this._myFirst = false;
        }

        let maxAttempts = 200;
        let attempts = maxAttempts;

        while (attempts > 0) {
            let startDirection = this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0]);
            let angleValid = this._checkVentAngleValid(startDirection);

            if (angleValid) {
                attempts = 0;
            } else {
                angle += (360 / maxAttempts) * this._myWaveDirection;
            }

            attempts--;
        }

        this._myPreviousAngle = angle;

        let direction = this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0]);
        direction.vec3_normalize(direction);

        waves.push(this._getWaveSetup().createWave(this._myVentSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}