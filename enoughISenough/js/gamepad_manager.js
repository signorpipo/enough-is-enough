class GamepadManager{

    constructor() {        
        this.startSelectEvents=[]
        this.endSelectEvents=[]
    }

    start(){
        if(WL.xrSession) {
            this.setupVREvents(WL.xrSession);
          } else {
            WL.onXRSessionStart.push(this.setupVREvents.bind(this));
          }
    }

    registerStartSelect(callback, handedness)
    {
        this.startSelectEvents.push([callback, handedness])      
    }
    
    registerEndSelect(callback, handedness)
    {
        this.endSelectEvents.push([callback, handedness])      
    }

    forwardEvent(callbackList, event){
        callbackList.forEach(function (element) {
            if(event.inputSource.handedness == element[1]){
                element[0](event);
            }
        });
    }

    setupVREvents(s) {
        this.session = s;
        s.addEventListener('end', function(e) {
            this.session = null;
            this.rightGamepad = null;
            this.leftGamepad = null;
        }.bind(this));

        s.addEventListener('inputsourceschange' ,function(e) {
            if(e.added) {
                for (var i = 0; i < e.added.length; i++) {
                    if(e.added[i].handedness == GamepadManager.right) {
                        this.rightGamepad = e.added[i].gamepad;
                    } else if(e.added[i].handedness == GamepadManager.left) {
                        this.leftGamepad = e.added[i].gamepad;
                    } else {
                        console.log('unkown input source added');
                    }
                }
            }
        }.bind(this));

        s.addEventListener('selectstart', this.forwardEvent.bind(this, this.startSelectEvents));

        s.addEventListener('selectend', this.forwardEvent.bind(this,this.endSelectEvents));
    }
}

GamepadManager.left ='left';
GamepadManager.right ='right';