WL.registerComponent("pp-easy-text-color", {
    _myIndex: { type: WL.Type.Int, default: 0 },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'outline color'], default: 'color' }

}, {
    init: function () {
        this._myVariableName = "Easy Text Color ".concat(this._myIndex);
    },
    start: function () {
        this._myTextMaterial = this.object.pp_getComponent("text").material;
        this._myColorVariableNames = ['color', 'outline color'];
        let color = this._myTextMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();
        color = color.vec_scale(255);
        color = color.vec_round();
        PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray(this._myVariableName, color, 100, 0, 255));
        if (this._myIndex == 0) {
            PP.setEasyTuneWidgetActiveVariable(this._myVariableName);
        }
    },
    update: function () {
        let color = PP.myEasyTuneVariables.get(this._myVariableName).vec_scale(1 / 255);
        this._myTextMaterial[this._myColorVariableNames[this._myColorType]] = color;
    }
});