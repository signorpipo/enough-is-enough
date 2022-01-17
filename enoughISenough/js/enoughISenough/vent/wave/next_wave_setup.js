class NextWavesSetup {
    constructor() {
        this._myNextWaves = [];
    }

    addWave(waveID, chance, startTime, endTime) {
        let wave = new NextWaveSetup(waveID, chance, startTime, endTime);
        this._myNextWaves.push(wave);
    }

    getNextWave(timeElapsed) {
        let validWaves = [];
        let totalChance = 0;
        for (let nextWave of this._myNextWaves) {
            if (nextWave.myStartTime < timeElapsed && (nextWave.myEndTime == null || nextWave.myEndTime > timeElapsed)) {
                validWaves.push(nextWave);
                totalChance += nextWave.myChance.get(timeElapsed);
            }
        }

        if (validWaves.length == 0) {
            validWaves.push(this._myNextWaves[0]);
            console.error("No valid next wave found, how?");
        }

        let nextWave = validWaves[0];
        let randomChance = Math.pp_randomInt(1, totalChance);
        let currentChance = 0;
        for (let validWave of validWaves) {
            currentChance += validWave.myChance.get(timeElapsed);
            if (randomChance <= currentChance) {
                nextWave = validWave;
                break;
            }
        }

        return nextWave.myWaveID;
    }
}

class NextWaveSetup {
    constructor(waveID, chance, startTime, endTime) {
        this.myWaveID = waveID;
        this.myChance = chance;
        this.myStartTime = startTime;
        this.myEndTime = endTime;
    }
}