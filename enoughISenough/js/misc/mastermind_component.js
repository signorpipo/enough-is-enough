WL.registerComponent('eie-mastermind', {
}, {
    init: function() {
        PP.masterMind = new PP.MasterMind();
    },
    start: function() {
        PP.masterMind.start();
    },
    update: function(dt) {
        PP.masterMind.update(dt);
    },
});