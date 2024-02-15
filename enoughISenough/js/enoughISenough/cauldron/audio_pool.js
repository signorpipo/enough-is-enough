PP.AudioPoolManager = class AudioPoolManager {
    constructor() {
        this._myPoolMap = new Map();
    }

    update(dt) {
        for (let pool of this._myPoolMap.values()) {
            pool.update(dt);
        }
    }

    addPool(poolID, poolAudio, audioPoolParams = new PP.AudioPoolParams()) {
        if (!this._myPoolMap.has(poolID)) {
            let pool = new PP.AudioPool(poolAudio, audioPoolParams);
            this._myPoolMap.set(poolID, pool);
        } else {
            console.error("Pool already created with this ID");
        }
    }

    increasePool(poolID, amount) {
        let pool = this._myPoolMap.get(poolID);
        if (pool) {
            pool.increase(amount);
        }
    }

    increasePoolPercentage(poolID, percentage) {
        let pool = this._myPoolMap.get(poolID);
        if (pool) {
            pool.increasePercentage(percentage);
        }
    }

    getPool(poolID) {
        return this._myPoolMap.get(poolID);
    }

    getAudio(poolID) {
        return this._myPoolMap.get(poolID).get();
    }

    releaseAudio(poolID, audio) {
        this._myPoolMap.get(poolID).release(audio);
    }
};

PP.AudioPoolParams = class AudioPoolParams {
    constructor() {
        this.myInitialPoolSize = 0;
        this.myAmountToAddWhenEmpty = 1;
        this.myPercentageToAddWhenEmpty = 0.5;

        this.myCloneParams = undefined;
        this.myCloneFunction = undefined;
        this.myCloneFunctionName = undefined;
        this.mySetActiveFunctionName = undefined;
        this.myEqualsFunctionName = undefined;
    }
};

PP.AudioPool = class AudioPool {
    constructor(audioPoolParams) {
        this._myAudioPoolParams = audioPoolParams;

        this._myAvailableAudios = [];
        this._myBusyAudios = [];
        this._myOnHoldPlayingAudios = [];
        this._myOnHoldDelayAudios = [];

        this._addToPool(audioPoolParams.myInitialPoolSize, false);
    }

    update(dt) {
        // Implemented outside class definition
    }

    get() {
        let audio = this._myAvailableAudios.shift();

        if (audio == null) {
            let amountToAdd = Math.ceil((this._myBusyAudios.length + this._myAvailableAudios.length + this._myOnHoldPlayingAudios.length, + this._myOnHoldDelayAudios.length) * this._myAudioPoolParams.myPercentageToAddWhenEmpty);
            amountToAdd += this._myAudioPoolParams.myAmountToAddWhenEmpty;
            this._addToPool(amountToAdd, true);
            audio = this._myAvailableAudios.shift();
        }

        this._myBusyAudios.push(audio);

        return audio;
    }

    release(audio) {
        let released = this._myBusyAudios.pp_remove(this._equals.bind(this, audio));
        if (released) {
            this._setActive(released, false);
            this._myOnHoldPlayingAudios.push(released);
        }
    }

    increase(amount) {
        this._addToPool(amount, false);
    }

    increasePercentage(percentage) {
        let amount = Math.ceil((this._myBusyAudios.length + this._myAvailableAudios.length + this._myOnHoldPlayingAudios.length, + this._myOnHoldDelayAudios.length) * percentage);
        this._addToPool(amount, false);
    }

    _addToPool(size, log) {
        for (let i = 0; i < size; i++) {
            this._myAvailableAudios.push(this._clone());
        }

        if (log) {
            console.warn("Added new elements to the pool:", size);
        }
    }

    _clone(audio) {
        let clone = null;

        if (this._myAudioPoolParams.myCloneFunction != null) {
            clone = this._myAudioPoolParams.myCloneFunction(this._myAudioPoolParams.myCloneParams);
        } else if (this._myAudioPoolParams.myCloneFunctionName != null) {
            clone = audio[this._myAudioPoolParams.myCloneFunctionName](this._myAudioPoolParams.myCloneParams);
        } else if (audio.pp_clone != null) {
            clone = audio.pp_clone(this._myAudioPoolParams.myCloneParams);
        } else if (audio.clone != null) {
            clone = audio.clone(this._myAudioPoolParams.myCloneParams);
        }

        if (clone == null) {
            console.error("Audio not cloneable, pool will return null");
        } else {
            this._setActive(clone, false);
        }

        return clone;
    }

    _setActive(audio, active) {
        if (this._myAudioPoolParams.mySetActiveFunctionName != null) {
            audio[this._myAudioPoolParams.mySetActiveFunctionName](active);
        } else if (audio.pp_setActive != null) {
            audio.pp_setActive(active);
        } else if (audio.setActive != null) {
            audio.setActive(active);
        }
    }

    _equals(first, second) {
        let equals = false;

        if (first != null && this._myAudioPoolParams.myEqualsFunctionName != null) {
            equals = first[this._myAudioPoolParams.myEqualsFunctionName](second);
        } else if (first != null && first.pp_equals != null) {
            equals = first.pp_equals(second);
        } else if (first != null && first.equals != null) {
            equals = first.equals(second);
        } else {
            equals = first == second;
        }

        return equals;
    }
};

PP.AudioPool.prototype.update = function () {
    let removePlayingCallback = function (audio) {
        return !audio.isPlaying() && audio.isLoaded();
    };

    let removeDelayCallback = function (audioPair) {
        return audioPair[0] <= 0 && audioPair[1] <= 0;
    };

    return function update(dt) {
        for (let i = 0; i < this._myOnHoldDelayAudios.length; i++) {
            let audioPair = this._myOnHoldDelayAudios[i];

            if (audioPair[0] > 0) {
                audioPair[0] = audioPair[0] - dt;
            } else if (audioPair[1] > 0) {
                audioPair[1] = audioPair[1] - 1;
            }
        }

        let removedOnHoldDelayAudios = this._myOnHoldDelayAudios.pp_removeAll(removeDelayCallback);
        for (let i = 0; i < removedOnHoldDelayAudios.length; i++) {
            let audioPair = removedOnHoldDelayAudios[i];
            this._myAvailableAudios.push(audioPair[2]);
        }

        let removedOnHoldPlayingAudios = this._myOnHoldPlayingAudios.pp_removeAll(removePlayingCallback);
        for (let i = 0; i < removedOnHoldPlayingAudios.length; i++) {
            let audio = removedOnHoldPlayingAudios[i];
            this._myOnHoldDelayAudios.push([2, 10, audio]);
        }
    };
}();