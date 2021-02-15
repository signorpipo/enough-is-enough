WL.registerComponent('eie-grab', {
}, {
    init: function() {
        this.gamepad = new Gamepad();
        this.gamepad.registerStartGrab(this.startGrab);
        this.gamepad.registerEndGrab(this.endGrab);
    },
    start: function() {
        this.gamepad.start()
    },
    update: function(dt) {
    },
    startGrab: function(e) {
        console.log('start grab');
    },
    endGrab: function(e) {
        console.log('end grab');
    },
});