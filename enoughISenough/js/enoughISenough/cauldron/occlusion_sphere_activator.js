WL.registerComponent('occlusion-sphere-activator', {
    _myOcclusionSphere: { type: WL.Type.Object }
}, {
    start: function () {
        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    _onXRSessionStart(session) {
        this._myOcclusionSphere.pp_setActive(false);
    },
    _onXRSessionEnd() {
        this._myOcclusionSphere.pp_setActive(true);
    }
});