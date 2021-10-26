WL.registerComponent('evidence-objects', {
    _myStoryTimer: { type: WL.Type.Object },
    _myDrawing: { type: WL.Type.Object },
    _myCPlusPlus: { type: WL.Type.Object },
    _myPiano: { type: WL.Type.Object },
    _myFlagWaver: { type: WL.Type.Object },
    _myStaringCube: { type: WL.Type.Object },
    _myMeditation: { type: WL.Type.Object },
    _myLoL: { type: WL.Type.Object },
    _myEarring: { type: WL.Type.Object },
    _mySkating: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer);
        Global.myGameObjects.set(GameObjectType.DRAWING, this._myDrawing);
        Global.myGameObjects.set(GameObjectType.CPLUSPLUS, this._myCPlusPlus);
        Global.myGameObjects.set(GameObjectType.PIANO, this._myPiano);
        Global.myGameObjects.set(GameObjectType.FLAG_WAVER, this._myFlagWaver);
        Global.myGameObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube);
        Global.myGameObjects.set(GameObjectType.MEDITATION, this._myMeditation);
        Global.myGameObjects.set(GameObjectType.LOL, this._myLoL);
        Global.myGameObjects.set(GameObjectType.EARRING, this._myEarring);
        Global.myGameObjects.set(GameObjectType.SKATING, this._mySkating);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToClone.push("mesh");
        Global.myMeshObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.DRAWING, this._myDrawing.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.CPLUSPLUS, this._myCPlusPlus.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PIANO, this._myPiano.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FLAG_WAVER, this._myFlagWaver.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MEDITATION, this._myMeditation.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.LOL, this._myLoL.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.EARRING, this._myEarring.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.SKATING, this._mySkating.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});
