PP.SaveManager = class SaveManager {
    constructor() {
        this._mySaveCache = new Map();

        this._myCommitSaveDelayTimer = new PP.Timer(0);
        this._myIDToCommit = [];
    }

    setCommitSaveDelay(delay) {
        this._myCommitSaveDelayTimer.start(delay);
    }

    update(dt) {
        if (this._myCommitSaveDelayTimer.isRunning()) {
            this._myCommitSaveDelayTimer.update(dt);
            if (this._myCommitSaveDelayTimer.isDone()) {
                for (let id of this._myIDToCommit) {
                    if (this._mySaveCache.has(id)) {
                        let data = this._mySaveCache.get(id);
                        try {
                            PP.SaveUtils.save(id, data);
                        } catch (error) {
                            // not managed for now
                        }
                    }
                }

                this._myIDToCommit = [];
            }
        }
    }

    save(id, data) {
        this._mySaveCache.set(id, data);
        this._myIDToCommit.pp_pushUnique(id);
        if (!this._myCommitSaveDelayTimer.isRunning()) {
            this._myCommitSaveDelayTimer.start();
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
};