WL.registerComponent("color-on-select", {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myPhysxMaterial: { type: WL.Type.Material },
    _myIdleMaterial: { type: WL.Type.Material }
}, {
    init: function () {
        this._myDiffuseColor = vec4_create();
        this._myAmbientColor = vec4_create();
        this._mySpecularColor = vec4_create();
    },
    start: function () {
        if (this._myHandedness == 0) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        this._myFirstUpdate = true;
        this._myPrevSelectValue = -1;

        this._myHandednessType = PP.InputUtils.getHandednessByIndex(this._myHandedness);
    },
    update() {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._myPhysxMaterialDiffuseColor = this._myPhysxMaterial.diffuseColor.pp_clone();
            this._myIdleMaterialDiffuseColor = this._myIdleMaterial.diffuseColor.pp_clone();

            this._myPhysxMaterialAmbientColor = this._myPhysxMaterial.ambientColor.pp_clone();
            this._myIdleMaterialAmbientColor = this._myIdleMaterial.ambientColor.pp_clone();

            this._myPhysxMaterialSpecularColor = this._myPhysxMaterial.specularColor.pp_clone();
            this._myIdleMaterialSpecularColor = this._myIdleMaterial.specularColor.pp_clone();

            this._myMaterial = this.object.pp_getComponentHierarchy("mesh").material.clone();
            PP.MeshUtils.setMaterial(this.object, this._myMaterial);
        } else {
            let selectValue = Math.pp_mapToRange(this._myGamepad.getButtonInfo(PP.ButtonType.SELECT).getValue(), 0.1, 0.85, 0, 1);
            if (!Global.myEnableSelectPhysx || PP.InputUtils.getInputSourceType(this._myHandednessType) != PP.InputSourceType.GAMEPAD) {
                selectValue = 0;
            }

            if (selectValue != this._myPrevSelectValue) {
                this._myDiffuseColor[0] = Math.pp_lerp(this._myIdleMaterialDiffuseColor[0], this._myPhysxMaterialDiffuseColor[0], selectValue);
                this._myDiffuseColor[1] = Math.pp_lerp(this._myIdleMaterialDiffuseColor[1], this._myPhysxMaterialDiffuseColor[1], selectValue);
                this._myDiffuseColor[2] = Math.pp_lerp(this._myIdleMaterialDiffuseColor[2], this._myPhysxMaterialDiffuseColor[2], selectValue);
                this._myDiffuseColor[3] = 1;
                this._myMaterial.diffuseColor = this._myDiffuseColor;

                this._myAmbientColor[0] = Math.pp_lerp(this._myIdleMaterialAmbientColor[0], this._myPhysxMaterialAmbientColor[0], selectValue);
                this._myAmbientColor[1] = Math.pp_lerp(this._myIdleMaterialAmbientColor[1], this._myPhysxMaterialAmbientColor[1], selectValue);
                this._myAmbientColor[2] = Math.pp_lerp(this._myIdleMaterialAmbientColor[2], this._myPhysxMaterialAmbientColor[2], selectValue);
                this._myAmbientColor[3] = 1;
                this._myMaterial.ambientColor = this._myAmbientColor;

                this._mySpecularColor[0] = Math.pp_lerp(this._myIdleMaterialSpecularColor[0], this._myPhysxMaterialSpecularColor[0], selectValue);
                this._mySpecularColor[1] = Math.pp_lerp(this._myIdleMaterialSpecularColor[1], this._myPhysxMaterialSpecularColor[1], selectValue);
                this._mySpecularColor[2] = Math.pp_lerp(this._myIdleMaterialSpecularColor[2], this._myPhysxMaterialSpecularColor[2], selectValue);
                this._mySpecularColor[3] = 1;
                this._myMaterial.specularColor = this._mySpecularColor;
            }

            this._myPrevSelectValue = selectValue;
        }

    }
});