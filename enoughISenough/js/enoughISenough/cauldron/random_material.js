WL.registerComponent("random-material", {
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
    },
    start: function () {
        this._myMaterials = [];
        for (let i = 1; i < 17; i++) {
            let material = "_my".concat(i);
            this._myMaterials.push(this[material].clone());
        }
    },
    update: function (dt) {
    },
    onActivate: function () {
        if (Global.myUpdateReady) {
            this._randomMaterial();
        }
    },
    _randomMaterial: function () {
        let meshes = this.object.pp_getComponentsHierarchy("mesh");

        for (let mesh of meshes) {
            let randomMaterial = Math.pp_randomPick(this._myMaterials);
            mesh.material.ambientColor = randomMaterial.ambientColor;
            mesh.material.diffuseColor = randomMaterial.diffuseColor;
        }
    }
});