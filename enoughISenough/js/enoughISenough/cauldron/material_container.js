WL.registerComponent("material-container", {
    _myTitle: { type: WL.Type.Material },
    _mySubtitle: { type: WL.Type.Material },
}, {
    init: function () {
        Materials.myTitle = this._myTitle;
        Materials.mySubtitle = this._mySubtitle;
    },
    start: function () {
    },
    update: function (dt) {
    }
});

var Materials = {
    myTitle: null,
    mySubtitle: null
};