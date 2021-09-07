WL.registerComponent("enough-IS-enough-gateway", {
    _myRingsAnimator: { type: WL.Type.Object }
}, {
    init: function () {
        this.enoughISenough = new enoughISenough();

        Global.myRingsAnimator = this._myRingsAnimator.pp_getComponent("rings-animator");
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
    myRingsAnimator: null
};