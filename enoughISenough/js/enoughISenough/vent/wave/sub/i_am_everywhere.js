class IAmEverywhereWaveSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new IAmEverywhereWave(ventSetup, this, timeElapsed, refDirection);
    }
}

class IAmEverywhereWave extends WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myCurrentDirection = this._myWaveStartDirection.pp_clone();
        this._myFirst = true;
    }

    _createNextWaves() {
        let waves = [];

        if (!this._myFirst) {
            let angle = 0;
            let attempts = 100;

            while (attempts > 0) {
                angle = this._myWaveSetup.myAngleBetweenWaves.get(this._myGameTimeElapsed) * Math.pp_randomSign();

                let startDirection = this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0]);
                let angleValid = this._checkVentAngleValid(startDirection);

                if (angleValid) {
                    attempts = 0;
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