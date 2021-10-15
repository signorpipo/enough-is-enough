WL.registerComponent("material-container", {
    _myTitle: { type: WL.Type.Material },
    _mySubtitle: { type: WL.Type.Material },
    _myText: { type: WL.Type.Material },
}, {
    init: function () {
        Global.myMaterials = {};
        Global.myMaterials.myTitle = this._myTitle;
        Global.myMaterials.mySubtitle = this._mySubtitle;
        Global.myMaterials.myText = this._myText;
    },
    start: function () {
    },
    update: function (dt) {
    }
});