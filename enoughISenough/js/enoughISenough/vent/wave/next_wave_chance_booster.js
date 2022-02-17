class NextWaveChanceBooster {
    constructor() {
        this._myWavesDataMap = new Map();
    }

    addSetup(id, setup) {
        let data = new NextWaveChanceBoosterData(setup);
        this._myWavesDataMap.set(id, data);
    }

    nextWaveSelected(selectedID) {
        let selectedData = this._myWavesDataMap.get(selectedID);
        if (selectedData) {

            let group = selectedData.getBoostGroup();
            let divider = selectedData.getDivider();

            for (let currentID of group) {
                let data = this._myWavesDataMap.get(currentID);
                data.divide(divider);
            }

            selectedData.reset();
        }
    }

    getChanceBoost(id) {
        let data = this._myWavesDataMap.get(id);
        if (data) {
            return data.getChanceBoost();
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
        this._myChanceBoost = 0;
    }

    getTimeSinceLastPick() {
        return this._myTimeSinceLastPick;
    }

    getChanceBoost() {
        let interpolator = this._mySetup.myBoostInterpolatorOverLastPick.get(this._myTimeSinceLastPick);
        let chanceBoost = this._myChanceBoost * this._mySetup.myBoostMultiplier * interpolator;

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

    getDivider() {
        return this._mySetup.myBoostDivider;
    }
}

class NextWaveChanceBoosterSetup {
    constructor(startTime, boostGroup, boostGroupName, boostInterpolatorOverLastPick, boostMultiplier, boostDivider) {
        this.myStartTime = startTime;
        this.myBoostGroup = boostGroup;
        this.myBoostGroupName = boostGroupName;
        this.myBoostInterpolatorOverLastPick = boostInterpolatorOverLastPick;
        this.myBoostMultiplier = boostMultiplier;
        this.myBoostDivider = boostDivider;
    }
}