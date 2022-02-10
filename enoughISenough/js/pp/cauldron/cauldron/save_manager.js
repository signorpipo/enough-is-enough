PP.SaveManager = class SaveManager {
    constructor() {
        this._mySaveCache = new Map();

        this._myCommitSaveDelayTimer = new PP.Timer(0, false);
        this._myIDsToCommit = [];

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    setCommitSaveDelay(delay) {
        this._myCommitSaveDelayTimer.start(delay);
    }

    update(dt) {
        if (this._myCommitSaveDelayTimer.isRunning()) {
            this._myCommitSaveDelayTimer.update(dt);
            if (this._myCommitSaveDelayTimer.isDone()) {
                this._commitSave();
            }
        }
    }

    save(id, data) {
        let sameData = false;
        if (this._mySaveCache.has(id)) {
            sameData = this._mySaveCache.get(id) === data;
        }

        if (!sameData) {
            this._mySaveCache.set(id, data);
            this._myIDsToCommit.pp_pushUnique(id);
            if (!this._myCommitSaveDelayTimer.isRunning()) {
                this._myCommitSaveDelayTimer.start();
            }
        }
    }

    has(id) {
        return this._mySaveCache.has(id) || PP.SaveUtils.has(id);
    }

    delete(id) {
        this._mySaveCache.delete(id);
        PP.SaveUtils.delete(id);
    }

    clear() {
        this._mySaveCache.clear();
        PP.SaveUtils.clear();
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

    _commitSave() {
        if (this._myIDsToCommit.length > 0) {
            for (let id of this._myIDsToCommit) {
                if (this._mySaveCache.has(id)) {
                    let data = this._mySaveCache.get(id);
                    try {
                        PP.SaveUtils.save(id, data);
                    } catch (error) {
                        // not managed for now
                    }
                }
            }

            this._myIDsToCommit = [];
        }
    }

    _onXRSessionEnd() {
        this._commitSave();
    }
};