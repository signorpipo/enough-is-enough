PP.SaveManager = class SaveManager {
    constructor() {
        this._mySaveCache = new Map();

        this._myCommitSavesDelayTimer = new PP.Timer(0, false);
        this._myIsCommitSavesDelayed = true;
        this._myIDsToCommit = [];

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myClearCallbacks = new Map();                 // Signature: callback()
        this._myDeleteCallbacks = new Map();                // Signature: callback(id)
        this._myDeleteIDCallbacks = new Map();              // Signature: callback(id)
        this._mySaveCallbacks = new Map();                  // Signature: callback(id, value)
        this._mySaveValueChangedCallbacks = new Map();      // Signature: callback(id, value)
        this._mySaveIDCallbacks = new Map();                // Signature: callback(id, value)
        this._mySaveValueChangedIDCallbacks = new Map();    // Signature: callback(id, value)
        this._myCommitSavesCallbacks = new Map();           // Signature: callback(isCommitSavesDelayed)
        this._myCommitSaveIDCallbacks = new Map();          // Signature: callback(id, value, isCommitSaveDelayed)
    }

    setCommitSavesDelay(delay) {
        this._myCommitSavesDelayTimer.start(delay);
    }

    setIsCommitSavesDelayed(delayed) {
        this._myIsCommitSavesDelayed = delayed;
    }

    update(dt) {
        if (this._myCommitSavesDelayTimer.isRunning()) {
            this._myCommitSavesDelayTimer.update(dt);
            if (this._myCommitSavesDelayTimer.isDone()) {
                this.commitSaves();
            }
        }
    }

    save(id, value, overrideIsCommitSavesDelayed = null) {
        let sameValue = false;
        if (this._mySaveCache.has(id)) {
            sameValue = this._mySaveCache.get(id) === value;
        }

        if (!sameValue) {
            this._mySaveCache.set(id, value);
            if ((this._myIsCommitSavesDelayed && overrideIsCommitSavesDelayed == null) || (overrideIsCommitSavesDelayed != null && overrideIsCommitSavesDelayed)) {
                this._myIDsToCommit.pp_pushUnique(id);
                if (!this._myCommitSavesDelayTimer.isRunning()) {
                    this._myCommitSavesDelayTimer.start();
                }
            } else {
                this._commitSave(id, false);

                if (this._myCommitSavesCallbacks.size > 0) {
                    let isCommitSaveDelayed = false;
                    this._myCommitSavesCallbacks.forEach(function (value) { value(isCommitSaveDelayed); });
                }
            }
        }

        if (this._mySaveCallbacks.size > 0) {
            this._mySaveCallbacks.forEach(function (value) { value(id, value); });
        }

        if (this._mySaveIDCallbacks.size > 0) {
            let callbackMap = this._mySaveIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (value) { value(id, value); });
            }
        }

        if (!sameValue) {
            if (this._mySaveValueChangedCallbacks.size > 0) {
                this._mySaveValueChangedCallbacks.forEach(function (value) { value(id, value); });
            }

            if (this._mySaveValueChangedIDCallbacks.size > 0) {
                let callbackMap = this._mySaveValueChangedIDCallbacks.get(id);
                if (callbackMap != null) {
                    callbackMap.forEach(function (value) { value(id, value); });
                }
            }
        }
    }

    commitSaves() {
        if (this._myIDsToCommit.length > 0) {
            for (let id of this._myIDsToCommit) {
                if (this._mySaveCache.has(id)) {
                    this._commitSave(id, true);
                }
            }

            this._myIDsToCommit = [];

            if (this._myCommitSavesCallbacks.size > 0) {
                let isCommitSavesDelayed = true;
                this._myCommitSavesCallbacks.forEach(function (value) { value(isCommitSavesDelayed); });
            }
        }
    }

    _commitSave(id, isCommitSaveDelayed) {
        let value = this._mySaveCache.get(id);
        try {
            PP.SaveUtils.save(id, value);
        } catch (error) {
            // not managed for now
        }

        if (this._myCommitSaveIDCallbacks.size > 0) {
            let callbackMap = this._myCommitSaveIDCallbacks.get(id);
            if (callbackMap != null) {
                callbackMap.forEach(function (value) { value(id, value, isCommitSaveDelayed); });
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

    _onXRSessionStart(session) {
        session.addEventListener('visibilitychange', function (event) {
            if (event.session.visibilityState != "visible") {
                this._onXRSessionEnd();
            }
        }.bind(this));
    }

    _onXRSessionEnd() {
        this.commitSaves();
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

    registerCommitSaveIDEventListener(valueID, callbackID, callback) {
        let valueIDMap = this._myCommitSaveIDCallbacks.get(valueID);
        if (valueIDMap == null) {
            this._myCommitSaveIDCallbacks.set(valueID, new Map());
            valueIDMap = this._myCommitSaveIDCallbacks.get(valueID);
        }

        valueIDMap.set(callbackID, callback);
    }

    unregisterCommitSaveIDEventListener(valueID, callbackID) {
        let valueIDMap = this._myCommitSaveIDCallbacks.get(valueID);
        if (valueIDMap != null) {
            valueIDMap.delete(callbackID);
        }
    }
};