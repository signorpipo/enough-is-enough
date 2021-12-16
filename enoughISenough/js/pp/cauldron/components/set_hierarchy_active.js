WL.registerComponent('pp-set-hierarchy-active', {
    _myHierarchyActive: { type: WL.Type.Bool, default: true },
}, {
    init: function () {
        if (this.active) {
            this.object.pp_setActiveHierarchy(this._myHierarchyActive);
        }
    },
    start: function () {
    },
    update: function (dt) {
    },
});