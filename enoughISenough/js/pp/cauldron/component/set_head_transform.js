WL.registerComponent('pp-set-head-transform', {
    _myLeftEye: { type: WL.Type.Object },
    _myRightEye: { type: WL.Type.Object },
    _myFixForward: { type: WL.Type.Bool, default: false }
}, {
    init: function () {
        this._myLeftEyePosition = glMatrix.vec3.create();
        this._myRightEyePosition = glMatrix.vec3.create();
        this._myCurrentHeadPosition = glMatrix.vec3.create();
    },
    start: function () {
    },
    update: function (dt) {
        this._myLeftEye.getTranslationWorld(this._myLeftEyePosition);
        this._myRightEye.getTranslationWorld(this._myRightEyePosition);

        glMatrix.vec3.add(this._myCurrentHeadPosition, this._myLeftEyePosition, this._myRightEyePosition);
        glMatrix.vec3.scale(this._myCurrentHeadPosition, this._myCurrentHeadPosition, 0.5);

        this.object.setTranslationWorld(this._myCurrentHeadPosition);
        this.object.rotationWorld = this._myLeftEye.rotationWorld;
        if (this._myFixForward) {
            this.object.pp_rotateAxisObject([0, 1, 0], 180);
        }
    },
});