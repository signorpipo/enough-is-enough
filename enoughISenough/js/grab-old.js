WL.registerComponent('eie-grab-old', {
}, {
    init: function() {
        WL.canvas.addEventListener('mousedown', this.startGrab.bind(this));
        WL.canvas.addEventListener('mouseup', this.endGrab.bind(this));
    },
    update: function(dt) {
    },
    start: function() {
        WL.onXRSessionStart.push(this.setupVREvents.bind(this));
    },
    setupVREvents: function(s) {
        this.session = s;
        s.addEventListener('end', function(e) {
            this.session = null;
            this.rightGamepad = null;
            this.leftGamepad = null;
        }.bind(this));

        s.addEventListener('inputsourceschange' ,function(e) {
        if(e.added && e.added.length) {
            for (var i = 0; i < e.added.length; i++) {
            if(e.added[i].handedness == "right") {
                this.rightGamepad = e.added[i].gamepad;
            } else {
                this.leftGamepad = e.added[i].gamepad;
            }
            }
        }
        }.bind(this));

        s.addEventListener('selectstart', this.startGrab.bind(this));

        s.addEventListener('selectend', this.endGrab.bind(this));


    },
    startGrab: function(e) {
        console.log('start grab old');
    },
    endGrab: function(e) {
        console.log('end grab old');
    },
});