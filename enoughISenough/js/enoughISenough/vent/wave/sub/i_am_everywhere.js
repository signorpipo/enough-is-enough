class IAmEverywhereWaveSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new IAmEverywhereWave(ventRuntimeSetup, this, timeElapsed, refDirection);
    }
}

class IAmEverywhereWave extends WaveOfWaves {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);

        this._myCurrentDirection = this._myWaveStartDirection.pp_clone();
        this._myFirst = true;
    }

    _createNextWaves() {
        let waves = [];

        if (!this._myFirst) {
            let angle = 0;
            let attempts = 100;

            let startDirection = [];
            while (attempts > 0) {
                angle = this._myWaveSetup.myAngleBetweenWaves.get(this._myGameTimeElapsed) * Math.pp_randomSign();

                this._myCurrentDirection.vec3_rotateAxis(angle, [0, 1, 0], startDirection);
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

        waves.push(this._getWaveSetup().createWave(this._myVentRuntimeSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}