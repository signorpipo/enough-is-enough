WL.registerComponent('pp-grabbable', {
}, {
    init: function () {
        this._myIsGrabbed = false;

        this._myOldParent = this.object.parent;

        this._myUngrabCallbacks = new Map();
    },
    start: function () {
        this._myPhysx = this.object.pp_getComponent('physx');
    },
    onDeactivate: function () {
        if (this._myIsGrabbed) {
            this._ungrab();
        }
    },
    grab: function (grabber) {
        if (this._myIsGrabbed) {
            this._ungrab();
        }

        this._myPhysx.kinematic = true;

        this._myOldParent = this.object.parent;
        this.object.pp_setParent(grabber);

        this._myIsGrabbed = true;
    },
    throw: function (linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            this.object.pp_setParent(this._myOldParent);
            this._myIsGrabbed = false;
            this._myPhysx.kinematic = false;

            this._myPhysx.linearVelocity = linearVelocity;
            this._myPhysx.angularVelocity = angularVelocity;
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
    registerUngrabEventListener(id, callback) {
        this._myUngrabCallbacks.set(id, callback);
    },
    unregisterUngrabEventListener(id) {
        this._myUngrabCallbacks.delete(id);
    },
    _ungrab() {
        this._myUngrabCallbacks.forEach(function (value) { value(); });

        this._myIsGrabbed = false;
        this.object.pp_setParent(this._myOldParent);
    }
});