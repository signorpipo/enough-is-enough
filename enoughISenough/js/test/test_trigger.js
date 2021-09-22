WL.registerComponent('test-trigger', {
}, {
    init: function () {
    },
    start: function () {
        this._myPhysx = this.object.pp_getComponent("physx");
        this._myPhysx.onCollision(function (type, other) {
            // Ignore uncollides
            if (type == WL.CollisionEventType.TouchLost) return;

            console.log("TRIGGER");
        }.bind(this));
    },
    update: function (dt) {
        var a = a + 2;
        a = a + 2;
        a = a + 2;
        a = a + 2;
        a = a + 2;
    }
});