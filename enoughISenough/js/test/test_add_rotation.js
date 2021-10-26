WL.registerComponent('test-add-rotation', {
    _myAddRotation: { type: WL.Type.Bool, default: false },
    _myRotateSeparately: { type: WL.Type.Bool, default: false },
}, {
    init: function () {
    },
    start: function () {
        let vec = [0, 0, 45];
        let vec2 = [0, 180, 0];
        let quat = vec.vec3_toQuat();
        let quat2 = vec2.vec3_toQuat();
        let quat3 = quat;
        if (this._myAddRotation) {
            quat3 = quat.quat_addRotationQuat(quat2);
        }

        if (this._myRotateSeparately) {
            this.object.pp_rotateObjectQuat(quat);
            this.object.pp_rotateObjectQuat(quat2);
        } else {
            this.object.pp_rotateObjectQuat(quat3);
        }
    },
    update: function (dt) {
    }
});