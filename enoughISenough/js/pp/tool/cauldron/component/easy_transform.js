WL.registerComponent("pp-easy-transform", {
    _myIndex: { type: WL.Type.Int, default: 0 },
    _myScaleAsOne: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        this._myVariableName = "Easy Transform ".concat(this._myIndex);
    },
    start: function () {
        PP.myEasyTuneVariables.add(new PP.EasyTuneEasyTransform(this._myVariableName, this.object.pp_getTransform(), this._myScaleAsOne));
        if (this._myIndex == 0) {
            PP.setEasyTuneWidgetActiveVariable(this._myVariableName);
        }
    },
    update: function () {
        this.object.pp_setTransform(PP.myEasyTuneVariables.get(this._myVariableName));
    }
});