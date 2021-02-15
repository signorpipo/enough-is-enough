class Gamepad{
    constructor() {        
        this.startGrabEvents=[]
        this.endGrabEvents=[]
    }

    start(){
        WL.onXRSessionStart.push(this.setupVREvents.bind(this));
    }

    registerStartGrab(callback)
    {
        this.startGrabEvents.push(callback)      
    }
    
    registerEndGrab(callback)
    {
        this.endGrabEvents.push(callback)      
    }

    setupVREvents(s) {
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

        s.addEventListener('selectstart', this.forwardEvent.bind(this, this.startGrabEvents));

        s.addEventListener('selectend', this.forwardEvent.bind(this,this.endGrabEvents));
    }

    forwardEvent(callbackList, event){
        callbackList.forEach(function (element) {
            element(event)
        });
    }
}