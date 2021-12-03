WL.registerComponent("pp-easy-transform", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myIsLocal: { type: WL.Type.Bool, default: false },
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
        PP.myEasyTuneVariables.add(new PP.EasyTuneEasyTransform(this._myEasyTuneVariableName, (this._myIsLocal ? this.object.pp_getTransformLocal() : this.object.pp_getTransformWorld()), this._myScaleAsOne));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    },
    update: function () {
        if (this._myIsLocal) {
            this.object.pp_setTransformLocal(PP.myEasyTuneVariables.get(this._myEasyTuneVariableName));
        } else {
            this.object.pp_setTransformWorld(PP.myEasyTuneVariables.get(this._myEasyTuneVariableName));
        }
    }
});