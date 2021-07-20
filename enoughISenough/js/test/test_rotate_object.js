WL.registerComponent('test-rotate-object', {
    _myX: { type: WL.Type.Float, default: 0.0 },
    _myY: { type: WL.Type.Float, default: 0.0 },
    _myZ: { type: WL.Type.Float, default: 0.0 },
    _myObjectRotate: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        let quat = this.object._pp_degreesToQuaternion([this._myX * dt, this._myY * dt, this._myZ * dt]);
        if (!this._myObjectRotate) {
            this.object.pp_rotateWorldDegrees([this._myX * dt, this._myY * dt, this._myZ * dt]);
        } else {
            this.object.pp_rotateObjectDegrees([this._myX * dt, this._myY * dt, this._myZ * dt]);
        }
    }
});