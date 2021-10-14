WL.registerComponent("material-container", {
    _myTitle: { type: WL.Type.Material },
    _mySubtitle: { type: WL.Type.Material },
    _myText: { type: WL.Type.Material },
}, {
    init: function () {
        Materials.myTitle = this._myTitle;
        Materials.mySubtitle = this._mySubtitle;
        Materials.myText = this._myText;
    },
    start: function () {
    },
    update: function (dt) {
    }
});

var Materials = {
    myTitle: null,
    mySubtitle: null,
    myText: null
};