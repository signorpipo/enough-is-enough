WL.registerComponent("pp-player-height", {
    _myEyesHeight: { type: WL.Type.Float, default: 1.65 }
}, {
    start: function () {
        this.object.setTranslationLocal([0, this._myEyesHeight, 0]);

        if (WL.xrSession) {
            this.onXRSessionStart(WL.xrSession);
        }

        WL.onXRSessionStart.push(this.onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this.onXRSessionEnd.bind(this));
    },
    onXRSessionStart: function () {
        if (!["local", "viewer"].includes(WebXR.refSpace)) {
            this.object.resetTranslation();
        }
    },
    onXRSessionEnd: function () {
        if (!["local", "viewer"].includes(WebXR.refSpace)) {
            this.object.setTranslationLocal([0, this._myEyesHeight, 0]);
        }
    }
});