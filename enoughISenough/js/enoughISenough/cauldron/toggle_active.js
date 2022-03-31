WL.registerComponent("toggle-active", {
    _myObject: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        this._myActive = true;
    },
    update: function (dt) {
        if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {
            this._myObject.pp_setActive(!this._myActive);
            this._myActive = !this._myActive;
        }
    }
});