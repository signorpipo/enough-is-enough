WL.registerComponent('physx-collector-component', {
}, {
    init: function () {
    },
    start: function () {
        this._myCollisionsCollector = null;
        this._myPhysx = this.object.pp_getComponent("physx");
        if (this._myPhysx) {
            this._myCollisionsCollector = new PP.PhysXCollisionCollector(this._myPhysx);
        }
    },
    getCollisionsCollector() {
        return this._myCollisionsCollector;
    },
    onActivate() {
        console.error("collector activate");
        if (this._myCollisionsCollector) {
            this._myCollisionsCollector.setActive(true);
        }
    },
    onDeactivate() {
        console.error("collector deactivate");
        if (this._myCollisionsCollector) {
            this._myCollisionsCollector.setActive(false);
        }
    },
    pp_clone(clone) {
        if (clone._myCollisionsCollector == null) {
            clone._myPhysx = clone.object.pp_getComponent("physx");
            if (clone._myPhysx) {
                clone._myCollisionsCollector = new PP.PhysXCollisionCollector(clone._myPhysx);
            }
        }
    }
});