class MerryGoRoundSetup extends WaveOfWavesSetup {
    constructor() {
        super();

        this.myAngleBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameAngleBetweenWaves = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
        this.myWaveDirection = new RangeValueOverTime([-1, 1], [-1, 1], 0, 0, false); // >= 0 means right
        this.myPrecomputeWaveDirection = new RangeValueOverTime([1, 1], [1, 1], 0, 0, false); // >= 0 means true
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new MerryGoRound(ventRuntimeSetup, this, timeElapsed, refDirection);
    }

    getPrecomputed(timeElapsed) {
        let setup = new MerryGoRoundSetup();

        setup.myWavesCount = this.myWavesCount.get(timeElapsed);
        setup.mySameTimeBetweenWaves = this.mySameTimeBetweenWaves.get(timeElapsed);
        if (setup.mySameTimeBetweenWaves >= 0) {
            setup.myTimeBetweenWaves = this.myTimeBetweenWaves.get(timeElapsed);
        } else {
            setup.myTimeBetweenWaves = this.myTimeBetweenWaves;
        }
        setup.myDoneDelay = this.myDoneDelay.get(timeElapsed);
        setup.myTimeBeforeStart = this.myTimeBeforeStart.get(timeElapsed);

        setup.myWaveStartAngle = this.myWaveStartAngle.get(timeElapsed);

        setup.myWavesSetup = this.myWavesSetup.pp_clone();
        setup.myWavesSetupPickOne = this.myWavesSetupPickOne.get(timeElapsed);
        setup.myWavesSetupPrecompute = this.myWavesSetupPrecompute.get(timeElapsed);

        setup.mySameAngleBetweenWaves = this.mySameAngleBetweenWaves.get(timeElapsed);
        if (setup.mySameAngleBetweenWaves >= 0) {
            setup.myAngleBetweenWaves = this.myAngleBetweenWaves.get(timeElapsed);
        } else {
            setup.myAngleBetweenWaves = this.myAngleBetweenWaves;
        }

        setup.myPrecomputeWaveDirection = this.myPrecomputeWaveDirection.get(timeElapsed);
        if (setup.myPrecomputeWaveDirection >= 0) {
            setup.myWaveDirection = this.myWaveDirection.get(timeElapsed);
        } else {
            setup.myWaveDirection = this.myWaveDirection;
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

class MerryGoRound extends WaveOfWaves {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);

        this._myWaveDirection = (this._myWaveSetup.myWaveDirection.get(timeElapsed) >= 0) ? 1 : -1;

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

            let maxAttempts = 0;
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

        waves.push(this._getWaveSetup().createWave(this._myVentRuntimeSetup, this._myGameTimeElapsed, direction));

        return waves;
    }
}