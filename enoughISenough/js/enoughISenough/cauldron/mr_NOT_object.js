WL.registerComponent('mr_NOT_object', {
    _myMrNOT: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.MR_NOT, this._myMrNOT);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToClone.push("mesh");
        Global.myMeshObjects.set(GameObjectType.MR_NOT, this._myMrNOT.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

