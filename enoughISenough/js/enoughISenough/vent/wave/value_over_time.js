class ValueOverTime {
    constructor(startValue, endValue, startTime, endTime, isInt = false) {
        this._myStartValue = startValue;
        this._myEndValue = endValue;
        this._myStartTime = startTime;
        this._myEndTime = endTime;
        this._myIsInt = isInt;

        this._myUseFloor = this._myStartValue <= this._myEndValue;
    }

    get(timeElapsed) {
        let interpolationValue = Math.pp_mapToNewInterval(timeElapsed, this._myStartTime, this._myEndTime, 0, 1);
        let lerpValue = Math.pp_lerp(this._myStartValue, this._myEndValue, interpolationValue);

        if (this._myIsInt) {
            if (this._myUseFloor) {
                lerpValue = Math.floor(lerpValue);
            } else {
                lerpValue = Math.ceil(lerpValue);
            }
        }

        return lerpValue;
    }
}

class RangeValueOverTime {
    constructor(startRange, endRange, startTime, endTime, isInt = false) {
        this._myRangeStartValue = new ValueOverTime(startRange[0], endRange[0], startTime, endTime, isInt);
        this._myRangeEndValue = new ValueOverTime(startRange[1], endRange[1], startTime, endTime, isInt);
        this._myIsInt = isInt;
    }

    get(timeElapsed) {
        let startValue = this._myRangeStartValue.get(timeElapsed);
        let endValue = this._myRangeEndValue.get(timeElapsed);

        let randomValue = null;

        if (this._myIsInt) {
            randomValue = Math.pp_randomInt(startValue, endValue);
        } else {
            randomValue = Math.pp_random(startValue, endValue);
        }

        return randomValue;
    }
}

Number.prototype.get = function () {
    return this.valueOf();
};

class RangeValue {
    constructor(range, isInt = false) {
        this._myRange = range;
        this._myIsInt = isInt;
    }

    get() {
        let randomValue = null;

        if (this._myIsInt) {
            randomValue = Math.pp_randomInt(this._myRange[0], this._myRange[1]);
        } else {
            randomValue = Math.pp_random(this._myRange[0], this._myRange[1]);
        }

        return randomValue;
    }
}

Number.prototype.get = function () {
    return this.valueOf();
};