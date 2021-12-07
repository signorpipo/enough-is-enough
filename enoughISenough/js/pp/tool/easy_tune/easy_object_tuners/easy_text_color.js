WL.registerComponent("pp-easy-text-color", {
    _myColorModel: { type: WL.Type.Enum, values: ['rgb', 'hsv'] },
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'outline color'], default: 'color' }

}, {
    init: function () {
        let nameFirstPart = null;
        if (this._myColorModel == 0) {
            nameFirstPart = "Text RGB ";
        } else {
            nameFirstPart = "Text HSV ";
        }

        if (this._myVariableName == "") {
            this._myEasyTuneVariableName = nameFirstPart.concat(this.object.objectId);
        } else {
            this._myEasyTuneVariableName = nameFirstPart.concat(this._myVariableName);
        }
    },
    start: function () {
        this._myTextMaterial = this.object.pp_getComponent("text").material;
        this._myColorVariableNames = ['color', 'outline color'];
        let color = this._myTextMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

        if (this._myColorModel == 0) {
            color = PP.ColorUtils.rgbCodeToHuman(color);
        } else {
            color = PP.ColorUtils.hsvCodeToHuman(PP.ColorUtils.rgbToHsv(color));
        }

        PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray(this._myEasyTuneVariableName, color, 100, 0, 255));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    },
    update: function () {
        let color = PP.myEasyTuneVariables.get(this._myEasyTuneVariableName);

        if (this._myColorModel == 0) {
            color = PP.ColorUtils.rgbHumanToCode(color);
        } else {
            color = PP.ColorUtils.hsvToRgb(PP.ColorUtils.hsvHumanToCode(color));
        }

        this._myTextMaterial[this._myColorVariableNames[this._myColorType]] = color;

        if (PP.myEasyTuneVariables.isActive(this._myEasyTuneVariableName)) {
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd() ||
                PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd()) {

                let hsvColor = PP.ColorUtils.color1To255(PP.ColorUtils.rgbToHsv(color));
                let rgbColor = PP.ColorUtils.color1To255(color);

                console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
            }
        }
    }
});