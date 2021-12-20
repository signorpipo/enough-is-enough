WL.registerComponent("adjust-materials", {
    _myFogAlpha: { type: WL.Type.Float, default: 0 },
    _my1: { type: WL.Type.Material },
    _my2: { type: WL.Type.Material },
    _my3: { type: WL.Type.Material },
    _my4: { type: WL.Type.Material },
    _my5: { type: WL.Type.Material },
    _my6: { type: WL.Type.Material },
    _my7: { type: WL.Type.Material },
    _my8: { type: WL.Type.Material },
    _my9: { type: WL.Type.Material },
    _my10: { type: WL.Type.Material },
    _my11: { type: WL.Type.Material },
    _my12: { type: WL.Type.Material },
    _my13: { type: WL.Type.Material },
    _my14: { type: WL.Type.Material },
    _my15: { type: WL.Type.Material },
    _my16: { type: WL.Type.Material }
}, {
    init: function () {
        this._myMaterials = [];
        for (let i = 1; i < 17; i++) {
            let material = "_my".concat(i);
            this[material].fogColor = [0, 0, 0, this._myFogAlpha];
            this._myMaterials.push(this[material]);
        }
    },
    start() {
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Fog Alpha", this._myFogAlpha, 0.1, 3, 0, 1));
        this._myLastFogAlpha = PP.myEasyTuneVariables.get("Fog Alpha");
    },
    update(dt) {
        let fogAlpha = PP.myEasyTuneVariables.get("Fog Alpha");
        if (fogAlpha != this._myLastFogAlpha) {
            this._myLastFogAlpha = fogAlpha;
            for (let material of this._myMaterials) {
                material.fogColor = [0, 0, 0, fogAlpha];
            }
        }
    }
});