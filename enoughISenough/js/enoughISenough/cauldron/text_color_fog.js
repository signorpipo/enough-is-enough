WL.registerComponent("text-color-fog", {
    _myShadeFactorMaxAngle: { type: WL.Type.Float, default: 0 }
}, {
    init: function () {
        this._myDown = [0, -1, 0];
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
            let color = this._computeLightColor(this._myTempVec4.pp_copy(this._myColor), textComponent.object.pp_getForward(this._myTempVec3));

            this._myTempVec4[0] = Math.pp_lerp(color[0], 0, fogFactor);
            this._myTempVec4[1] = Math.pp_lerp(color[1], 0, fogFactor);
            this._myTempVec4[2] = Math.pp_lerp(color[2], 0, fogFactor);
            this._myTempVec4[3] = textComponent.material.color[3];

            textComponent.material.color = this._myTempVec4;
        }
    },
    _computeLightColor(color, forward) {
        let angle = forward.vec3_angle(this._myDown);
        let shadeFactor = 1;

        if (this._myShadeFactorMaxAngle > 0.001 && angle < this._myShadeFactorMaxAngle) {
            shadeFactor = Math.pp_lerp(shadeFactor, 0.2, 1 - angle / this._myShadeFactorMaxAngle);
        }

        color[0] = color[0] * shadeFactor;
        color[1] = color[1] * shadeFactor;
        color[2] = color[2] * shadeFactor;

        return color;
    },
    fogFactorExp2(dist, density) {
        let LOG2 = -1.442695;
        let d = density * dist;
        return 1.0 - Math.pp_clamp(Math.pow(2, d * d * LOG2), 0.0, 1.0);
    },
    pp_clone() {
    }
});