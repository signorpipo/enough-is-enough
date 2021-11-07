WL.registerComponent("pp-easy-mesh-color", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'diffuse color', 'diffuse color with ambient shade factor', 'ambient color', 'specular color', 'emissive color', 'fog color'], default: 'color' },
    _myAmbientShadeFactor: { type: WL.Type.Float, default: 0 } // If less than 0 use the same diffuse color but darkened by the factor specified, brightened otherwise

}, {
    init: function () {
        if (this._myVariableName == "") {
            this._myEasyTuneVariableName = "Mesh Color ".concat(this.object.objectId);
        } else {
            this._myEasyTuneVariableName = "Mesh Color ".concat(this._myVariableName);
        }
    },
    start: function () {
        this._myMeshMaterial = this.object.pp_getComponent("mesh").material;
        this._myColorVariableNames = ['color', 'diffuseColor', 'diffuseColor', 'ambientColor', 'specularColor', 'emissiveColor', 'fogColor'];
        let color = this._myMeshMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();
        color = color.vec_scale(255);
        color = color.vec_round();
        PP.myEasyTuneVariables.add(new PP.EasyTuneIntArray(this._myEasyTuneVariableName, color, 50, 0, 255));
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    },
    update: function () {
        let color = PP.myEasyTuneVariables.get(this._myEasyTuneVariableName).vec_scale(1 / 255);
        this._myMeshMaterial[this._myColorVariableNames[this._myColorType]] = color;
        if (this._myColorType == 2) {
            let ambientColor = color.pp_clone();
            if (this._myAmbientShadeFactor <= 0) {
                //Darker
                for (let i = 0; i < 3; ++i) {
                    ambientColor[i] = ambientColor[i] * (1 + this._myAmbientShadeFactor);
                }
            } else {
                //Brighter
                for (let i = 0; i < 3; ++i) {
                    ambientColor[i] = ambientColor[i] + (1 - ambientColor[i]) * this._myAmbientShadeFactor;
                }
            }

            ambientColor = ambientColor.vec_clamp(0, 1);

            this._myMeshMaterial.ambientColor = ambientColor;
        }
    }
});