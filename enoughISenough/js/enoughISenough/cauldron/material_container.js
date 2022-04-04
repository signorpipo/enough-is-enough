WL.registerComponent("material-container", {
    _myTitle: { type: WL.Type.Material },
    _mySubtitle: { type: WL.Type.Material },
    _myText: { type: WL.Type.Material },
    _myBigText: { type: WL.Type.Material },
    _myTitlePatch: { type: WL.Type.Object },
    _myBigBlatherPatch: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myMaterials = {};
        Global.myMaterials.myTitle = this._myTitle.clone();
        Global.myMaterials.mySubtitle = this._mySubtitle.clone();
        Global.myMaterials.myText = this._myText.clone();
        Global.myMaterials.myBigText = this._myBigText.clone();

        Global.myTitlePatchObject = this._myTitlePatch;
        Global.myBigBlatherPatchObject = this._myBigBlatherPatch;
        Global.myBigBlatherPatchObject.pp_setActive(false);
    },
    start: function () {
    },
    update: function (dt) {
    }
});