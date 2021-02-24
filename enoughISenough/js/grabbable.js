WL.registerComponent('eie-grabbable', {
}, {
    init: function () {
        this.physx = this.object.getComponent('physx');
        this.isGrabbed = false;
    },
    grab(grabber) {
        if (!this.isGrabbed) {
            if (this.physx) {
                this.oldKinematic = this.physx.kinematic;
                this.physx.kinematic = true;
            }

            this.parent = this.object.parent;
            utilities.reparentKeepTransform(this.object, grabber);

            this.isGrabbed = true;
        }
    },
    release() {
        if (this.isGrabbed) {
            if (this.physx) {
                this.physx.kinematic = this.oldKinematic;
            }

            utilities.reparentKeepTransform(this.object, this.parent);

            this.isGrabbed = false;
        }
    }
});