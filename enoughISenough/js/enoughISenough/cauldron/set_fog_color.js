WL.registerComponent("set-fog-color", {
    _myAlpha: { type: WL.Type.Float, default: 0 }
}, {
    init: function () {
    },
    start: function () {
        PP.MeshUtils.setClonedMaterials(this.object);
        PP.MeshUtils.setFogColor(this.object, [0, 0, 0, this._myAlpha]);
    },
    update: function (dt) {
    }
});