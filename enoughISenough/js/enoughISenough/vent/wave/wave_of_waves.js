class WaveOfWavesSetup {
    constructor() {
        this.myWavesCount = new RangeValueOverTime([1, 1], [1, 1], 0, 0, true);
        this.myTimeBetweenWaves = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myDoneDelay = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myWavesSetup = []; // every item is a pair, 0 is a wave setup, 1 is the chance
    }
}

class WaveOfWaves {
    constructor(ventSetup, waveSetup, timeElapsed) {
        this._myGameTimeElapsed = timeElapsed;
        this._myWaveSetup = waveSetup;
        this._myVentSetup = ventSetup;

        if (waveSetup.myWavesSetup.length == 0) {
            waveSetup.myWavesSetup.push([new IAmHereWaveSetup(), 1]);
        }

        this._myWavesCount = this._myWaveSetup.myWavesCount.get(timeElapsed);

        this._mySpawnTimer = new PP.Timer(0);
        this._myDoneDelayTimer = new PP.Timer(this._myWaveSetup.myDoneDelay.get(this._myGameTimeElapsed), false);

        this._myCurrentWaves = [];
    }

    update(dt) {
        if (this.isDone()) {
            return [];
        }

        let cloneSetups = [];

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                this._myCurrentWaves = this._createNextWaves();
                this._myWavesCount -= this._myCurrentWaves.length;
            }
        }

        for (let wave of this._myCurrentWaves) {
            let innerCloneSetups = wave.update(dt);
            cloneSetups.push(...innerCloneSetups);
        }

        this._myCurrentWaves.pp_removeAll(element => element.isDone());

        if (this._myCurrentWaves.length == 0 && this._myWavesCount > 0 && !this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.start(this._myWaveSetup.myTimeBetweenWaves.get(this._myGameTimeElapsed));
        }

        if (this._myDoneDelayTimer.isRunning()) {
            this._myDoneDelayTimer.update(dt);
        } else if (this._myWavesCount <= 0 && this._myCurrentWaves.length == 0) {
            this._myDoneDelayTimer.start();
        }

        return cloneSetups;
    }

    isDone() {
        return this._myDoneDelayTimer.isDone();
    }

    _createNextWaves() {
        let waves = [];

        return waves;
    }

    _getWaveSetup() {
        let wave = this._myWaveSetup.myWavesSetup[0][0];

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
                break;
            }
        }

        return wave;
    }
}