class ObjectPoolMap {
    constructor() {
        this._myPoolMap = new Map();
    }

    addPool(poolID, poolObject, initialPoolSize, cloneParams = undefined, cloneFunctionName = undefined, setActiveFunctionName = undefined, equalsFunctionName = undefined) {
        if (!this._myPoolMap.has(poolID)) {
            let pool = new ObjectPool(poolObject, initialPoolSize, cloneParams, cloneFunctionName, setActiveFunctionName);
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

    getObject(poolID) {
        return this._myPoolMap.get(poolID).get();
    }

    releaseObject(poolID, object) {
        this._myPoolMap.get(poolID).release(object);
    }
}

class ObjectPool {
    constructor(poolObject, initialPoolSize, cloneParams, cloneFunctionName, setActiveFunctionName, equalsFunctionName) {
        this._myCloneParams = cloneParams;
        this._myCloneFunctionName = cloneFunctionName;
        this._mySetActiveFunctionName = setActiveFunctionName;
        this._myEqualsFunctionName = equalsFunctionName;
        this._myPrototype = this._clone(poolObject);

        this._myAvailableObjects = [];
        this._myBusyObjects = [];

        this._addToPool(initialPoolSize, false);
    }

    get() {
        let object = this._myAvailableObjects.shift();

        if (!object) {
            this._addToPool(Math.floor(this._myBusyObjects.length * 0.2 + 1), true);
            object = this._myAvailableObjects.shift();
        }

        this._myBusyObjects.push(object);

        return object;
    }

    release(object) {
        let released = this._myBusyObjects.pp_remove(this._equals.bind(this, object));
        if (released) {
            this._setActive(released, false);
            this._myAvailableObjects.push(released);
        }
    }

    increase(amount) {
        this._addToPool(amount, false);
    }

    _addToPool(size, log) {
        for (let i = 0; i < size; i++) {
            this._myAvailableObjects.push(this._clone(this._myPrototype));
        }

        if (log) {
            console.warn("Added new elements to the pool:", size);
        }
    }

    _clone(object) {
        let clone = null;

        if (this._myCloneFunctionName != null) {
            clone = object[this._myCloneFunctionName](this._myCloneParams);
        } else if (object.pp_clone != null) {
            clone = object.pp_clone(this._myCloneParams);
        } else if (object.clone != null) {
            clone = object.clone(this._myCloneParams);
        }

        if (clone == null) {
            console.error("Object not cloneable, pool will return null");
        } else {
            this._setActive(clone, false);
        }

        return clone;
    }

    _setActive(object, active) {
        if (this._mySetActiveFunctionName != null) {
            object[this._mySetActiveFunctionName](active);
        } else if (object.pp_setActive != null) {
            object.pp_setActive(active);
        } else if (object.setActive != null) {
            object.setActive(active);
        }
    }

    _equals(first, second) {
        let equals = false;

        if (this._myEqualsFunctionName != null) {
            equals = first[this._myEqualsFunctionName](second);
        } else if (first.pp_equals != null) {
            equals = first.pp_equals(second);
        } else if (first.equals != null) {
            equals = first.equals(second);
        }

        return equals;
    }
}