WL.registerComponent('debug-global-data', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
}, {
    init: function () {
        PP.DebugData.myRootObject = WL.scene.addObject(null);

        PP.DebugData.myCubeMesh = this._myCubeMesh;
        PP.DebugData.myFlatMaterial = this._myFlatMaterial;
    },
});

PP.DebugData = {
    myRootObject: null,
    myCubeMesh: null,
    myFlatMaterial: null
};