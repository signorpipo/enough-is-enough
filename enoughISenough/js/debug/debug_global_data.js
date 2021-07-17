WL.registerComponent('debug-global-data', {
    _myCubeMesh: { type: WL.Type.Mesh },
    _myFlatMaterial: { type: WL.Type.Material },
}, {
    init: function () {
        DebugData.myRootObject = WL.scene.addObject(this.object);

        DebugData.myCubeMesh = this._myCubeMesh;
        DebugData.myFlatMaterial = this._myFlatMaterial;
    },
});

var DebugData = {
    myRootObject: null,
    myCubeMesh: null,
    myFlatMaterial: null
};