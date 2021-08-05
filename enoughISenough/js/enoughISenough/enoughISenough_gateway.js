WL.registerComponent("enough-IS-enough-gateway", {
}, {
    init: function () {
        this.enoughISenough = new enoughISenough();


        PP.EasyTuneVariables.addVariable(new PP.EasyTuneNumber("Float", 0, 0.1, 3));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Int", 0, 1));
        PP.EasyTuneVariables.addVariable(new PP.EasyTuneInteger("Bool", false));
    },
    start: function () {
        this.enoughISenough.start();
    },
    update: function (dt) {
        this.enoughISenough.update(dt);
    }
});