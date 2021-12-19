WL.registerComponent("pp-easy-mesh-color", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _myUseTuneTarget: { type: WL.Type.Bool, default: false },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myColorModel: { type: WL.Type.Enum, values: ['rgb', 'hsv'] },
    _myColorType: { type: WL.Type.Enum, values: ['color', 'diffuse color', 'diffuse color with ambient shade factor', 'ambient color', 'specular color', 'emissive color', 'fog color'], default: 'color' },
    _myAmbientShadeFactor: { type: WL.Type.Float, default: 0 } // If less than 0 use the same diffuse color but darkened by the factor specified, brightened otherwise

}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyMeshColor(this._myColorModel, this._myColorType, this._myAmbientShadeFactor, this.object, this._myVariableName, this._mySetAsDefault, this._myUseTuneTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyMeshColor = class EasyMeshColor extends PP.EasyObjectTuner {
    constructor(colorModel, colorType, ambientShadeFactor, object, variableName, setAsDefault, useTuneTarget) {
        super(object, variableName, setAsDefault, useTuneTarget);
        this._myColorModel = colorModel;
        this._myColorType = colorType;
        this._myAmbientShadeFactor = ambientShadeFactor;
        this._myColorVariableNames = ['color', 'diffuseColor', 'diffuseColor', 'ambientColor', 'specularColor', 'emissiveColor', 'fogColor'];
    }

    _getVariableNamePrefix() {
        let nameFirstPart = null;

        if (this._myColorModel == 0) {
            nameFirstPart = "Mesh RGB ";
        } else {
            nameFirstPart = "Mesh HSV ";
        }

        return nameFirstPart;
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneIntArray(variableName, this._getDefaultValue(), 100, 0, 255);
    }

    _getObjectValue(object) {
        let color = null;

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            color = meshMaterial[this._myColorVariableNames[this._myColorType]].pp_clone();

            if (this._myColorModel == 0) {
                color = PP.ColorUtils.rgbCodeToHuman(color);
            } else {
                color = PP.ColorUtils.hsvCodeToHuman(PP.ColorUtils.rgbToHsv(color));
            }
        } else {
            color = this._getDefaultValue();
        }

        return color;
    }

    _getDefaultValue() {
        return vec4_create();
    }

    _updateObjectValue(object, value) {
        let color = value;

        if (this._myColorModel == 0) {
            color = PP.ColorUtils.rgbHumanToCode(color);
        } else {
            color = PP.ColorUtils.hsvToRgb(PP.ColorUtils.hsvHumanToCode(color));
        }

        let meshMaterial = this._getMeshMaterial(object);
        if (meshMaterial) {
            meshMaterial[this._myColorVariableNames[this._myColorType]] = color;
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

                meshMaterial.ambientColor = ambientColor;
            }
        }

        if ((PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressStart() && PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed) ||
            (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressStart() && PP.myRightGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).myIsPressed)) {

            let hsvColor = PP.ColorUtils.color1To255(PP.ColorUtils.rgbToHsv(color));
            let rgbColor = PP.ColorUtils.color1To255(color);

            console.log("RGB:", rgbColor.vec_toString(0), "- HSV:", hsvColor.vec_toString(0));
        }
    }

    _getMeshMaterial(object) {
        let material = null;
        let mesh = object.pp_getComponentHierarchy("mesh");
        if (mesh) {
            material = mesh.material;
        }

        return material;
    }
};