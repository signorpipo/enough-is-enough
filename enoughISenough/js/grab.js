WL.registerComponent('eie-grab', {
}, {
    init: function () {
        let input = this.object.getComponent("input");

        if (input) {
            MM.gamepadManager.registerStartSelect(this.startGrab.bind(this), input.handedness);
            MM.gamepadManager.registerEndSelect(this.endGrab.bind(this), input.handedness);
        }

        this.collider = utilities.getComponentWithChildren(this.object, 'collision', 1);

        this.grabbed = null;
        this.grabbedParent = null;
    },
    start: function () {
    },
    update: function (dt) {
    },
    startGrab: function (e) {
        console.log('start grab');

        if (!this.grabbed) {
            let collidingComps = this.collider.queryOverlaps();
            if (collidingComps.length > 0) {
                this.grabbed = collidingComps[0].object;
                this.grabbedParent = this.grabbed.parent;

                utilities.reparentKeepTransform(this.grabbed, this.object);
            }
        }
    },
    endGrab: function (e) {
        console.log('end grab');

        if (this.grabbed) {
            utilities.reparentKeepTransform(this.grabbed, this.grabbedParent);

            this.grabbed = null;
            this.grabbedParent = null;
        }
    }
});