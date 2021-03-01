PP.ButtonType = {
    SELECT: 0,
    SQUEEZE: 1,
    THUMBSTICK: 3,
    BUTTON_1: 4, // A or X button on oculus quest controller, also triggered for "touchpad" press on other controllers
    BUTTON_2: 5  // B or Y button
};


PP.ButtonEvent = {
    PRESSED_START: 0,
    PRESSED_END: 1,
    PRESSED: 2, //Every frame that it is pressed
    NOT_PRESSED: 3, //Every frame that it is not pressed
    TOUCHED_START: 4,
    TOUCHED_END: 5,
    TOUCHED: 6, //Every frame that it is touched
    NOT_TOUCHED: 7, //Every frame that it is not touched
    VALUE_CHANGED: 8,
    ALWAYS: 9, //callback every frame for this button
}

PP.ButtonInfo = class ButtonInfo {
    constructor() {
        this.myPressed = false;
        this.myPrevPressed = false;

        this.myTouched = false;
        this.myPrevTouched = false;

        this.myValue = 0.0;
        this.myPrevValue = 0.0;
    }
};

PP.Handedness =
{
    LEFT: "left",
    RIGHT: "right"
};

PP.Gamepad = class Gamepad {
    constructor(handedness) {
        this.myHandedness = handedness;

        this.myButtonInfos = [];
        for (let key in PP.ButtonType) {
            this.myButtonInfos[PP.ButtonType[key]] = new PP.ButtonInfo();
        }

        this._mySelectStart = false;
        this._mySelectEnd = false;
        this._mySqueezeStart = false;
        this._mySqueezeEnd = false;

        this.mySession = null;
        this.myGamepad = null;

        this.myCallbacks = [];
        for (let typeKey in PP.ButtonType) {
            this.myCallbacks[PP.ButtonType[typeKey]] = [];
            for (let eventKey in PP.ButtonEvent) {
                this.myCallbacks[PP.ButtonType[typeKey]][PP.ButtonEvent[eventKey]] = new Map(); //keys = object, item = callback
            }
        }
    }

    getButtonInfo(buttonType) {
        return this.myButtonInfos[buttonType];
    }

    //Callback parameters are (ButtonInfo, Gamepad)
    registerButtonEvent(buttonType, buttonEvent, id, callback) {
        this.myCallbacks[buttonType][buttonEvent].set(id, callback);
    }

    unRegisterButtonEvent(buttonType, buttonEvent, id) {
        this.myCallbacks[buttonType][buttonEvent].delete(id);
    }

    //For the lazy like me
    unregisterAllButtonEvents(id) {
        for (let typeKey in PP.ButtonType) {
            for (let eventKey in PP.ButtonEvent) {
                this.myCallbacks[PP.ButtonType[typeKey]][PP.ButtonEvent[eventKey]].delete(id);
            }
        }
    }

    isGamepadActive() {
        //connected == null is to fix webxr emulator that leaves that field undefined
        return this.myGamepad != null && (this.myGamepad.connected == null || this.myGamepad.connected);
    }

    start() {
        if (WL.xrSession) {
            this._setupVREvents(WL.xrSession);
        } else {
            WL.onXRSessionStart.push(this._setupVREvents.bind(this));
        }
    }

    update(dt) {
        this._preUpdateButtonInfos();
        this._updateButtonInfos();
        this._postUpdateButtonInfos();

    }

    _updateButtonInfos() {
        this._updateSelectAndSqueezePressed();
        this._updateSingleButtonInfo(PP.ButtonType.SELECT, false);
        this._updateSingleButtonInfo(PP.ButtonType.SQUEEZE, false);
        this._updateSingleButtonInfo(PP.ButtonType.THUMBSTICK, true);
        this._updateSingleButtonInfo(PP.ButtonType.BUTTON_1, true);
        this._updateSingleButtonInfo(PP.ButtonType.BUTTON_2, true);
    }

    //This sadly must be done this way to be the most compatible
    _updateSelectAndSqueezePressed() {
        let buttonSelect = this.myButtonInfos[PP.ButtonType.SELECT];

        if (this._mySelectStart) {
            buttonSelect.myPressed = true;
        }
        if (this._mySelectEnd) {
            buttonSelect.myPressed = false;
        }

        let buttonSqueeze = this.myButtonInfos[PP.ButtonType.SQUEEZE];
        if (this._mySqueezeStart) {
            buttonSqueeze.myPressed = true;
        }

        if (this._mySqueezeEnd) {
            buttonSqueeze.myPressed = false;
        }
    }

    _updateSingleButtonInfo(buttonType, updatePressed) {
        let button = this.myButtonInfos[buttonType];
        let internalButton = this._getInternalButton(buttonType);

        if (updatePressed) {
            button.myPressed = internalButton.pressed;
        }

        button.myTouched = internalButton.touched;
        button.myValue = internalButton.value;
    }

    _preUpdateButtonInfos() {
        this.myButtonInfos.forEach(function (item) {
            item.myPrevPressed = item.myPressed;
            item.myPrevTouched = item.myTouched;
            item.myPrevValue = item.myValue;
        });
    }

    _postUpdateButtonInfos() {
        for (let typeKey in PP.ButtonType) {
            let buttonInfo = this.myButtonInfos[PP.ButtonType[typeKey]];
            let buttonCallbacks = this.myCallbacks[PP.ButtonType[typeKey]];

            if (buttonInfo.myPressed && !buttonInfo.myPrevPressed) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.PRESSED_START];
                for (let value of callbacksMap.values()) {
                    value(buttonInfo, this);
                }
            }

            if (!buttonInfo.myPressed && buttonInfo.myPrevPressed) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.PRESSED_END];
                for (let value of callbacksMap.values()) {
                    value(buttonInfo, this);
                }
            }

            //All other events
        }

        this._mySelectStart = false;
        this._mySelectEnd = false;
        this._mySqueezeStart = false;
        this._mySqueezeEnd = false;
    }

    _getInternalButton(buttonType) {
        let buttonData = { pressed: false, touched: false, value: 0 };
        if (this.isGamepadActive()) {
            if (buttonType < this.myGamepad.buttons.length) {
                buttonData = this.myGamepad.buttons[buttonType];

                //This way if you are using a basic touch controller button 1 will work anyway
                if (buttonType == PP.ButtonType.BUTTON_1) {
                    let buttonDataTouch = this.myGamepad.buttons[2];
                    buttonData.pressed = buttonData.pressed | buttonDataTouch.pressed;
                    buttonData.touched = buttonData.touched | buttonDataTouch.touched;
                    buttonData.value = Math.max(buttonData.value, buttonDataTouch.value);
                }

            } else if (buttonType == PP.ButtonType.BUTTON_1 && this.myGamepad.buttons.length >= 3) {
                buttonData = this.myGamepad.buttons[2]; //the basic touch controller could be connected
            }
        }

        return buttonData;
    }

    _setupVREvents(s) {
        this.mySession = s;

        this.mySession.addEventListener('end', function (event) {
            this.mySession = null;
            this.myGamepad = null;
        }.bind(this));

        this.mySession.addEventListener('inputsourceschange', function (event) {
            if (event.added) {
                for (let item of event.added) {
                    if (item.handedness == this.myHandedness) {
                        this.myGamepad = item.gamepad;
                    }
                }
            }

            if (event.removed) {
                for (let item of event.removed) {
                    if (item.handedness == this.myHandedness) {
                        this.myGamepad = null;
                    }
                }
            }
        }.bind(this));

        this.mySession.addEventListener('selectstart', this._selectStart.bind(this));
        this.mySession.addEventListener('selectend', this._selectEnd.bind(this));

        this.mySession.addEventListener('squeezestart', this._squeezeStart.bind(this));
        this.mySession.addEventListener('squeezeend', this._squeezeEnd.bind(this));
    }

    //Select and Squeeze are managed this way to be more compatible
    _selectStart(event) {
        if (event.inputSource.handedness == this.myHandedness) {
            this._mySelectStart = true;
        }
    }

    _selectEnd(event) {
        if (event.inputSource.handedness == this.myHandedness) {
            this._mySelectEnd = true;
        }
    }

    _squeezeStart(event) {
        if (event.inputSource.handedness == this.myHandedness) {
            this._mySqueezeStart = true;
        }
    }

    _squeezeEnd(event) {
        if (event.inputSource.handedness == this.myHandedness) {
            this._mySqueezeEnd = true;
        }
    }
};