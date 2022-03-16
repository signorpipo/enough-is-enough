WL.registerComponent('pp-deactivate-on-first-update', {
}, {
    init: function () {
    },
    start: function () {
        this._myFirst = true;
    },
    update: function (dt) {
        if (this._myFirst) {
            this._myFirst = false;
            this.object.pp_setActiveHierarchy(false);
        }
    },
});