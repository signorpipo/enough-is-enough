class NextWaveChanceBooster {
    constructor() {
        this._myWavesDataMap = new Map();
    }

    addSetup(id, setup) {
        let data = new NextWaveChanceBoosterData(setup);
        this._myWavesDataMap.set(id, data);
    }

    nextWaveSelected(selectedID, timeElapsed) {
        let selectedData = this._myWavesDataMap.get(selectedID);
        if (selectedData) {

            let group = selectedData.getBoostGroup();
            let divider = selectedData.getDivider(timeElapsed);

            for (let currentID of group) {
                let data = this._myWavesDataMap.get(currentID);
                data.divide(divider);
            }

            selectedData.reset();
        }
    }

    getChanceBoost(id, timeElapsed) {
        let data = this._myWavesDataMap.get(id);
        if (data) {
            return data.getChanceBoost(timeElapsed);
        }

        return 0;
    }

    getTimeSinceLastPick(id) {
        let data = this._myWavesDataMap.get(id);
        if (data) {
            return data.getTimeSinceLastPick();
        }

        return 0;
    }

    getBoostGroupName(id) {
        let data = this._myWavesDataMap.get(id);
        if (data) {
            return data.getBoostGroupName();
        }

        return "0";
    }

    update(dt, timeElapsed) {
        this._myWavesDataMap.forEach(function (data) { data.update(dt, timeElapsed); });
    }

    reset() {
        this._myWavesDataMap.forEach(function (data) { data.reset(); });
    }
}

class NextWaveChanceBoosterData {
    constructor(setup) {
        this._mySetup = setup;

        this._myTimeSinceLastPick = 0;
        this._myChanceBoost = 0;
    }

    update(dt, timeElapsed) {
        if (timeElapsed >= this._mySetup.myStartTime) {
            this._myTimeSinceLastPick += dt;
            this._myChanceBoost += dt;
        }
    }

    reset() {
        this._myTimeSinceLastPick = 0;
        this._myChanceBoost = this._mySetup.myBoostValueOnReset;
    }

    getTimeSinceLastPick() {
        return this._myTimeSinceLastPick;
    }

    getChanceBoost(timeElapsed) {
        let damping = this._mySetup.myDampingOverLastPick.get(this._myTimeSinceLastPick);
        let chanceBoost = this._myChanceBoost + damping;

        if (chanceBoost >= 0) {
            chanceBoost = this._myChanceBoost * this._mySetup.myBoostMultiplier.get(timeElapsed);
        }

        return chanceBoost;
    }

    getBoostGroup() {
        return this._mySetup.myBoostGroup;
    }

    getBoostGroupName() {
        return this._mySetup.myBoostGroupName;
    }

    divide(divider) {
        this._myChanceBoost /= divider;
    }

    getDivider(timeElapsed) {
        return this._mySetup.myBoostDivider.get(timeElapsed);
    }
}

class NextWaveChanceBoosterSetup {
    constructor(startTime, boostGroup, boostGroupName, dampingOverLastPick, boostMultiplier, boostDivider, boostValueOnReset) {
        this.myStartTime = startTime;
        this.myBoostGroup = boostGroup;
        this.myBoostGroupName = boostGroupName;
        this.myDampingOverLastPick = dampingOverLastPick;
        this.myBoostMultiplier = boostMultiplier;
        this.myBoostDivider = boostDivider;
        this.myBoostValueOnReset = boostValueOnReset;
    }
}