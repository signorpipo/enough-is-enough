class MerryGoRoundSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameAngleBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
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


        this._myAngleBetweenWaves = waveSetup.myAngleBetweenWaves.get(timeElapsed);
        this._mySameAngleBetweenWaves = waveSetup.mySameAngleBetweenWaves.get(timeElapsed) >= 0;

        this._myCurrentDirection = this._myWaveStartDirection.pp_clone();
        this._myFirst = true;
    }

    _createNextWaves() {
        let waves = [];


        if (!this._myFirst) {
            if (!this._mySameAngleBetweenWaves) {
                this._myAngleBetweenWaves = waveSetup.myAngleBetweenWaves.get(timeElapsed);
            }
            let angle = this._myAngleBetweenWaves * this._myWaveDirection;

            let maxAttempts = 200;
            let attempts = maxAttempts;

            while (attempts > 0) {
                let startDirection = this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0]);
                let angleValid = this._checkVentAngleValid(startDirection);

                if (angleValid) {
                    attempts = 0;
                } else {
                    angle += (360 / maxAttempts) * this._myWaveDirection;
                }

                attempts--;
            }

            this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0], this._myCurrentDirection);
        } else {
            this._myFirst = false;
        }

        let direction = this._myCurrentDirection.pp_clone();
        direction.vec3_normalize(direction);

        waves.push(this._getWaveSetup().createWave(this._myVentSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}