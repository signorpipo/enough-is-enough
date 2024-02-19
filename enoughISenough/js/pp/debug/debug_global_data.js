WL.registerComponent('pp-debug-global-data', {
    _myPlaneMesh: { type: WL.Type.Mesh },
    _myCubeMesh: { type: WL.Type.Mesh },
    _mySphereMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
    _myPhongMaterial: { type: WL.Type.Material },
    _myTextMaterial: { type: WL.Type.Material },
    _myHandLeft: { type: WL.Type.Object },
    _myHandRight: { type: WL.Type.Object }
}, {
    init: function () {
        PP.myDebugData.myRootObject = WL.scene.addObject(null);

        PP.myDebugData.myPlaneMesh = this._myPlaneMesh;
        PP.myDebugData.myCubeMesh = this._myCubeMesh;
        PP.myDebugData.mySphereMesh = this._mySphereMesh;
        PP.myDebugData.myFlatMaterial = this._myFlatMaterial.clone();
        PP.myDebugData.myPhongMaterial = this._myPhongMaterial.clone();
        PP.myDebugData.myTextMaterial = this._myTextMaterial.clone();
        PP.myDebugData.myHandLeft = this._myHandLeft;
        PP.myDebugData.myHandRight = this._myHandRight;
    },
});

PP.myDebugData = {
    myRootObject: null,
    myPlaneMesh: null,
    myCubeMesh: null,
    mySphereMesh: null,
    myFlatMaterial: null,
    myPhongMaterial: null,
    myTextMaterial: null,
    myHandLeft: null,
    myHandRight: null,
    createTools: function (showVisibilityButton = true) {
        if (PP.myDebugData.myHandLeft.pp_getComponent("pp-easy-tune") == null) {
            PP.myDebugData.myHandLeft.addComponent("pp-easy-tune", {
                _myHandedness: 1,
                _myShowOnStart: false,
                _myShowVisibilityButton: showVisibilityButton,
                _myEnableAdditionalButtons: true,
                _myEnableChangeVariableShortcut: true,
                _myPlaneMaterial: PP.myDebugData.myFlatMaterial.clone(),
                _myTextMaterial: PP.myDebugData.myTextMaterial.clone()
            });
        }

        if (PP.myDebugData.myHandLeft.pp_getComponent("pp-console-vr") == null) {
            PP.myDebugData.myHandLeft.addComponent("pp-console-vr", {
                _myHandedness: 1,
                _myOverrideBrowserConsole: true,
                _myShowOnStart: false,
                _myShowVisibilityButton: showVisibilityButton,
                _myPulseOnNewMessage: 0,
                _myPlaneMaterial: PP.myDebugData.myFlatMaterial.clone(),
                _myTextMaterial: PP.myDebugData.myTextMaterial.clone()
            });
        }

        if (PP.myDebugData.myHandRight.pp_getComponent("pp-tool-cursor") == null) {
            PP.myDebugData.myHandLeft.addComponent("pp-tool-cursor", {
                _myHandedness: 2,
                _myPulseOnHover: false,
                _myShowFingerCursor: false,
                _myCursorMesh: PP.myDebugData.mySphereMesh,
                _myCursorMaterial: PP.myDebugData.myFlatMaterial.clone()
            });
        }
    }
};