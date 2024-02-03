WL.registerComponent("enable-debug-shortcuts", {
    _myShortcutsEnabled: { type: WL.Type.Bool, default: false },
}, {
    init: function () {
    },
    start: function () {
        Global.myDebugShortcutsEnabled = this._myShortcutsEnabled;
        if (this._myShortcutsEnabled) {
            if (WL.xrSession) {
                this._onXRSessionStart(WL.xrSession);
            }
            WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        }
    },
    update: function (dt) {
    },
    _onXRSessionStart: function (session) {
        if (PP.XRUtils.isDeviceEmulated() && Global.myIsLocalhost && Global.myDebugShortcutsEnabled) {
            Global.myDebugShortcutsPress = 1;
        } else {
            Global.myDebugShortcutsPress = 2;
        }
    }
});

