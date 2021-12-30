WL.registerComponent('menu-objects', {
    _myCoin: { type: WL.Type.Object },
    _myNotCoin: { type: WL.Type.Object },
    _myArcadeStickDispute: { type: WL.Type.Object },
    _myArcadeStickChat: { type: WL.Type.Object },
    _myArcadLeaderboardeDispute: { type: WL.Type.Object },
    _myArcadLeaderboardeChat: { type: WL.Type.Object },
    _myWondermelon: { type: WL.Type.Object },
    _myZestyMarket: { type: WL.Type.Object },
    _myFloppyDisk: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.COIN, this._myCoin);
        Global.myGameObjects.set(GameObjectType.NOT_COIN, this._myNotCoin);
        Global.myGameObjects.set(GameObjectType.ARCADE_STICK_DISPUTE, this._myArcadeStickDispute);
        Global.myGameObjects.set(GameObjectType.ARCADE_STICK_CHAT, this._myArcadeStickChat);
        Global.myGameObjects.set(GameObjectType.ARCADE_LEADERBOARD_DISPUTE, this._myArcadLeaderboardeDispute);
        Global.myGameObjects.set(GameObjectType.ARCADE_LEADERBOARD_CHAT, this._myArcadLeaderboardeChat);
        Global.myGameObjects.set(GameObjectType.WONDERMELON, this._myWondermelon);
        Global.myGameObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket);
        Global.myGameObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        Global.myMeshObjects.set(GameObjectType.ARCADE_STICK_DISPUTE, this._myArcadeStickDispute.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_STICK_CHAT, this._myArcadeStickChat.pp_clone(cloneParams));

        cloneParams.myComponentsToInclude.push("text");
        cloneParams.myComponentsToInclude.push("text-color-fog");
        Global.myMeshObjects.set(GameObjectType.COIN, this._myCoin.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.NOT_COIN, this._myNotCoin.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_LEADERBOARD_DISPUTE, this._myArcadLeaderboardeDispute.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ARCADE_LEADERBOARD_CHAT, this._myArcadLeaderboardeChat.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WONDERMELON, this._myWondermelon.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

