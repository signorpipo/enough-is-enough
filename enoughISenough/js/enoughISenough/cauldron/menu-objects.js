WL.registerComponent('menu-objects', {
    _myStartStory: { type: WL.Type.Object },
    _myStartArcadeHard: { type: WL.Type.Object },
    _myStartArcadeNormal: { type: WL.Type.Object },
    _myLeaderboardArcadeHard: { type: WL.Type.Object },
    _myLeaderboardArcadeNormal: { type: WL.Type.Object },
    _myWondermelon: { type: WL.Type.Object },
    _myZestyMarket: { type: WL.Type.Object },
    _myFloppyDisk: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myMenuObjects = new Map();

        Global.myMenuObjects.set(MenuObjectType.START_STORY, this._myStartStory);
        Global.myMenuObjects.set(MenuObjectType.START_ARCADE_HARD, this._myStartArcadeHard);
        Global.myMenuObjects.set(MenuObjectType.START_ARCADE_NORMAL, this._myStartArcadeNormal);
        Global.myMenuObjects.set(MenuObjectType.LEADERBOARD_ARCADE_HARD, this._myLeaderboardArcadeHard);
        Global.myMenuObjects.set(MenuObjectType.LEADERBOARD_ARCADE_NORMAL, this._myLeaderboardArcadeNormal);
        Global.myMenuObjects.set(MenuObjectType.WONDERMELON, this._myWondermelon);
        Global.myMenuObjects.set(MenuObjectType.ZESTY_MARKET, this._myZestyMarket);
        Global.myMenuObjects.set(MenuObjectType.FLOPPY_DISK, this._myFloppyDisk);
    },
    start: function () {
    },
    update: function (dt) {
    },
});

var MenuObjectType = {
    START_STORY: 0,
    START_ARCADE_HARD: 1,
    START_ARCADE_NORMAL: 2,
    LEADERBOARD_ARCADE_HARD: 3,
    LEADERBOARD_ARCADE_NORMAL: 4,
    WONDERMELON: 5,
    ZESTY_MARKET: 6,
    FLOPPY_DISK: 7
};

