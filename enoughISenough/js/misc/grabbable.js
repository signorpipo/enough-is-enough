WL.registerComponent('eie-grabbable', {
}, {
    init: function () {
        this.physx = this.object.getComponent('physx');
        this.isGrabbed = false;
    },
    grab: function(grabber) {
        if (!this.isGrabbed) {
            if (this.physx) {
                this.oldKinematic = this.physx.kinematic;
                this.physx.kinematic = true;
            }

            this.parent = this.object.parent;
            PP.utilities.reparentKeepTransform(this.object, grabber);

            this.isGrabbed = true;
        }
    },
    release: function(linearVelocityMultiplier, angularVelocityMultiplier) {
        if (this.isGrabbed) {
            this._ungrab();
            
            if (this.physx) {
                this.physx.linearVelocity = glMatrix.vec3.scale(this.physx.linearVelocity, this.physx.linearVelocity, linearVelocityMultiplier);
                this.physx.angularVelocity = glMatrix.vec3.scale(this.physx.angularVelocity, this.physx.angularVelocity, angularVelocityMultiplier);
            }
        }
    },
    throw: function(linearVelocity, angularVelocity) {
        if (this.isGrabbed) {
            this._ungrab();

            if (this.physx) {
                this.physx.linearVelocity = linearVelocity;
                this.physx.angularVelocity = angularVelocity;
            }
        }
    },
    _ungrab: function() {
        if (this.physx) {
            this.physx.kinematic = this.oldKinematic;
        }

        PP.utilities.reparentKeepTransform(this.object, this.parent);

        this.isGrabbed = false;
    }
});