WL.registerComponent('evidence-objects', {
    _myStoryTimer: { type: WL.Type.Object },
    _myVentTimer: { type: WL.Type.Object },
    _myDrawing: { type: WL.Type.Object },
    _myCPlusPlus: { type: WL.Type.Object },
    _myPiano: { type: WL.Type.Object },
    _myFlagWaver: { type: WL.Type.Object },
    _myStaringCube: { type: WL.Type.Object },
    _myMeditation: { type: WL.Type.Object },
    _myLoL: { type: WL.Type.Object },
    _myEarring: { type: WL.Type.Object },
    _mySkating: { type: WL.Type.Object },
    _myUbisoft: { type: WL.Type.Object },
    _myPsychoterapy: { type: WL.Type.Object },
    _myWonderland: { type: WL.Type.Object },
    _myCrypto: { type: WL.Type.Object },
    _myMrNOTEvidence: { type: WL.Type.Object },
    _myHeart: { type: WL.Type.Object },
    _myGameDev: { type: WL.Type.Object },
    _myChenco: { type: WL.Type.Object },
    _myMarco: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer);
        Global.myGameObjects.set(GameObjectType.VENT_TIMER, this._myVentTimer);
        Global.myGameObjects.set(GameObjectType.DRAWING, this._myDrawing);
        Global.myGameObjects.set(GameObjectType.CPLUSPLUS, this._myCPlusPlus);
        Global.myGameObjects.set(GameObjectType.PIANO, this._myPiano);
        Global.myGameObjects.set(GameObjectType.FLAG_WAVER, this._myFlagWaver);
        Global.myGameObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube);
        Global.myGameObjects.set(GameObjectType.MEDITATION, this._myMeditation);
        Global.myGameObjects.set(GameObjectType.LOL, this._myLoL);
        Global.myGameObjects.set(GameObjectType.EARRING, this._myEarring);
        Global.myGameObjects.set(GameObjectType.SKATING, this._mySkating);
        Global.myGameObjects.set(GameObjectType.UBISOFT, this._myUbisoft);
        Global.myGameObjects.set(GameObjectType.PSYCHOTHERAPY, this._myPsychoterapy);
        Global.myGameObjects.set(GameObjectType.WONDERLAND, this._myWonderland);
        Global.myGameObjects.set(GameObjectType.CRYPTO, this._myCrypto);
        Global.myGameObjects.set(GameObjectType.MR_NOT_EVIDENCE, this._myMrNOTEvidence);
        Global.myGameObjects.set(GameObjectType.HEART, this._myHeart);
        Global.myGameObjects.set(GameObjectType.GAME_DEV, this._myGameDev);
        Global.myGameObjects.set(GameObjectType.CHENCO, this._myChenco);
        Global.myGameObjects.set(GameObjectType.MARCO, this._myMarco);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        cloneParams.myComponentsToInclude.push("text");
        Global.myMeshObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.VENT_TIMER, this._myVentTimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.DRAWING, this._myDrawing.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.CPLUSPLUS, this._myCPlusPlus.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PIANO, this._myPiano.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FLAG_WAVER, this._myFlagWaver.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MEDITATION, this._myMeditation.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.LOL, this._myLoL.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.EARRING, this._myEarring.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.SKATING, this._mySkating.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.UBISOFT, this._myUbisoft.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PSYCHOTHERAPY, this._myPsychoterapy.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WONDERLAND, this._myWonderland.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.CRYPTO, this._myCrypto.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MR_NOT_EVIDENCE, this._myMrNOTEvidence.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.HEART, this._myHeart.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.GAME_DEV, this._myGameDev.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.CHENCO, this._myChenco.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MARCO, this._myMarco.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

