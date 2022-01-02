WL.registerComponent("fireworks", {
}, {
    init: function () {
    },
    update() {
        if (PP.GamepadUtils.areButtonsPressEnd([PP.myRightGamepad, PP.ButtonType.SQUEEZE])) {
            Global.myParticlesManager.fireworks([0, 5, -5], 2.5, [3, 3, 3]);
        }
    }
});