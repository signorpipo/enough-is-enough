WL.registerComponent('test-audio', {
}, {
    init: function () {
    },
    start: function () {
        this.timer = new PP.Timer(1.2);
    },
    update: function (dt) {
        this.timer.update(dt);
        if (this.timer.isDone()) {
            this.timer.reset();

            let player = PP.AudioManager.createAudioPlayer(SfxID.NOT_ENOUGH);
            player.play();
            player.registerAudioEventListener(PP.AudioEvent.END, this, function (id) { console.log(id); });
        }
    }
});