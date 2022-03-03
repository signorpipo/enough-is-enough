class NextWavesSetup {
    constructor() {
        this._myNextWaves = [];
    }

    addWave(waveID, chance, startTime = 0, endTime = null) {
        let wave = new NextWaveSetup(waveID, chance, startTime, endTime);
        this._myNextWaves.push(wave);
    }

    getNextWave(timeElapsed, booster) {
        let validWaves = [];
        let totalChance = 0;
        for (let i = 0; i < this._myNextWaves.length; i++) {
            let waveToCheck = this._myNextWaves[i];
            if (waveToCheck.myStartTime <= timeElapsed && (waveToCheck.myEndTime == null || waveToCheck.myEndTime > timeElapsed)) {
                validWaves.push(waveToCheck);
                let max = 10;
                if (waveToCheck.myChance.get(timeElapsed) < 1) {
                    max = 0;
                }
                totalChance += Math.max(max, Math.floor(waveToCheck.myChance.get(timeElapsed) + booster.getChanceBoost(waveToCheck.myWaveID, timeElapsed)));
            }
        }

        if (validWaves.length == 0) {
            validWaves.push(this._myNextWaves[0]);
            console.error("No valid next wave found, how?");
        }

        let nextWave = null;
        let randomChance = Math.pp_random(0, totalChance);
        let currentChance = 0;
        for (let i = 0; i < validWaves.length; i++) {
            let validWave = validWaves[i];
            let max = 10;
            if (validWave.myChance.get(timeElapsed) < 1) {
                max = 0;
            }
            currentChance += Math.max(max, Math.floor(validWave.myChance.get(timeElapsed) + booster.getChanceBoost(validWave.myWaveID, timeElapsed)));
            if (randomChance < currentChance) {
                nextWave = validWave;
                break;
            }
        }

        if (nextWave == null) {
            nextWave = validWaves[validWaves.length - 1];
            console.error("No random wave found, how?");
        }

        //console.warn(booster.getBoostGroupName(nextWave.myWaveID), "-", booster.getChanceBoost(nextWave.myWaveID).toFixed(3), "-", booster.getTimeSinceLastPick(nextWave.myWaveID).toFixed(3), "-", nextWave.myWaveID);

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