WL.registerComponent("pp-easy-set-tune-target-grab", {
}, {
    init: function () {
    },
    start: function () {
        let grab = this.object.pp_getComponent("pp-grab");
        grab.registerGrabEventListener(this, this._onGrab.bind(this));
        grab.registerThrowEventListener(this, this._onRelease.bind(this));
    },
    update: function () {
    },
    _onRelease: function (grabber, grabbable) {
        PP.myEasyTuneTarget = grabbable.object;
    },
    _onGrab: function (grabber, grabbable) {
        PP.myEasyTuneTarget = null;
    }
});