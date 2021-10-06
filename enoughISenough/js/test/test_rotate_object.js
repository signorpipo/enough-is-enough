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
            this.object.pp_rotateObjectDegrees([this._myX * dt, this._myY * dt, this._myZ * dt]);
            //this.object.pp_rotateAxisWorldDegrees(this.object.pp_getRightWorld(), -this._myX * dt);
        } else {
            let axis = [];
            glMatrix.vec3.copy(axis, [this._myX * dt, this._myY * dt, this._myZ * dt]);
            glMatrix.vec3.normalize(axis, axis);
            //this.object.pp_transformDirectionWorldToObject(axis, axis);
            //this.object.pp_rotateAxisObjectDegrees(axis, this._myX * dt);
            //this.object.pp_rotateObjectDegrees([this._myX * dt, this._myY * dt, this._myZ * dt]);
            this.object.pp_rotateAroundAxisObjectDegrees(axis, this._myX * dt, [0, 5, 5]);
        }
    }
});