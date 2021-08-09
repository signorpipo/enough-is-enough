WL.registerComponent("enough-IS-enough-gateway", {
}, {
    init: function () {
        this.enoughISenough = new enoughISenough();

        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Float", 0, 0.1, 3));
        PP.EasyTuneVariables.add(new PP.EasyTuneInt("Int", 0, 1));
        PP.EasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));
    },
    start: function () {
        this.enoughISenough.start();
    },
    update: function (dt) {
        this.enoughISenough.update(dt);
    }
});