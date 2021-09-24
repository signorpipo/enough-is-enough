WL.registerComponent('pp-grabbable', {
}, {
    init: function () {
        this._myIsGrabbed = false;

        this._myOldParent = this.object.parent;

        this._myReleaseCallbacks = new Map(); // Signature: callback(isThrow)
    },
    start: function () {
        this._myPhysx = this.object.pp_getComponent('physx');
    },
    onDeactivate: function () {
        this.release();
    },
    grab: function (grabber) {
        this.release();

        this._myPhysx.kinematic = true;

        this._myOldParent = this.object.parent;
        this.object.pp_setParent(grabber);

        this._myIsGrabbed = true;
    },
    throw: function (linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            this._release();

            this._myPhysx.linearVelocity = linearVelocity;
            this._myPhysx.angularVelocity = angularVelocity;

            this._myReleaseCallbacks.forEach(function (value) { value(true); });
        }
    },
    release() {
        if (this._myIsGrabbed) {
            this._release();

            this._myReleaseCallbacks.forEach(function (value) { value(false); });
        }
    },
    getLinearVelocity() {
        return this._myPhysx.linearVelocity.slice(0);
    },
    getAngularVelocity() {
        return this._myPhysx.angularVelocity.slice(0);
    },
    isGrabbed() {
        return this._myIsGrabbed;
    },
    registerReleaseEventListener(id, callback) {
        this._myReleaseCallbacks.set(id, callback);
    },
    unregisterReleaseEventListener(id) {
        this._myReleaseCallbacks.delete(id);
    },
    _release() {
        this.object.pp_setParent(this._myOldParent);
        this._myIsGrabbed = false;

        //TEMP u can't set kinematic if physx is inactive because it will crash
        if (this._myPhysx.active) {
            this._myPhysx.kinematic = false;
        }
    }

});