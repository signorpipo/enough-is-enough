WL.registerComponent('evidence-objects', {
    _myStoryTimer: { type: WL.Type.Object },
    _myVentTimer: { type: WL.Type.Object },
    _myTuciaDrawing: { type: WL.Type.Object },
    _myCPlusPlusPrimer: { type: WL.Type.Object },
    _myPiano: { type: WL.Type.Object },
    _myMiccoTheBear: { type: WL.Type.Object },
    _myStaringCube: { type: WL.Type.Object },
    _myWaterLily: { type: WL.Type.Object },
    _myLoL: { type: WL.Type.Object },
    _myDrinkMeEarring: { type: WL.Type.Object },
    _mySkate: { type: WL.Type.Object },
    _myNotCoin: { type: WL.Type.Object },
    _myPsi: { type: WL.Type.Object },
    _myWonderland: { type: WL.Type.Object },
    _myEthereum: { type: WL.Type.Object },
    _myMrNOTEvidence: { type: WL.Type.Object },
    _myHeart: { type: WL.Type.Object },
    _myAntMainCharacter: { type: WL.Type.Object },
    _myHaloSword: { type: WL.Type.Object },
    _myFox: { type: WL.Type.Object },
    _myPICO_8: { type: WL.Type.Object },
    _myEggplant: { type: WL.Type.Object },
    _myVR: { type: WL.Type.Object },
    _myTrophy: { type: WL.Type.Object },
    _myFamily: { type: WL.Type.Object },
    _myMirror: { type: WL.Type.Object },
    _myWayfinder: { type: WL.Type.Object },
    _myEveryeye: { type: WL.Type.Object },
    _myAloeVera: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer);
        Global.myGameObjects.set(GameObjectType.VENT_TIMER, this._myVentTimer);
        Global.myGameObjects.set(GameObjectType.TUCIA_DRAWING, this._myTuciaDrawing);
        Global.myGameObjects.set(GameObjectType.CPLUSPLUS_PRIMER, this._myCPlusPlusPrimer);
        Global.myGameObjects.set(GameObjectType.PIANO, this._myPiano);
        Global.myGameObjects.set(GameObjectType.MICCO_THE_BEAR, this._myMiccoTheBear);
        Global.myGameObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube);
        Global.myGameObjects.set(GameObjectType.WATER_LILY, this._myWaterLily);
        Global.myGameObjects.set(GameObjectType.LOL, this._myLoL);
        Global.myGameObjects.set(GameObjectType.DRINK_ME_EARRING, this._myDrinkMeEarring);
        Global.myGameObjects.set(GameObjectType.SKATE, this._mySkate);
        Global.myGameObjects.set(GameObjectType.SHATTERED_COIN, this._myNotCoin);
        Global.myGameObjects.set(GameObjectType.PSI, this._myPsi);
        Global.myGameObjects.set(GameObjectType.WONDERLAND, this._myWonderland);
        Global.myGameObjects.set(GameObjectType.ETHEREUM, this._myEthereum);
        Global.myGameObjects.set(GameObjectType.MR_NOT_EVIDENCE, this._myMrNOTEvidence);
        Global.myGameObjects.set(GameObjectType.HEART, this._myHeart);
        Global.myGameObjects.set(GameObjectType.ANT_MAIN_CHARACTER, this._myAntMainCharacter);
        Global.myGameObjects.set(GameObjectType.HALO_SWORD, this._myHaloSword);
        Global.myGameObjects.set(GameObjectType.FOX, this._myFox);
        Global.myGameObjects.set(GameObjectType.PICO_8, this._myPICO_8);
        Global.myGameObjects.set(GameObjectType.EGGPLANT, this._myEggplant);
        Global.myGameObjects.set(GameObjectType.VR, this._myVR);
        Global.myGameObjects.set(GameObjectType.TROPHY, this._myTrophy);
        Global.myGameObjects.set(GameObjectType.FAMILY, this._myFamily);
        Global.myGameObjects.set(GameObjectType.MIRROR, this._myMirror);
        Global.myGameObjects.set(GameObjectType.WAYFINDER, this._myWayfinder);
        Global.myGameObjects.set(GameObjectType.EVERYEYE, this._myEveryeye);
        Global.myGameObjects.set(GameObjectType.ALOE_VERA, this._myAloeVera);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        cloneParams.myComponentsToInclude.push("text");
        cloneParams.myComponentsToInclude.push("text-color-fog");
        Global.myMeshObjects.set(GameObjectType.STORY_TIMER, this._myStoryTimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.VENT_TIMER, this._myVentTimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.TUCIA_DRAWING, this._myTuciaDrawing.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.CPLUSPLUS_PRIMER, this._myCPlusPlusPrimer.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PIANO, this._myPiano.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MICCO_THE_BEAR, this._myMiccoTheBear.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.STARING_CUBE, this._myStaringCube.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WATER_LILY, this._myWaterLily.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.LOL, this._myLoL.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.DRINK_ME_EARRING, this._myDrinkMeEarring.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.SKATE, this._mySkate.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.SHATTERED_COIN, this._myNotCoin.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PSI, this._myPsi.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WONDERLAND, this._myWonderland.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ETHEREUM, this._myEthereum.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MR_NOT_EVIDENCE, this._myMrNOTEvidence.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.HEART, this._myHeart.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ANT_MAIN_CHARACTER, this._myAntMainCharacter.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.HALO_SWORD, this._myHaloSword.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FOX, this._myFox.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.PICO_8, this._myPICO_8.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.EGGPLANT, this._myEggplant.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.VR, this._myVR.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.TROPHY, this._myTrophy.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FAMILY, this._myFamily.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MIRROR, this._myMirror.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WAYFINDER, this._myWayfinder.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.EVERYEYE, this._myEveryeye.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ALOE_VERA, this._myAloeVera.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

