WL.registerComponent('eie-grab', {
}, {
    init: function() {
        var input = this.object.getComponent("input");

        MM.gamepadManager.registerStartSelect(this.startGrab.bind(this), input.handedness);
        MM.gamepadManager.registerEndSelect(this.endGrab.bind(this), input.handedness);
        
        this.collider = utilities.getComponentWithChildren(this.object, 'physx', 1);
        this.collider.onCollision(this.onCollision.bind(this));
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
    onCollision: function(a,b){
        console.log('collision');
    }
});