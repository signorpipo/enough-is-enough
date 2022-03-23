PP.SaveManager = class SaveManager {
    constructor() {
        this._mySaveCache = new Map();

        this._myCommitSaveDelayTimer = new PP.Timer(0, false);
        this._myIsCommitSaveDelayed = true;
        this._myIDsToCommit = [];

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myClearCallbacks = new Map();
        this._myDeleteCallbacks = new Map();
        this._myDeleteIDCallbacks = new Map();
        this._mySaveCallbacks = new Map();
        this._mySaveValueChangedCallbacks = new Map();
        this._mySaveIDCallbacks = new Map();
        this._mySaveValueChangedIDCallbacks = new Map();
        this._mySaveCommittedCallbacks = new Map();
        this._mySaveCommittedIDCallbacks = new Map();
    }

    setCommitSaveDelay(delay) {
        this._myCommitSaveDelayTimer.start(delay);
    }

    setIsCommitSaveDelayed(delayed) {
        this._myIsCommitSaveDelayed = delayed;
    }

    update(dt) {
        if (this._myCommitSaveDelayTimer.isRunning()) {
            this._myCommitSaveDelayTimer.update(dt);
            if (this._myCommitSaveDelayTimer.isDone()) {
                this.commitSave();
            }
        }
    }

    save(id, data, overrideIsCommitSaveDelayed = null) {
        let sameData = false;
        if (this._mySaveCache.has(id)) {
            sameData = this._mySaveCache.get(id) === data;
        }

        if (!sameData) {
            this._mySaveCache.set(id, data);
            if ((this._myIsCommitSaveDelayed && overrideIsCommitSaveDelayed == null) || (overrideIsCommitSaveDelayed != null && overrideIsCommitSaveDelayed)) {
                this._myIDsToCommit.pp_pushUnique(id);
                if (!this._myCommitSaveDelayTimer.isRunning()) {
                    this._myCommitSaveDelayTimer.start();
                }
            } else {
                this._commitSave(id, false);

                if (this._mySaveCommittedCallbacks.size > 0) {
                    let isCommitSaveDelayed = false;
                    this._mySaveCommittedCallbacks.forEach(function (value) { value(isCommitSaveDelayed); });
                }
            }
        }

        if (this._mySaveCallbacks.size > 0) {
            this._mySaveCallbacks.forEach(function (value) { value(id, data); });
        }

        if (this._mySaveIDCallbacks.size > 0) {
            let callbackMap = this._mySaveIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (value) { value(id, data); });
            }
        }

        if (!sameData) {
            if (this._mySaveValueChangedCallbacks.size > 0) {
                this._mySaveValueChangedCallbacks.forEach(function (value) { value(id, data); });
            }

            if (this._mySaveValueChangedIDCallbacks.size > 0) {
                let callbackMap = this._mySaveValueChangedIDCallbacks.get(id);
                if (callbackMap != null) {
                    callbackMap.forEach(function (value) { value(id, data); });
                }
            }
        }
    }

    commitSave() {
        if (this._myIDsToCommit.length > 0) {
            for (let id of this._myIDsToCommit) {
                if (this._mySaveCache.has(id)) {
                    this._commitSave(id, true);
                }
            }

            this._myIDsToCommit = [];

            if (this._mySaveCommittedCallbacks.size > 0) {
                let isCommitSaveDelayed = true;
                this._mySaveCommittedCallbacks.forEach(function (value) { value(isCommitSaveDelayed); });
            }
        }
    }

    _commitSave(id, isCommitSaveDelayed) {
        let data = this._mySaveCache.get(id);
        try {
            PP.SaveUtils.save(id, data);
        } catch (error) {
            // not managed for now
        }

        if (this._mySaveCommittedIDCallbacks.size > 0) {
            let callbackMap = this._mySaveCommittedIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (value) { value(id, data, isCommitSaveDelayed); });
            }
        }
    }

    has(id) {
        return this._mySaveCache.has(id) || PP.SaveUtils.has(id);
    }

    delete(id) {
        this._mySaveCache.delete(id);
        PP.SaveUtils.delete(id);

        if (this._myDeleteCallbacks.size > 0) {
            this._myDeleteCallbacks.forEach(function (value) { value(id); });
        }

        if (this._myDeleteIDCallbacks.size > 0) {
            let callbackMap = this._myDeleteIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (value) { value(id); });
            }
        }
    }

    clear() {
        this._mySaveCache.clear();
        PP.SaveUtils.clear();

        if (this._myClearCallbacks.size > 0) {
            this._myClearCallbacks.forEach(function (value) { value(); });
        }
    }

    load(id, defaultValue = null) {
        return this._load(id, defaultValue, "load");
    }

    loadString(id, defaultValue = null) {
        return this._load(id, defaultValue, "loadString");
    }

    loadNumber(id, defaultValue = null) {
        return this._load(id, defaultValue, "loadNumber");
    }

    loadBool(id, defaultValue = null) {
        return this._load(id, defaultValue, "loadBool");
    }

    _load(id, defaultValue, functionName) {
        let item = null;
        if (this._mySaveCache.has(id)) {
            item = this._mySaveCache.get(id);
        } else {
            try {
                item = PP.SaveUtils[functionName](id, defaultValue);
            } catch (error) {
                // not managed for now
                item = defaultValue;
            }

            this._mySaveCache.set(id, item);
        }

        return item;
    }

    _onXRSessionEnd() {
        this.commitSave();
    }

    registerClearEventListener(id, callback) {
        this._myClearCallbacks.set(id, callback);
    }

    unregisterClearEventListener(id) {
        this._myClearCallbacks.delete(id);
    }

    registerDeleteEventListener(id, callback) {
        this._myDeleteCallbacks.set(id, callback);
    }

    unregisterDeleteEventListener(id) {
        this._myDeleteCallbacks.delete(id);
    }

    registerDeleteIDEventListener(dataID, callbackID, callback) {
        let dataIDMap = this._myDeleteIDCallbacks.get(dataID);
        if (dataIDMap == null) {
            this._myDeleteIDCallbacks.set(dataID, new Map());
            dataIDMap = this._myDeleteIDCallbacks.get(dataID);
        }

        dataIDMap.set(callbackID, callback);
    }

    unregisterDeleteIDEventListener(dataID, callbackID) {
        let dataIDMap = this._myDeleteIDCallbacks.get(dataID);
        if (dataIDMap != null) {
            dataIDMap.delete(callbackID);
        }
    }

    registerSaveEventListener(id, callback) {
        this._mySaveCallbacks.set(id, callback);
    }

    unregisterSaveEventListener(id) {
        this._mySaveCallbacks.delete(id);
    }

    registerSaveIDEventListener(dataID, callbackID, callback) {
        let dataIDMap = this._mySaveIDCallbacks.get(dataID);
        if (dataIDMap == null) {
            this._mySaveIDCallbacks.set(dataID, new Map());
            dataIDMap = this._mySaveIDCallbacks.get(dataID);
        }

        dataIDMap.set(callbackID, callback);
    }

    unregisterSaveIDEventListener(dataID, callbackID) {
        let dataIDMap = this._mySaveIDCallbacks.get(dataID);
        if (dataIDMap != null) {
            dataIDMap.delete(callbackID);
        }
    }

    registerSaveValueChangedEventListener(id, callback) {
        this._mySaveValueChangedCallbacks.set(id, callback);
    }

    unregisterSaveValueChangedEventListener(id) {
        this._mySaveValueChangedCallbacks.delete(id);
    }

    registerSaveValueChangedIDEventListener(dataID, callbackID, callback) {
        let dataIDMap = this._mySaveValueChangedIDCallbacks.get(dataID);
        if (dataIDMap == null) {
            this._mySaveValueChangedIDCallbacks.set(dataID, new Map());
            dataIDMap = this._mySaveValueChangedIDCallbacks.get(dataID);
        }

        dataIDMap.set(callbackID, callback);
    }

    unregisterSaveValueChangedIDEventListener(dataID, callbackID) {
        let dataIDMap = this._mySaveValueChangedIDCallbacks.get(dataID);
        if (dataIDMap != null) {
            dataIDMap.delete(callbackID);
        }
    }

    registerSaveCommittedEventListener(id, callback) {
        this._mySaveCommittedCallbacks.set(id, callback);
    }

    unregisterSaveCommittedEventListener(id) {
        this._mySaveCommittedCallbacks.delete(id);
    }

    registerSaveCommittedIDEventListener(dataID, callbackID, callback) {
        let dataIDMap = this._mySaveCommittedIDCallbacks.get(dataID);
        if (dataIDMap == null) {
            this._mySaveCommittedIDCallbacks.set(dataID, new Map());
            dataIDMap = this._mySaveCommittedIDCallbacks.get(dataID);
        }

        dataIDMap.set(callbackID, callback);
    }

    unregisterSaveCommittedIDEventListener(dataID, callbackID) {
        let dataIDMap = this._mySaveCommittedIDCallbacks.get(dataID);
        if (dataIDMap != null) {
            dataIDMap.delete(callbackID);
        }
    }
};