WL.registerComponent("pulse-on-grab", {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
    },
    start: function () {
        if (this._myHandedness == 0) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        let grab = this.object.pp_getComponent("pp-grabber-hand");
        grab.registerGrabEventListener(this, this._onGrab.bind(this));
    },
    _onGrab() {
        this._myGamepad.pulse(0.15, 0.1);
    },
});