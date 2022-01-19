class IAmEverywhereWaveSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myMinAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myFirstWaveAngle = new RangeValue([0, 180]);
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new IAmEverywhereWave(ventSetup, this, timeElapsed, refDirection);
    }
}

class IAmEverywhereWave extends WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);

        this._myWaveAngle = new RangeValue([0, 180]);
        this._myMinAngleBetweenWaves = this._myWaveSetup.myMinAngleBetweenWaves.get(timeElapsed);
        this._myPreviousAngle = 0;

        this._myFirst = true;
    }

    _createNextWaves() {
        let waves = [];

        let angle = 0;

        let attempts = 100;

        while (attempts > 0) {
            if (this._myFirst) {
                angle = this._myWaveSetup.myFirstWaveAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
            } else {
                angle = this._myWaveAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
            }

            if (Math.pp_angleDistance(angle, this._myPreviousAngle) >= this._myMinAngleBetweenWaves || this._myFirst) {
                let startDirection = this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0]);
                let angleToCheck = -startDirection.vec3_angleSigned([0, 0, 1], [0, 1, 0]);
                let angleValid = false;

                for (let range of this._myVentSetup.myValidAngleRangeList) {
                    if (angleToCheck >= range[0] && angleToCheck <= range[1]) {
                        angleValid = true;
                        break;
                    }
                }

                if (angleValid) {
                    attempts = 0;
                }
            }

            attempts--;
        }

        this._myFirst = false;

        this._myPreviousAngle = angle;

        let direction = this._myWaveStartDirection.vec3_rotateAxis(angle, [0, 1, 0]);
        direction.vec3_normalize(direction);

        waves.push(this._getWaveSetup().createWave(this._myVentSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}