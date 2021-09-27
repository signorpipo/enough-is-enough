WL.registerComponent('pp-grabbable', {
}, {
    init: function () {
        this._myIsGrabbed = false;

        this._myOldParent = this.object.parent;
        this._myGrabber = null;

        this._myGrabCallbacks = new Map(); // Signature: callback(grabbable, grabber)
        this._myThrowCallbacks = new Map(); // Signature: callback(grabbable, grabber)
        this._myReleaseCallbacks = new Map(); // Signature: callback(grabbable, grabber, isThrow)
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

        this._myGrabCallbacks.forEach(function (value) { value(this, grabber); }.bind(this));
    },
    throw: function (linearVelocity, angularVelocity) {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            this._myPhysx.linearVelocity = linearVelocity;
            this._myPhysx.angularVelocity = angularVelocity;

            this._myThrowCallbacks.forEach(function (value) { value(this, grabber); }.bind(this));
            this._myReleaseCallbacks.forEach(function (value) { value(this, grabber, true); }.bind(this));
        }
    },
    release() {
        if (this._myIsGrabbed) {
            let grabber = this._myGrabber;

            this._release();

            this._myReleaseCallbacks.forEach(function (value) { value(this, grabber, false); }.bind(this));
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
    registerGrabEventListener(id, callback) {
        this._myGrabCallbacks.set(id, callback);
    },
    unregisterGrabEventListener(id) {
        this._myGrabCallbacks.delete(id);
    },
    registerThrowEventListener(id, callback) {
        this._myThrowCallbacks.set(id, callback);
    },
    unregisterThrowEventListener(id) {
        this._myThrowCallbacks.delete(id);
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
        this._myGrabber = null;

        //TEMP u can't set kinematic if physx is inactive because it will crash
        if (this._myPhysx.active) {
            this._myPhysx.kinematic = false;
        }
    }

});