WL.registerComponent("text-color-fog", {
}, {
    init: function () {
        this._myTempVec3 = vec3_create();
        this._myTempVec4 = vec4_create();
        this._myFogAlpha = 0.5;
    },
    start: function () {
        this._myFirstUpdate = true;
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._myTextComponents = this.object.pp_getComponentsHierarchy("text");
            this._myColor = this._myTextComponents[0].material.color.pp_clone();
        }

        let distance = Global.myPlayerPosition.vec3_sub(this.object.pp_getPosition(this._myTempVec3), this._myTempVec3).vec3_length();
        let fogFactor = this.fogFactorExp2(distance, this._myFogAlpha * 0.2);

        for (let textComponent of this._myTextComponents) {
            this._myTempVec4[0] = Math.pp_lerp(this._myColor[0], 0, fogFactor);
            this._myTempVec4[1] = Math.pp_lerp(this._myColor[1], 0, fogFactor);
            this._myTempVec4[2] = Math.pp_lerp(this._myColor[2], 0, fogFactor);
            this._myTempVec4[3] = textComponent.material.color[3];

            textComponent.material.color = this._myTempVec4;
        }
    },
    fogFactorExp2(dist, density) {
        let LOG2 = -1.442695;
        let d = density * dist;
        return 1.0 - Math.pp_clamp(Math.pow(2, d * d * LOG2), 0.0, 1.0);
    },
    pp_clone() {
    }
});