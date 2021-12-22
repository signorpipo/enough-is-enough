WL.registerComponent('menu-objects', {
    _myCoin: { type: WL.Type.Object },
    _myNotCoin: { type: WL.Type.Object },
    _myArcadeStickHard: { type: WL.Type.Object },
    _myArcadeStickNormal: { type: WL.Type.Object },
    _myArcadLeaderboardeHard: { type: WL.Type.Object },
    _myArcadLeaderboardeNormal: { type: WL.Type.Object },
    _myWondermelon: { type: WL.Type.Object },
    _myZestyMarket: { type: WL.Type.Object },
    _myFloppyDisk: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.COIN, this._myCoin);
        Global.myGameObjects.set(GameObjectType.NOT_COIN, this._myNotCoin);
        Global.myGameObjects.set(GameObjectType.ARCADE_STICK_HARD, this._myArcadeStickHard);
        Global.myGameObjects.set(GameObjectType.ARCADE_STICK_NORMAL, this._myArcadeStickNormal);
        Global.myGameObjects.set(GameObjectType.ARCADE_LEADERBOARD_HARD, this._myArcadLeaderboardeHard);
        Global.myGameObjects.set(GameObjectType.ARCADE_LEADERBOARD_NORMAL, this._myArcadLeaderboardeNormal);
        Global.myGameObjects.set(GameObjectType.WONDERMELON, this._myWondermelon);
        Global.myGameObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket);
        Global.myGameObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        cloneParams.myComponentsToInclude.push("text");
        cloneParams.myComponentsToInclude.push("text-color-fog");
        Global.myMeshObjects.set(GameObjectType.COIN, this._myCoin.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.NOT_COIN, this._myNotCoin.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_STICK_HARD, this._myArcadeStickHard.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_STICK_NORMAL, this._myArcadeStickNormal.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_LEADERBOARD_HARD, this._myArcadLeaderboardeHard.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_LEADERBOARD_NORMAL, this._myArcadLeaderboardeNormal.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WONDERMELON, this._myWondermelon.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

