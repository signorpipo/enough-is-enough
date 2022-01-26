class WaveOfWavesSetup {
    constructor() {
        this.myWavesCount = new RangeValueOverTime([1, 1], [1, 1], 0, 0, true);
        this.myTimeBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameTimeBetweenWaves = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.myDoneDelay = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBeforeStart = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myWavesSetup = []; // every item is an array, 0 is a wave setup, 1 is the chance, 2 is the debug name
    }

    getAverageClonesCount(timeElapsed) {
        let average = 0;
        for (let waveSetup of this._myWaveSetup.myWavesSetup) {
            average += waveSetup[0].getAverageClonesCount(timeElapsed);
        }
        average = average / this._myWaveSetup.myWavesSetup.length;

        return Math.round(this.myWavesCount.getAverage(timeElapsed) * average);
    }
}

class WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentSetup = ventSetup;

        if (waveSetup.myWavesSetup.length == 0) {
            waveSetup.myWavesSetup.push([new IAmHereWaveSetup(), 1, "I_Am_Here"]);
        }

        this._myTotalWavesCount = this._myWaveSetup.myWavesCount.get(timeElapsed);
        this._myWavesCount = this._myTotalWavesCount;
        this._mySameTimeBetweenWaves = waveSetup.mySameTimeBetweenWaves.get(timeElapsed) >= 0;

        this._myTimeBetweenWaves = this._myWaveSetup.myTimeBetweenWaves.get(this._myGameTimeElapsed);
        this._mySpawnTimer = new PP.Timer(this._myWaveSetup.myTimeBeforeStart.get(this._myGameTimeElapsed));
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed), false);

        this._computeWaveStartDirection(refDirection);

        this._myCurrentWaves = [];

        this._myDebugActive = true;
    }

    update(dt) {
        if (this.isDone()) {
            return [];
        }

        let cloneSetups = [];

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                if (this._myWavesCount > 0) {
                    this._myCurrentWaves = this._createNextWaves();
                    this._myWavesCount -= this._myCurrentWaves.length;
                }
            }
        }

        for (let wave of this._myCurrentWaves) {
            let innerCloneSetups = wave.update(dt);
            cloneSetups.push(...innerCloneSetups);
        }

        this._myCurrentWaves.pp_removeAll(element => element.isDone());

        if (this._myCurrentWaves.length == 0 && this._myWavesCount > 0 && !this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.start(this._getSpawnTimer());
        } else if (!this._myDoneDelayTimer.isRunning() && this._myWavesCount <= 0 && this._myCurrentWaves.length == 0) {
            this._myDoneDelayTimer.start();
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        }

        return cloneSetups;
    }

    isDone() {
        return this._myDoneDelayTimer.isDone();
    }

    getAverageClonesCount() {
        let average = 0;
        for (let waveSetup of this._myWaveSetup.myWavesSetup) {
            average += waveSetup[0].getAverageClonesCount(this._myGameTimeElapsed);
        }
        average = average / this._myWaveSetup.myWavesSetup.length;

        return Math.round(this._myTotalWavesCount * average);
    }

    _createNextWaves() {
        let waves = [];

        return waves;
    }

    _getSpawnTimer() {
        if (!this._mySameTimeBetweenWaves) {
            this._myTimeBetweenWaves = this._myWaveSetup.myTimeBetweenWaves.get(this._myGameTimeElapsed);
        }

        return this._myTimeBetweenWaves;
    }

    _getWaveSetup() {
        let wave = this._myWaveSetup.myWavesSetup[0][0];
        let name = this._myWaveSetup.myWavesSetup[0][2];

        let totalChance = 0;
        for (let waveSetup of this._myWaveSetup.myWavesSetup) {
            totalChance += waveSetup[1].get(this._myGameTimeElapsed);
        }

        let randomChance = Math.pp_randomInt(1, totalChance);
        let currentChance = 0;
        for (let waveSetup of this._myWaveSetup.myWavesSetup) {
            currentChance += waveSetup[1].get(this._myGameTimeElapsed);
            if (randomChance <= currentChance) {
                wave = waveSetup[0];
                name = waveSetup[2];
                break;
            }
        }

        if (this._myDebugActive && this._myWaveSetup.myWavesSetup.length > 1) {
            console.log("   Wave -", name);
        }

        return wave;
    }

    _checkVentAngleValid(direction) {
        let angleValid = false;
        let angle = direction.vec3_angleSigned([0, 0, -1], [0, 1, 0]);
        for (let range of this._myVentSetup.myValidAngleRanges) {
            if (range.isInside(angle, this._myGameTimeElapsed)) {
                angleValid = true;
                break;
            }
        }

        return angleValid;
    }

    _computeWaveStartDirection(refDirection) {
        if (refDirection == null) {
            refDirection = Global.myPlayerForward;
        }

        let attempts = 100;
        let angleValid = false;

        let flatRefDirection = refDirection.vec3_removeComponentAlongAxis([0, 1, 0]);

        while (attempts > 0 && !angleValid) {
            this._myWaveStartAngle = this._myWaveSetup.myWaveStartAngle.get(this._myGameTimeElapsed) * Math.pp_randomSign();
            let startDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
            let angleValid = this._checkVentAngleValid(startDirection);

            attempts--;
        }

        this._myWaveStartDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
        this._myWaveStartDirection.vec3_normalize(this._myWaveStartDirection);
    }
}