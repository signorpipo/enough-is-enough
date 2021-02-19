WL.registerComponent('eie-grab', {
}, {
    init: function() {
        var input = this.object.getComponent("input");

        MM.gamepadManager.registerStartSelect(this.startGrab, input.handedness);
        MM.gamepadManager.registerEndSelect(this.endGrab, input.handedness);
    },
    start: function() {
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