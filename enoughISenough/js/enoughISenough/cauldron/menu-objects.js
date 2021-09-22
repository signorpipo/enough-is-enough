WL.registerComponent('menu-objects', {
    _myStartArcade: { type: WL.Type.Object }
}, {
    init: function () {
        Global.myMenuObjects = new Map();

        Global.myMenuObjects.set(MenuObjectType.START_ARCADE, this._myStartArcade);
    },
    start: function () {
    },
    update: function (dt) {
    },
});

var MenuObjectType = {
    START_ARCADE: 0
};

