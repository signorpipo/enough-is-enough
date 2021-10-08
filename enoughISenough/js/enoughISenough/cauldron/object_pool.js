class ObjectPoolMap {
    constructor() {
        this._myPoolMap = new Map();
    }

    addPool(poolID, poolObject, initialPoolSize, cloneParams = new PP.CloneParams()) {
        if (poolObject.pp_isCloneable()) {
            if (!this._myPoolMap.has(poolID)) {
                let pool = new ObjectPool(poolObject, initialPoolSize, cloneParams);
                this._myPoolMap.set(poolID, pool);
            } else {
                console.error("Pool already created with this ID");
            }
        } else {
            console.error("Object not cloneable, can't create a pool");
        }
    }

    getObject(poolID) {
        return this._myPoolMap.get(poolID).get();
    }

    releaseObject(poolID, object) {
        this._myPoolMap.get(poolID).release(object);
    }
}

class ObjectPool {
    constructor(poolObject, initialPoolSize, cloneParams) {
        this._myPrototype = poolObject.pp_clone(cloneParams);

        this._myAvailableObjects = [];
        this._myBusyObjects = [];

        this._addToPool(initialPoolSize, false);
    }

    get() {
        let object = this._myAvailableObjects.shift();

        if (!object) {
            this._addToPool(Math.floor(this._myBusyObjects.length * 0.5 + 1), true);
            object = this._myAvailableObjects.shift();
        }

        this._myBusyObjects.push(object);

        return object;
    }

    release(object) {
        let released = this._myBusyObjects.pp_findAndRemove(item => item.pp_equals(object));
        if (released) {
            released.pp_setActive(false);
            this._myAvailableObjects.push(released);
        }
    }

    _addToPool(size, log) {
        for (let i = 0; i < size; i++) {
            this._myAvailableObjects.push(this._myPrototype.pp_clone());
        }

        if (log) {
            console.warn("Added new elements to the pool:", size);
        }
    }


}