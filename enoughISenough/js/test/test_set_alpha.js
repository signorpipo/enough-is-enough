WL.registerComponent('test-set-alpha', {
}, {
    init: function () {
    },
    start: function () {
        this._myElapsedTime = 0;
        PP.MeshUtils.setClonedMaterials(this.object);
    },
    update: function (dt) {
        this._myElapsedTime += dt;
        PP.MeshUtils.setAlpha(this.object, Math.abs(Math.sin(this._myElapsedTime)));
    }
});