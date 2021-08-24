WL.registerComponent("pp-audio-manager", {
}, {
    init: function () {
        PP.AudioManager = new PP.AudioManagerClass();
    },
    start: function () {
    },
    update: function (dt) {
    }
});

PP.AudioManager = null;