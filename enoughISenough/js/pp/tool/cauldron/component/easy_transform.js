WL.registerComponent("pp-easy-transform", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myScaleAsOne: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        if (this._myVariableName == "") {
            this._myEasyTuneVariableName = "Transform ".concat(this.object.objectId);
        } else {
            this._myEasyTuneVariableName = "Transform ".concat(this._myVariableName);
        }
    },
    start: function () {
        PP.myEasyTuneVariables.add(new PP.EasyTuneEasyTransform(this._myEasyTuneVariableName, this.object.pp_getTransform(), this._myScaleAsOne));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    },
    update: function () {
        this.object.pp_setTransform(PP.myEasyTuneVariables.get(this._myEasyTuneVariableName));
    }
});