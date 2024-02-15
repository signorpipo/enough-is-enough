PP.SaveManager = class SaveManager {
    constructor(saveID, autoLoadSaves = true) {
        this._mySaveID = saveID;

        this._myCommitSavesDelayTimer = new PP.Timer(0, false);
        this._myDelaySavesCommit = true;
        this._myCommitSavesDirty = false;
        this._myCommitSavesDirtyClearOnFail = true;
        this._myCommitSavesWhenLoadSavesFailed = false;
        this._myResetSaveObjectOnLoadSavesFail = false;

        this._mySaveObject = {};
        this._myLoadSavesSucceded = false;

        this._myClearCallbacks = new Map();                 // Signature: callback()
        this._myDeleteCallbacks = new Map();                // Signature: callback(id)
        this._myDeleteIDCallbacks = new Map();              // Signature: callback(id)
        this._mySaveCallbacks = new Map();                  // Signature: callback(id, value)
        this._mySaveValueChangedCallbacks = new Map();      // Signature: callback(id, value)
        this._mySaveIDCallbacks = new Map();                // Signature: callback(id, value)
        this._mySaveValueChangedIDCallbacks = new Map();    // Signature: callback(id, value)
        this._myCommitSavesCallbacks = new Map();           // Signature: callback(succeeded)
        this._myLoadCallbacks = new Map();                  // Signature: callback(id, value)
        this._myLoadIDCallbacks = new Map();                // Signature: callback(id, value)
        this._myLoadSavesCallbacks = new Map();             // Signature: callback(loadSavesSucceded, saveObjectReset)

        if (autoLoadSaves) {
            this.loadSaves();
        }
    }

    setCommitSavesDelay(delay) {
        this._myCommitSavesDelayTimer.start(delay);
    }

    setDelaySavesCommit(delayed) {
        this._myDelaySavesCommit = delayed;
    }

    setCommitSavesDirty(dirty, startDelayTimer = true) {
        this._myCommitSavesDirty = dirty;
        if (dirty && startDelayTimer) {
            if (!this.startDelayTimer.isRunning()) {
                this._myCommitSavesDelayTimer.start();
            }
        } else {
            this._myCommitSavesDelayTimer.reset();
        }
    }

    setCommitSavesDirtyClearOnFail(clearOnFail) {
        this._myCommitSavesDirtyClearOnFail = clearOnFail;
    }

    setCommitSavesWhenLoadSavesFailed(commitSavesWhenLoadSavesFailed) {
        this._myCommitSavesWhenLoadSavesFailed = commitSavesWhenLoadSavesFailed;
    }

    setResetSaveObjectOnLoadSavesFail(resetSaveObjectOnLoadSavesFail) {
        this._myResetSaveObjectOnLoadSavesFail = resetSaveObjectOnLoadSavesFail;
    }

    getCommitSavesDelay() {
        return this._myCommitSavesDelayTimer.getDuration();
    }

    isDelaySavesCommit() {
        return this._myDelaySavesCommit;
    }

    isCommitSavesDirty() {
        return this._myCommitSavesDirty;
    }

    isCommitSavesDirtyClearOnFail() {
        return this._myCommitSavesDirtyClearOnFail;
    }

    isCommitSavesWhenLoadSavesFailed() {
        return this._myCommitSavesWhenLoadSavesFailed;
    }

    isResetSaveObjectOnLoadSavesFail() {
        return this._myResetSaveObjectOnLoadSavesFail;
    }

    hasLoadSavesSucceded() {
        return this._myLoadSavesSucceded;
    }

    update(dt) {
        if (this._myCommitSavesDelayTimer.isRunning()) {
            this._myCommitSavesDelayTimer.update(dt);
            if (this._myCommitSavesDelayTimer.isDone()) {
                if (this._myCommitSavesDirty) {
                    this._commitSaves();
                }
            }
        } else {
            if (this._myCommitSavesDirty) {
                this._commitSaves();
            }
        }
    }

    has(id) {
        return id in this._mySaveObject;
    }

    save(id, value, overrideDelaySavesCommit = null) {
        let sameValue = false;
        if (this.has(id)) {
            sameValue = this._mySaveObject[id] === value;
        }

        if (!sameValue) {
            this._mySaveObject[id] = value;

            if ((this._myDelaySavesCommit && overrideDelaySavesCommit == null) || (overrideDelaySavesCommit != null && overrideDelaySavesCommit)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        if (this._mySaveCallbacks.size > 0) {
            this._mySaveCallbacks.forEach(function (callback) { callback(id, value); });
        }

        if (this._mySaveIDCallbacks.size > 0) {
            let callbackMap = this._mySaveIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (callback) { callback(id, value); });
            }
        }

        if (!sameValue) {
            if (this._mySaveValueChangedCallbacks.size > 0) {
                this._mySaveValueChangedCallbacks.forEach(function (callback) { callback(id, value); });
            }

            if (this._mySaveValueChangedIDCallbacks.size > 0) {
                let callbackMap = this._mySaveValueChangedIDCallbacks.get(id);
                if (callbackMap != null) {
                    callbackMap.forEach(function (callback) { callback(id, value); });
                }
            }
        }
    }

    delete(id, overrideDelaySavesCommit = null) {
        if (this.has(id)) {
            delete this._mySaveObject[id];

            if ((this._myDelaySavesCommit && overrideDelaySavesCommit == null) || (overrideDelaySavesCommit != null && overrideDelaySavesCommit)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        if (this._myDeleteCallbacks.size > 0) {
            this._myDeleteCallbacks.forEach(function (callback) { callback(id); });
        }

        if (this._myDeleteIDCallbacks.size > 0) {
            let callbackMap = this._myDeleteIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (callback) { callback(id); });
            }
        }
    }

    clear(overrideDelaySavesCommit = null) {
        if (Object.keys(this._mySaveObject).length > 0) {
            this._mySaveObject = {};

            if ((this._myDelaySavesCommit && overrideDelaySavesCommit == null) || (overrideDelaySavesCommit != null && overrideDelaySavesCommit)) {
                this._myCommitSavesDirty = true;
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSaves();
            }
        }

        if (this._myClearCallbacks.size > 0) {
            this._myClearCallbacks.forEach(function (callback) { callback(); });
        }
    }

    load(id, defaultValue) {
        let value = this._mySaveObject[id];

        if (value == null && defaultValue != null) {
            value = defaultValue;
        }

        if (this._myLoadCallbacks.size > 0) {
            this._myLoadCallbacks.forEach(function (callback) { callback(id, value); });
        }

        if (this._myLoadIDCallbacks.size > 0) {
            let callbackMap = this._myLoadIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (callback) { callback(id, value); });
            }
        }

        return value;
    }

    commitSaves(commitSavesOnlyIfDirty = true) {
        if (this._myCommitSavesDirty || !commitSavesOnlyIfDirty) {
            this._commitSaves();
        }
    }

    _commitSaves() {
        let succeded = true;

        if (this._myLoadSavesSucceded || this._myCommitSavesWhenLoadSavesFailed) {
            try {
                let saveObjectStringified = JSON.stringify(this._mySaveObject);
                PP.SaveUtils.save(this._mySaveID, saveObjectStringified);
            } catch (error) {
                succeded = false;
            }
        }

        if (succeded || this._myCommitSavesDirtyClearOnFail) {
            this._myCommitSavesDirty = false;
            this._myCommitSavesDelayTimer.reset();
        }

        if (this._myCommitSavesCallbacks.size > 0) {
            this._myCommitSavesCallbacks.forEach(function (callback) { callback(succeded); });
        }

        return succeded;
    }

    loadSaves() {
        let saveObject = {};
        let loadSavesSucceded = false;
        let saveObjectReset = false;

        let maxLoadObjectAttempts = 3;
        do {
            try {
                saveObject = PP.SaveUtils.loadObject(this._mySaveID, {});
                loadSavesSucceded = true;
            } catch (error) {
                maxLoadObjectAttempts--;
            }
        } while (maxLoadObjectAttempts > 0 && !loadSavesSucceded);

        if (loadSavesSucceded) {
            this._mySaveObject = saveObject;
            this._myLoadSavesSucceded = true;
        } else if (this._myResetSaveObjectOnLoadSavesFail) {
            this._mySaveObject = {};
            this._myLoadSavesSucceded = false;

            saveObjectReset = true;
        }

        if (this._myLoadSavesCallbacks.size > 0) {
            this._myLoadSavesCallbacks.forEach(function (callback) { callback(loadSavesSucceded, saveObjectReset); });
        }

        return loadSavesSucceded;
    }

    registerClearEventListener(callbackID, callback) {
        this._myClearCallbacks.set(callbackID, callback);
    }

    unregisterClearEventListener(callbackID) {
        this._myClearCallbacks.delete(callbackID);
    }

    registerDeleteEventListener(callbackID, callback) {
        this._myDeleteCallbacks.set(callbackID, callback);
    }

    unregisterDeleteEventListener(callbackID) {
        this._myDeleteCallbacks.delete(callbackID);
    }

    registerDeleteIDEventListener(valueID, callbackID, callback) {
        let valueIDMap = this._myDeleteIDCallbacks.get(valueID);
        if (valueIDMap == null) {
            this._myDeleteIDCallbacks.set(valueID, new Map());
            valueIDMap = this._myDeleteIDCallbacks.get(valueID);
        }

        valueIDMap.set(callbackID, callback);
    }

    unregisterDeleteIDEventListener(valueID, callbackID) {
        let valueIDMap = this._myDeleteIDCallbacks.get(valueID);
        if (valueIDMap != null) {
            valueIDMap.delete(callbackID);
        }
    }

    registerSaveEventListener(callbackID, callback) {
        this._mySaveCallbacks.set(callbackID, callback);
    }

    unregisterSaveEventListener(callbackID) {
        this._mySaveCallbacks.delete(callbackID);
    }

    registerSaveIDEventListener(valueID, callbackID, callback) {
        let valueIDMap = this._mySaveIDCallbacks.get(valueID);
        if (valueIDMap == null) {
            this._mySaveIDCallbacks.set(valueID, new Map());
            valueIDMap = this._mySaveIDCallbacks.get(valueID);
        }

        valueIDMap.set(callbackID, callback);
    }

    unregisterSaveIDEventListener(valueID, callbackID) {
        let valueIDMap = this._mySaveIDCallbacks.get(valueID);
        if (valueIDMap != null) {
            valueIDMap.delete(callbackID);
        }
    }

    registerSaveValueChangedEventListener(callbackID, callback) {
        this._mySaveValueChangedCallbacks.set(callbackID, callback);
    }

    unregisterSaveValueChangedEventListener(callbackID) {
        this._mySaveValueChangedCallbacks.delete(callbackID);
    }

    registerSaveValueChangedIDEventListener(valueID, callbackID, callback) {
        let valueIDMap = this._mySaveValueChangedIDCallbacks.get(valueID);
        if (valueIDMap == null) {
            this._mySaveValueChangedIDCallbacks.set(valueID, new Map());
            valueIDMap = this._mySaveValueChangedIDCallbacks.get(valueID);
        }

        valueIDMap.set(callbackID, callback);
    }

    unregisterSaveValueChangedIDEventListener(valueID, callbackID) {
        let valueIDMap = this._mySaveValueChangedIDCallbacks.get(valueID);
        if (valueIDMap != null) {
            valueIDMap.delete(callbackID);
        }
    }

    registerCommitSavesEventListener(callbackID, callback) {
        this._myCommitSavesCallbacks.set(callbackID, callback);
    }

    unregisterCommitSavesEventListener(callbackID) {
        this._myCommitSavesCallbacks.delete(callbackID);
    }

    registerLoadEventListener(callbackID, callback) {
        this._myLoadCallbacks.set(callbackID, callback);
    }

    unregisterLoadEventListener(callbackID) {
        this._myLoadCallbacks.delete(callbackID);
    }

    registerLoadIDEventListener(valueID, callbackID, callback) {
        let valueIDMap = this._myLoadIDCallbacks.get(valueID);
        if (valueIDMap == null) {
            this._myLoadIDCallbacks.set(valueID, new Map());
            valueIDMap = this._myLoadIDCallbacks.get(valueID);
        }

        valueIDMap.set(callbackID, callback);
    }

    unregisterLoadIDEventListener(valueID, callbackID) {
        let valueIDMap = this._myLoadIDCallbacks.get(valueID);
        if (valueIDMap != null) {
            valueIDMap.delete(callbackID);
        }
    }

    registerLoadSavesEventListener(callbackID, callback) {
        this._myLoadSavesCallbacks.set(callbackID, callback);
    }

    unregisterLoadSavesEventListener(callbackID) {
        this._myLoadSavesCallbacks.delete(callbackID);
    }
};