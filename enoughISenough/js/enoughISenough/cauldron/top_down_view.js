WL.registerComponent("top-down-view", {
    _myHeight: { type: WL.Type.Float, default: 40.0 }
}, {
    start: function () {
        this.object.pp_lookTo([0, 1, 0]);
        this.object.pp_translate([0, this._myHeight, 0]);
    },
});