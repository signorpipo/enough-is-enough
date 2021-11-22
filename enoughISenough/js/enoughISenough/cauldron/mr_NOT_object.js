WL.registerComponent('mr_NOT_object', {
    _myMrNOT: { type: WL.Type.Object },
    _myMrNOTClone: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myGameObjects.set(GameObjectType.MR_NOT, this._myMrNOT);
        Global.myGameObjects.set(GameObjectType.MR_NOT_CLONE, this._myMrNOTClone);

        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");
        Global.myMeshObjects.set(GameObjectType.MR_NOT, this._myMrNOT.pp_clone(cloneParams));
        Global.myMeshObjects.set(GameObjectType.MR_NOT_CLONE, this._myMrNOTClone.pp_clone(cloneParams));
    },
    start: function () {
    },
    update: function (dt) {
    },
});

