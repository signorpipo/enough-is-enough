WL.registerComponent('eie-grab', {    
  releaseMomentumMultiplier: {type: WL.Type.Float, default: 1.0}
}, {
    init: function () {
        let input = this.object.getComponent("input");

        if (input) {
            MM.gamepadManager.registerStartSelect(this.startGrab.bind(this), input.handedness);
            MM.gamepadManager.registerEndSelect(this.endGrab.bind(this), input.handedness);
        }

        this.collider = this.object.getComponent('collision');

        this.grabbed = null;
    },
    start: function () {
    },
    update: function (dt) {
    },
    startGrab: function (e) {
        console.log('start grab');

        if (!this.grabbed) {
            let collidingComps = this.collider.queryOverlaps();
            for(let i=0; i< collidingComps.length; i++){
                let grabbable = collidingComps[i].object.getComponent("eie-grabbable");
                if(grabbable){
                    this.grabbed = grabbable;
                    this.grabbed.grab(this.object);
                    break;
                }
            }
        }
    },
    endGrab: function (e) {
        console.log('end grab');

        if (this.grabbed) {
            this.grabbed.release(this.releaseMomentumMultiplier, this.releaseMomentumMultiplier);
            this.grabbed = null;
        }
    }
});