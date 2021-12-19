WL.registerComponent("set-specular-color", {
    _myBrightness: { type: WL.Type.Int, default: 0 }
}, {
    init: function () {
    },
    start: function () {
        PP.MeshUtils.setClonedMaterials(this.object);
        PP.MeshUtils.setSpecularColor(this.object, PP.ColorUtils.hsvToRgb([0, 0, this._myBrightness / 255, 1]));
    },
    update: function (dt) {
    }
});