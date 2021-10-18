WL.registerComponent("pp-easy-text-color", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'outline color'], default: 'color' }

}, {
    init: function () {
        if (this._myVariableName == "") {
            this._myEasyTuneVariableName = "Text Color ".concat(this.object.objectId);
        } else {
            this._myEasyTuneVariableName = "Text Color ".concat(this._myVariableName);
        }
    },
    start: function () {
        this._myTextMaterial = this.object.pp_getComponent("text").material;
        this._myColorVariableNames = ['color', 'outline color'];
        let color = this._myTextMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();
        color = color.vec_scale(255);
        color = color.vec_round();
        PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray(this._myEasyTuneVariableName, color, 100, 0, 255));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    },
    update: function () {
        let color = PP.myEasyTuneVariables.get(this._myEasyTuneVariableName).vec_scale(1 / 255);
        this._myTextMaterial[this._myColorVariableNames[this._myColorType]] = color;
    }
});