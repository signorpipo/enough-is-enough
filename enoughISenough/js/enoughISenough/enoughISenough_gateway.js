WL.registerComponent("enough-IS-enough-gateway", {
    _myRingsAnimator: { type: WL.Type.Object },
    _myLeftHandAnimator: { type: WL.Type.Object },
    _myRightHandAnimator: { type: WL.Type.Object },
}, {
    init: function () {
        this.enoughISenough = new enoughISenough();

        Global.myScene = this.object;

        Global.myRingsAnimator = this._myRingsAnimator.pp_getComponent("rings-animator");
        Global.myLeftHandAnimator = this._myLeftHandAnimator.pp_getComponent("hand-animator");
        Global.myRightHandAnimator = this._myRightHandAnimator.pp_getComponent("hand-animator");
    },
    start: function () {
        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Float", 0, 0.1, 3));
        PP.EasyTuneVariables.add(new PP.EasyTuneInt("Int", 0, 1));
        PP.EasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));

        this.enoughISenough.start();
    },
    update: function (dt) {
        this.enoughISenough.update(dt);
    }
});

var Global = {
    myScene: null,
    myRingsAnimator: null,
    myLeftHandAnimator: null,
    myRightHandAnimator: null,
};