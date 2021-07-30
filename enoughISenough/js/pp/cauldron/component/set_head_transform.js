WL.registerComponent('set-head-transform', {
    _myLeftEye: { type: WL.Type.Object },
    _myRightEye: { type: WL.Type.Object }
}, {
    init: function () {
        this._myRotationToFixedHeadOrientation = [0, 1, 0, 0];
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
        this.object.resetRotation();
        this.object.rotateAxisAngleDegObject([0, 1, 0], 180);
        this.object.rotateObject(this._myLeftEye.transformWorld);
    },
});