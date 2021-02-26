PP.GamepadManager = class GamepadManager {

    constructor() {
        this.startSelectEvents = []
        this.endSelectEvents = []
        this.startSqueezeEvents = []
        this.endSqueezeEvents = []
    }

    start() {
        if (WL.xrSession) {
            this.setupVREvents(WL.xrSession);
        } else {
            WL.onXRSessionStart.push(this.setupVREvents.bind(this));
        }
    }

    update(dt) {
    }

    registerStartSelect(callback, handedness) {
        this.startSelectEvents.push([callback, handedness])
    }

    registerEndSelect(callback, handedness) {
        this.endSelectEvents.push([callback, handedness])
    }

    registerStartSqueeze(callback, handedness) {
        this.startSqueezeEvents.push([callback, handedness])
    }

    registerEndSqueeze(callback, handedness) {
        this.endSqueezeEvents.push([callback, handedness])
    }

    forwardEvent(callbackList, event) {
        callbackList.forEach(function (element) {
            if (event.inputSource.handedness == element[1]) {
                element[0](event);
            }
        });
    }

    setupVREvents(s) {
        this.session = s;
        s.addEventListener('end', function (e) {
            this.session = null;
            this.rightGamepad = null;
            this.leftGamepad = null;
        }.bind(this));

        s.addEventListener('inputsourceschange', function (e) {
            if (e.added) {
                for (var i = 0; i < e.added.length; i++) {
                    if (e.added[i].handedness == GamepadManager.right) {
                        this.rightGamepad = e.added[i].gamepad;
                    } else if (e.added[i].handedness == GamepadManager.left) {
                        this.leftGamepad = e.added[i].gamepad;
                    } else {
                        console.log('unkown input source added');
                    }
                }
            }
        }.bind(this));

        s.addEventListener('selectstart', this.forwardEvent.bind(this, this.startSelectEvents));
        s.addEventListener('selectend', this.forwardEvent.bind(this, this.endSelectEvents));

        s.addEventListener('squeezestart', this.forwardEvent.bind(this, this.startSqueezeEvents));
        s.addEventListener('squeezeend', this.forwardEvent.bind(this, this.endSqueezeEvents));
    }
};

PP.GamepadManager.Handedness =
{
    LEFT: "left",
    RIGHT: "right"
};