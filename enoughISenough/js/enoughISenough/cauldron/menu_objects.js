WL.registerComponent('menu-objects', {
    _myStartStory: { type: WL.Type.Object },
    _myStartStoryCompleted: { type: WL.Type.Object },
    _myStartArcadeHard: { type: WL.Type.Object },
    _myStartArcadeNormal: { type: WL.Type.Object },
    _myLeaderboardArcadeHard: { type: WL.Type.Object },
    _myLeaderboardArcadeNormal: { type: WL.Type.Object },
    _myWondermelon: { type: WL.Type.Object },
    _myZestyMarket: { type: WL.Type.Object },
    _myFloppyDisk: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.START_STORY, this._myStartStory);
        Global.myGameObjects.set(GameObjectType.START_STORY_COMPLETED, this._myStartStoryCompleted);
        Global.myGameObjects.set(GameObjectType.START_ARCADE_HARD, this._myStartArcadeHard);
        Global.myGameObjects.set(GameObjectType.START_ARCADE_NORMAL, this._myStartArcadeNormal);
        Global.myGameObjects.set(GameObjectType.LEADERBOARD_ARCADE_HARD, this._myLeaderboardArcadeHard);
        Global.myGameObjects.set(GameObjectType.LEADERBOARD_ARCADE_NORMAL, this._myLeaderboardArcadeNormal);
        Global.myGameObjects.set(GameObjectType.WONDERMELON, this._myWondermelon);
        Global.myGameObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket);
        Global.myGameObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        cloneParams.myComponentsToInclude.push("text");
        cloneParams.myComponentsToInclude.push("text-color-fog");
        Global.myMeshObjects.set(GameObjectType.START_STORY, this._myStartStory.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.START_STORY_COMPLETED, this._myStartStoryCompleted.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.START_ARCADE_HARD, this._myStartArcadeHard.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.START_ARCADE_NORMAL, this._myStartArcadeNormal.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.LEADERBOARD_ARCADE_HARD, this._myLeaderboardArcadeHard.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.LEADERBOARD_ARCADE_NORMAL, this._myLeaderboardArcadeNormal.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.WONDERMELON, this._myWondermelon.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.ZESTY_MARKET, this._myZestyMarket.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.FLOPPY_DISK, this._myFloppyDisk.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

