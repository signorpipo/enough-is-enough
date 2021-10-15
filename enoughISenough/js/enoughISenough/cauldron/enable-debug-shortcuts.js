WL.registerComponent("enable-debug-shortcuts", {
    _myShortcutsEnabled: { type: WL.Type.Bool, default: false },
}, {
    init: function () {
    },
    start: function () {
        Global.myDebugShortcutsEnabled = this._myShortcutsEnabled;
    },
    update: function (dt) {
    }
});

