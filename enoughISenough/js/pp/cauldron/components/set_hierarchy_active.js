WL.registerComponent('pp-set-hierarchy-active', {
    _myHierarchyActive: { type: WL.Type.Bool, default: true },
}, {
    init: function () {
    },
    start: function () {
        this.object.pp_setActiveHierarchy(this._myHierarchyActive);
    },
    update: function (dt) {
    },
});