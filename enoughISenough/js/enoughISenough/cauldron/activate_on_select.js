WL.registerComponent("activate-on-select", {
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

        this._myPhysx = this.object.pp_getComponent("physx");

        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this, this._selectPressStart.bind(this));
        this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this, this._selectPressEnd.bind(this));

        this._myPhysx.active = false;
    },
    _selectPressStart() {
        this._myPhysx.active = true;
    },
    _selectPressEnd() {
        this._myPhysx.active = false;
    },
});