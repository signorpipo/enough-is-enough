WL.registerComponent('pp-set-head-transform', {
    _myFixForward: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myUp = [0, 1, 0];

        this._myHeadPose = new PP.HeadPose(this._myFixForward);
    },
    start: function () {
        this._myHeadPose.start();
    },
    update: function (dt) {
        this._myHeadPose.update(dt);

        if (PP.XRUtils.isXRSessionActive()) {
            this.object.pp_setTransformLocalQuat(this._myHeadPose.getTransformQuat());
        } else {
            this.object.pp_resetTransformLocal();
            this.object.pp_rotateAxisLocal(180, this._myUp);
        }
    },
});