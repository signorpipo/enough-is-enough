WL.registerComponent('pp-debug-global-data', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _mySphereMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
    _myTextMaterial: { type: WL.Type.Material },
    _myHandLeft: { type: WL.Type.Object },
    _myHandRight: { type: WL.Type.Object }
}, {
    init: function () {
        PP.myDebugData.myRootObject = WL.scene.addObject(null);

        PP.myDebugData.myCubeMesh = this._myCubeMesh;
        PP.myDebugData.mySphereMesh = this._mySphereMesh;
        PP.myDebugData.myFlatMaterial = this._myFlatMaterial;
        PP.myDebugData.myTextMaterial = this._myTextMaterial;
        PP.myDebugData.myHandLeft = this._myHandLeft;
        PP.myDebugData.myHandRight = this._myHandRight;
    },
});

PP.myDebugData = {
    myRootObject: null,
    myCubeMesh: null,
    mySphereMesh: null,
    myFlatMaterial: null,
    myTextMaterial: null,
    myHandLeft: null,
    myHandRight: null
};