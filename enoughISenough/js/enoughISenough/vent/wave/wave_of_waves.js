class WaveOfWavesSetup {
    constructor() {
        this.myWavesCount = new RangeValueOverTime([1, 1], [1, 1], 0, 0, true);
        this.myTimeBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.mySameTimeBetweenWaves = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.myDoneDelay = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myTimeBeforeStart = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myWavesSetup = []; // every item is an array, 0 is a wave setup, 1 is the chance, 2 is the debug name
        this.myWavesSetupPickOne = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
        this.myWavesSetupPrecompute = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true
    }

    getAverageClonesCount(timeElapsed) {
        let average = 0;
        for (let waveSetup of this.myWavesSetup) {
            average += waveSetup[0].getAverageClonesCount(timeElapsed);
        }
        average = average / this.myWavesSetup.length;

        return Math.round(this.myWavesCount.getAverage(timeElapsed) * average);
    }

    getPrecomputed(timeElapsed) {
        let setup = new WaveOfWavesSetup();

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

    _pickOneWave(timeElapsed) {
        let wave = this.myWavesSetup[0][0];
        let name = this.myWavesSetup[0][2];

        let totalChance = 0;
        for (let waveSetup of this.myWavesSetup) {
            totalChance += waveSetup[1].get(timeElapsed);
        }

        let randomChance = Math.pp_randomInt(1, totalChance);
        let currentChance = 0;
        for (let waveSetup of this.myWavesSetup) {
            currentChance += waveSetup[1].get(timeElapsed);
            if (randomChance <= currentChance) {
                wave = waveSetup[0];
                name = waveSetup[2];
                break;
            }
        }

        this.myWavesSetup = [];
        this.myWavesSetup.push([wave, 1, name]);
    }
}

class WaveOfWaves {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentRuntimeSetup = ventRuntimeSetup;
        this._mySpawnWavesSetup = waveSetup.myWavesSetup.pp_clone();

        if (this._mySpawnWavesSetup.length == 0) {
            this._mySpawnWavesSetup.push([new IAmHereWaveSetup(), 1, "I_Am_Here"]);
        }

        if (waveSetup.myWavesSetupPickOne.get(timeElapsed) >= 0) {
            this._getWaveSetup(true);
        }

        if (waveSetup.myWavesSetupPrecompute.get(timeElapsed) >= 0) {
            let wavesSetup = this._mySpawnWavesSetup;
            this._mySpawnWavesSetup = [];
            for (let setup of wavesSetup) {
                this._mySpawnWavesSetup.push([setup[0].getPrecomputed(this._myGameTimeElapsed), setup[1], setup[2]]);
            }
        }

        this._myTotalWavesCount = this._myWaveSetup.myWavesCount.get(timeElapsed);
        this._myWavesCount = this._myTotalWavesCount;
        this._mySameTimeBetweenWaves = waveSetup.mySameTimeBetweenWaves.get(timeElapsed) >= 0;

        let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
        this._myTimeBetweenWaves = this._myWaveSetup.myTimeBetweenWaves.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
        this._mySpawnTimer = new PP.Timer(this._myWaveSetup.myTimeBeforeStart.get(this._myGameTimeElapsed) * spawnTimeMultiplier);
        let doneTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.myDoneTimeMultiplier.get(this._myGameTimeElapsed);
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed) * doneTimeMultiplier, false);

        this._computeWaveStartDirection(refDirection);

        this._myCurrentWaves = [];

        this._myDebugActive = false;

        this._myOneCloneSetupValid = false;
        this._myOneCloneSetupValidCurrentWave = false;
        this._myLastValidSpawnTimer = this._mySpawnTimer.getDuration();

        this._myDuration = 0;
        this._myActualClonesCount = 0;
    }

    update(dt) {
        if (this.isDone()) {
            return [];
        }

        this._myDuration += dt;

        let cloneSetups = [];

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                if (this._myWavesCount > 0) {
                    this._myOneCloneSetupValidCurrentWave = false;
                    this._myCurrentWaves = this._createNextWaves();
                    this._myWavesCount -= this._myCurrentWaves.length;
                }
            }
        }

        for (let wave of this._myCurrentWaves) {
            if (wave != null) {
                let innerCloneSetups = wave.update(dt);
                cloneSetups.push(...innerCloneSetups);
            }
        }

        if (cloneSetups.length > 0) {
            this._myOneCloneSetupValid = true;
            this._myOneCloneSetupValidCurrentWave = true;
        }

        this._myCurrentWaves.pp_removeAll(element => element == null || element.isDone());

        if (this._myCurrentWaves.length == 0 && this._myWavesCount > 0 && !this._mySpawnTimer.isRunning()) {
            if (this._myOneCloneSetupValidCurrentWave) {
                this._mySpawnTimer.start(this._getSpawnTimer());
                this._myLastValidSpawnTimer = this._mySpawnTimer.getDuration();
            } else {
                this._mySpawnTimer.start(0);
            }
        } else if (!this._myDoneDelayTimer.isRunning() && this._myWavesCount <= 0 && this._myCurrentWaves.length == 0) {
            if (this._myOneCloneSetupValid) {
                if (this._myOneCloneSetupValidCurrentWave) {
                    this._myDoneDelayTimer.start();
                } else {
                    this._myDoneDelayTimer.start(this._myDoneDelayTimer.getDuration() - this._myLastValidSpawnTimer);
                }
            } else {
                this._myDoneDelayTimer.start(0);
            }
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        }

        this._myActualClonesCount += cloneSetups.length;

        return cloneSetups;
    }

    isDone() {
        return this._myDoneDelayTimer.isDone();
    }

    getActualClonesCount() {
        return this._myActualClonesCount;
    }

    getDuration() {
        return this._myDuration;
    }

    getAverageClonesCount() {
        let average = 0;
        for (let waveSetup of this._mySpawnWavesSetup) {
            average += waveSetup[0].getAverageClonesCount(this._myGameTimeElapsed);
        }
        average = average / this._mySpawnWavesSetup.length;

        return Math.round(this._myTotalWavesCount * average);
    }

    _createNextWaves() {
        let waves = [];

        return waves;
    }

    _getSpawnTimer() {
        if (!this._mySameTimeBetweenWaves) {
            let spawnTimeMultiplier = this._myVentRuntimeSetup.myVentMultipliers.mySpawnTimeMultiplier.get(this._myGameTimeElapsed);
            this._myTimeBetweenWaves = this._myWaveSetup.myTimeBetweenWaves.get(this._myGameTimeElapsed) * spawnTimeMultiplier;
        }

        return this._myTimeBetweenWaves;
    }

    _getWaveSetup(setWaveSetup = false) {
        let wave = this._mySpawnWavesSetup[0][0];
        let name = this._mySpawnWavesSetup[0][2];

        let totalChance = 0;
        for (let waveSetup of this._mySpawnWavesSetup) {
            totalChance += waveSetup[1].get(this._myGameTimeElapsed);
        }

        let randomChance = Math.pp_randomInt(1, totalChance);
        let currentChance = 0;
        for (let waveSetup of this._mySpawnWavesSetup) {
            currentChance += waveSetup[1].get(this._myGameTimeElapsed);
            if (randomChance <= currentChance) {
                wave = waveSetup[0];
                name = waveSetup[2];
                break;
            }
        }

        if (setWaveSetup) {
            this._mySpawnWavesSetup = [];
            this._mySpawnWavesSetup.push([wave, 1, name]);
        } else if (this._myDebugActive && this._mySpawnWavesSetup.length > 1) {
            console.log("   Wave -", name);
        }

        return wave;
    }

    _checkVentAngleValid(direction) {
        let angleValid = false;
        for (let range of this._myVentRuntimeSetup.myValidAngleRanges) {
            let angle = direction.vec3_angleSigned(range[1], [0, 1, 0]);
            if (range[0].isInsideAngle(angle, Global.myVentDuration)) {
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
            angleValid = this._checkVentAngleValid(startDirection);

            attempts--;
        }

        this._myWaveStartDirection = flatRefDirection.vec3_rotateAxis(this._myWaveStartAngle, [0, 1, 0]);
        this._myWaveStartDirection.vec3_normalize(this._myWaveStartDirection);
    }
}