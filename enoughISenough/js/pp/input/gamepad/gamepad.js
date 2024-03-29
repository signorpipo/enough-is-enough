//If you don't want the PP "namespace" just search and replace PP. with empty string
//you must also add var in front of the enums (like var Handedness = {}) since now they are no longer child of PP
//and also remove the class assignment to the same name (like ButtonInfo = class ButtonInfo{}) since now they can be global

PP.ButtonType = {
    SELECT: 0,  //Trigger
    SQUEEZE: 1, //Grip
    THUMBSTICK: 3,
    BOTTOM_BUTTON: 4, // A or X button on oculus quest controller, also triggered for "touchpad" press on other controllers
    TOP_BUTTON: 5  // B or Y button
};

PP.ButtonEvent = {
    PRESS_START: 0,
    PRESS_END: 1,
    PRESSED: 2, //Every frame that it is pressed
    NOT_PRESSED: 3, //Every frame that it is not pressed
    TOUCH_START: 4,
    TOUCH_END: 5,
    TOUCHED: 6, //Every frame that it is touched
    NOT_TOUCHED: 7, //Every frame that it is not touched
    VALUE_CHANGED: 8,
    ALWAYS: 9, //callback every frame for this button
};

PP.ButtonInfo = class ButtonInfo {
    constructor() {
        this.myIsPressed = false;
        this.myPrevIsPressed = false;

        this.myIsTouched = false;
        this.myPrevIsTouched = false;

        this.myValue = 0.0;
        this.myPrevValue = 0.0;

        this.myTimePressed = 0;
        this.myPrevTimePressed = 0;

        this.myTimeNotPressed = 0;
        this.myPrevTimeNotPressed = 0;

        this.myTimeTouched = 0;
        this.myPrevTimeTouched = 0;

        this.myTimeNotTouched = 0;
        this.myPrevTimeNotTouched = 0;

        this.myMultiplePressStartCount = 0;
        this.myPrevMultiplePressStartCount = 0;
        this.myMultiplePressEndCount = 0;
        this.myPrevMultiplePressEndCount = 0;

        this.myMultipleTouchStartCount = 0;
        this.myPrevMultipleTouchStartCount = 0;
        this.myMultipleTouchEndCount = 0;
        this.myPrevMultipleTouchEndCount = 0;
    }

    getValue() {
        return this.myValue;
    }

    isPressed() {
        return this.myIsPressed;
    }

    isTouched() {
        return this.myIsTouched;
    }

    isPressStart(multiplePressCount = null) {
        return (this.myIsPressed && !this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressStartCount == multiplePressCount);
    }

    isPressEnd(multiplePressCount = null) {
        return (!this.myIsPressed && this.myPrevIsPressed) && (multiplePressCount == null || this.myMultiplePressEndCount == multiplePressCount);
    }

    isTouchStart(multipleTouchCount = null) {
        return (this.myIsTouched && !this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchStartCount == multipleTouchCount);
    }

    isTouchEnd(multipleTouchCount = null) {
        return (!this.myIsTouched && this.myPrevIsTouched) && (multipleTouchCount == null || this.myMultipleTouchEndCount == multipleTouchCount);
    }

    clone() {
        let value = new ButtonInfo();
        value.myIsPressed = this.myIsPressed;
        value.myPrevIsPressed = this.myPrevIsPressed;
        value.myIsTouched = this.myIsTouched;
        value.myPrevIsTouched = this.myPrevIsTouched;
        value.myValue = this.myValue;
        value.myPrevValue = this.myPrevValue;

        value.myTimePressed = this.myTimePressed;
        value.myPrevTimePressed = this.myPrevTimePressed;
        value.myTimeNotPressed = this.myTimeNotPressed;
        value.myPrevTimeNotPressed = this.myPrevTimeNotPressed;

        value.myTimeTouched = this.myTimeTouched;
        value.myPrevTimeTouched = this.myPrevTimeTouched;
        value.myTimeNotTouched = this.myTimeNotTouched;
        value.myPrevTimeNotTouched = this.myPrevTimeNotTouched;

        value.myMultiplePressStartCount = this.myMultiplePressStartCount;
        value.myPrevMultiplePressStartCount = this.myPrevMultiplePressStartCount;
        value.myMultiplePressEndCount = this.myMultiplePressEndCount;
        value.myPrevMultiplePressEndCount = this.myPrevMultiplePressEndCount;

        value.myMultipleTouchStartCount = this.myMultipleTouchStartCount;
        value.myPrevMultipleTouchStartCount = this.myPrevMultipleTouchStartCount;
        value.myMultipleTouchEndCount = this.myMultipleTouchEndCount;
        value.myPrevMultipleTouchEndCount = this.myPrevMultipleTouchEndCount;

        return value;
    }
};

PP.AxesEvent = {
    X_CHANGED: 0,
    Y_CHANGED: 1,
    AXES_CHANGED: 2,
    ALWAYS: 3
};

//index 0 is x, index 1 is y
PP.AxesInfo = class AxesInfo {
    constructor() {
        this.myAxes = new Float32Array(2);
        this.myAxes.fill(0.0);

        this.myPrevAxes = new Float32Array(2);
        this.myPrevAxes.fill(0.0);
    }

    clone() {
        let value = new AxesInfo();
        value.myAxes = this.myAxes;
        value.myPrevAxes = this.myPrevAxes;

        return value;
    }
};

PP.PulseInfo = class PulseInfo {
    constructor() {
        this.myIntensity = 0.0;
        this.myDuration = 0.0;

        this.myIsDevicePulsing = false; // true if the gamepad actually sent a request to pulse to the device
    }

    clone() {
        let value = new PulseInfo();
        value.myIntensity = this.myIntensity;
        value.myDuration = this.myDuration;
        value.myIsDevicePulsing = this.myIsDevicePulsing;

        return value;
    }
};

/**
 * Lets you easily retrieve the current state of a gamepad and register to events
 * 
 * xr-standard mapping is assumed for gamepad
 */
PP.Gamepad = class Gamepad {

    /**
     * @param {PP.Handedness} handedness specifies which controller this gamepad will represent, left or right
     */
    constructor(handedness) {
        this._myHandedness = handedness;

        this._myButtonInfos = [];
        for (let key in PP.ButtonType) {
            this._myButtonInfos[PP.ButtonType[key]] = new PP.ButtonInfo();
        }

        this._myAxesInfo = new PP.AxesInfo();

        this._mySelectPressed = false;
        this._mySqueezePressed = false;

        this._myIsXRSessionActive = false;
        this._myInputSource = null;
        this._myGamepad = null;
        this._myPrevInputSource = null;

        this._myButtonCallbacks = [];
        for (let typeKey in PP.ButtonType) {
            this._myButtonCallbacks[PP.ButtonType[typeKey]] = [];
            for (let eventKey in PP.ButtonEvent) {
                this._myButtonCallbacks[PP.ButtonType[typeKey]][PP.ButtonEvent[eventKey]] = new Map(); //keys = object, item = callback
            }
        }

        this._myAxesCallbacks = [];
        for (let eventKey in PP.AxesEvent) {
            this._myAxesCallbacks[PP.AxesEvent[eventKey]] = new Map(); //keys = object, item = callback
        }

        this._myPulseInfo = new PP.PulseInfo();

        //Setup
        this._myMultiplePressMaxDelay = 0.3;
        this._myMultipleTouchMaxDelay = 0.3;
    }

    /**
     * @returns {PP.Handedness}
     */
    getHandedness() {
        return this._myHandedness;
    }

    /**
     * @param {PP.ButtonType} buttonType
     * @returns {PP.ButtonInfo}
     */
    getButtonInfo(buttonType) {
        return this._myButtonInfos[buttonType].clone();
    }

    /**
     * @param {PP.ButtonType} buttonType 
     * @param {PP.ButtonEvent} buttonEvent 
     * @param id 
     * @param callback callback params are (PP.ButtonInfo, PP.Gamepad)
     */
    registerButtonEventListener(buttonType, buttonEvent, id, callback) {
        this._myButtonCallbacks[buttonType][buttonEvent].set(id, callback);
    }

    /**
     * @param {PP.ButtonType} buttonType 
     * @param {PP.ButtonEvent} buttonEvent 
     * @param id 
     */
    unregisterButtonEventListener(buttonType, buttonEvent, id) {
        this._myButtonCallbacks[buttonType][buttonEvent].delete(id);
    }

    /**
     * @returns {PP.AxesInfo}
     */
    getAxesInfo() {
        return this._myAxesInfo.clone();
    }

    /**
     * @param {PP.AxesEvent} axesEvent 
     * @param id 
     * @param callback callback parameters are (AxesInfo, Gamepad)
     */
    registerAxesEventListener(axesEvent, id, callback) {
        this._myAxesCallbacks[axesEvent].set(id, callback);
    }

    /**
     * @param {PP.AxesEvent} axesEvent 
     * @param id 
     */
    unregisterAxesEventListener(axesEvent, id) {
        this._myAxesCallbacks[axesEvent].delete(id);
    }

    /**
     * @returns {boolean}
     */
    isGamepadActive() {
        //connected == null is to fix webxr emulator that leaves that field undefined
        return this._myIsXRSessionActive && this._myGamepad != null && (this._myGamepad.connected == null || this._myGamepad.connected);
    }

    /**
     * pulse, rumble, vibration, whatever
     * @param {number} intensity range from 0 to 1
     * @param {number} duration specified in seconds, 0 means 1 frame
     */
    pulse(intensity, duration = 0) {
        this._myPulseInfo.myIntensity = Math.min(Math.max(intensity, 0), 1); //clamp 
        this._myPulseInfo.myDuration = Math.max(duration, 0);
    }

    stopPulse() {
        this._myPulseInfo.myIntensity = 0;
        this._myPulseInfo.myDuration = 0;
    }

    isPulsing() {
        return this._myPulseInfo.myIntensity > 0 || this._myPulseInfo.myDuration > 0;
    }

    getPulseInfo() {
        return this._myPulseInfo.clone();
    }

    getMultiplePressMaxDelay() {
        return this._myMultiplePressMaxDelay;
    }

    setMultiplePressMaxDelay(maxDelay) {
        this._myMultiplePressMaxDelay = maxDelay;
    }

    getMultipleTouchMaxDelay() {
        return this._myMultipleTouchMaxDelay;
    }

    setMultipleTouchMaxDelay(maxDelay) {
        this._myMultipleTouchMaxDelay = maxDelay;
    }

    start() {
        if (WL.xrSession) {
            this._onXRSessionStart(true, WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this, false));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    update(dt) {
        if (this._myPrevInputSource != this._myInputSource) {
            this._mySelectPressed = false;
            this._mySqueezePressed = false;
        }
        this._myPrevInputSource = this._myInputSource;

        this._preUpdateButtonInfos();
        this._updateButtonInfos();
        this._postUpdateButtonInfos(dt);

        this._preUpdateAxesInfos();
        this._updateAxesInfos();
        this._postUpdateAxesInfos();

        this._updatePulse(dt);
    }

    _preUpdateButtonInfos() {
        this._myButtonInfos.forEach(function (item) {
            item.myPrevIsPressed = item.myIsPressed;
            item.myPrevIsTouched = item.myIsTouched;
            item.myPrevValue = item.myValue;
        });
    }

    _updateButtonInfos() {
        this._updateSelectAndSqueezePressed();
        this._updateSingleButtonInfo(PP.ButtonType.SELECT, false);
        this._updateSingleButtonInfo(PP.ButtonType.SQUEEZE, false);
        this._updateSingleButtonInfo(PP.ButtonType.THUMBSTICK, true);
        this._updateSingleButtonInfo(PP.ButtonType.BOTTOM_BUTTON, true);
        this._updateSingleButtonInfo(PP.ButtonType.TOP_BUTTON, true);

        let inputSourceType = PP.InputUtils.getInputSourceType(this._myHandedness);
        if (inputSourceType != PP.InputSourceType.GAMEPAD) {
            if (inputSourceType == PP.InputSourceType.HAND) {
                this._updateHandSqueeze();
            }
        }
    }

    _updateHandSqueeze() {

    }

    //This sadly must be done this way to be the most compatible
    _updateSelectAndSqueezePressed() {
        let buttonSelect = this._myButtonInfos[PP.ButtonType.SELECT];
        buttonSelect.myIsPressed = this._mySelectPressed;

        let buttonSqueeze = this._myButtonInfos[PP.ButtonType.SQUEEZE];
        buttonSqueeze.myIsPressed = this._mySqueezePressed;

        if (!this.isGamepadActive()) {
            buttonSelect.myIsPressed = false;
            buttonSqueeze.myIsPressed = false;
        }
    }

    _updateSingleButtonInfo(buttonType, updatePressed) {
        let button = this._myButtonInfos[buttonType];
        let internalButton = this._getInternalButton(buttonType);

        if (updatePressed) {
            button.myIsPressed = internalButton.pressed;
        }

        button.myIsTouched = internalButton.touched;
        button.myValue = internalButton.value;

        if (button.myIsPressed) {
            button.myIsTouched = true;

            if (button.myValue == 0) {
                button.myValue = 1;
            }
        }
    }

    _postUpdateButtonInfos(dt) {
        this._myButtonInfos.forEach(function (item) {
            if (item.myIsPressed) {
                item.myTimePressed += dt;
                if (!item.myPrevIsPressed) {
                    item.myMultiplePressStartCount += 1;

                    item.myPrevTimeNotPressed = item.myTimeNotPressed;
                    item.myTimeNotPressed = 0;
                }

                if (item.myPrevTimeNotPressed + item.myTimePressed > this._myMultiplePressMaxDelay && item.myMultiplePressEndCount > 0) {
                    item.myPrevMultiplePressEndCount = item.myMultiplePressEndCount;
                    item.myMultiplePressEndCount = 0;
                }

                if (item.myTimePressed > this._myMultiplePressMaxDelay && item.myMultiplePressStartCount > 0) {
                    item.myPrevMultiplePressStartCount = item.myMultiplePressStartCount;
                    item.myMultiplePressStartCount = 0;
                }
            } else {
                item.myTimeNotPressed += dt;
                if (item.myPrevIsPressed) {
                    item.myMultiplePressEndCount += 1;

                    item.myPrevTimePressed = item.myTimePressed;
                    item.myTimePressed = 0;
                }

                if (item.myPrevTimePressed + item.myTimeNotPressed > this._myMultiplePressMaxDelay && item.myMultiplePressStartCount > 0) {
                    item.myPrevMultiplePressStartCount = item.myMultiplePressStartCount;
                    item.myMultiplePressStartCount = 0;
                }

                if (item.myTimeNotPressed > this._myMultiplePressMaxDelay && item.myMultiplePressEndCount > 0) {
                    item.myPrevMultiplePressEndCount = item.myMultiplePressEndCount;
                    item.myMultiplePressEndCount = 0;
                }
            }

            if (item.myIsTouched) {
                item.myTimeTouched += dt;
                if (!item.myPrevIsTouched) {
                    item.myMultipleTouchStartCount += 1;

                    item.myPrevTimeNotTouched = item.myTimeNotTouched;
                    item.myTimeNotTouched = 0;
                }

                if (item.myPrevTimeNotTouched + item.myTimeTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchEndCount > 0) {
                    item.myPrevMultipleTouchEndCount = item.myMultipleTouchEndCount;
                    item.myMultipleTouchEndCount = 0;
                }

                if (item.myTimeTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchStartCount > 0) {
                    item.myPrevMultipleTouchStartCount = item.myMultipleTouchStartCount;
                    item.myMultipleTouchStartCount = 0;
                }
            } else {
                item.myTimeNotTouched += dt;
                if (item.myPrevIsTouched) {
                    item.myMultipleTouchEndCount += 1;

                    item.myPrevTimeTouched = item.myTimeTouched;
                    item.myTimeTouched = 0;
                }

                if (item.myPrevTimeTouched + item.myTimeNotTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchStartCount > 0) {
                    item.myPrevMultipleTouchStartCount = item.myMultipleTouchStartCount;
                    item.myMultipleTouchStartCount = 0;
                }

                if (item.myTimeNotTouched > this._myMultipleTouchMaxDelay && item.myMultipleTouchEndCount > 0) {
                    item.myPrevMultipleTouchEndCount = item.myMultipleTouchEndCount;
                    item.myMultipleTouchEndCount = 0;
                }
            }
        }.bind(this));

        for (let typeKey in PP.ButtonType) {
            let buttonInfo = this._myButtonInfos[PP.ButtonType[typeKey]];
            let buttonCallbacks = this._myButtonCallbacks[PP.ButtonType[typeKey]];

            //PRESSED
            if (buttonInfo.myIsPressed && !buttonInfo.myPrevIsPressed) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.PRESS_START];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (!buttonInfo.myIsPressed && buttonInfo.myPrevIsPressed) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.PRESS_END];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (buttonInfo.myIsPressed) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.PRESSED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            } else {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.NOT_PRESSED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //TOUCHED
            if (buttonInfo.myIsTouched && !buttonInfo.myPrevIsTouched) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.TOUCH_START];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (!buttonInfo.myIsTouched && buttonInfo.myPrevIsTouched) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.TOUCH_END];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            if (buttonInfo.myIsTouched) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.TOUCHED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            } else {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.NOT_TOUCHED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //VALUE
            if (buttonInfo.myValue != buttonInfo.myPrevValue) {
                let callbacksMap = buttonCallbacks[PP.ButtonEvent.VALUE_CHANGED];
                this._triggerCallbacks(callbacksMap, buttonInfo);
            }

            //ALWAYS
            let callbacksMap = buttonCallbacks[PP.ButtonEvent.ALWAYS];
            this._triggerCallbacks(callbacksMap, buttonInfo);
        }
    }

    _preUpdateAxesInfos() {
        this._myAxesInfo.myPrevAxes = this._myAxesInfo.myAxes;
    }

    _updateAxesInfos() {
        this._myAxesInfo.myAxes = this._getInternalAxes();
    }

    _postUpdateAxesInfos() {
        //X CHANGED
        if (this._myAxesInfo.myAxes[0] != this._myAxesInfo.myPrevAxes[0]) {
            let callbacksMap = this._myAxesCallbacks[PP.AxesEvent.X_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //Y CHANGED
        if (this._myAxesInfo.myAxes[1] != this._myAxesInfo.myPrevAxes[1]) {
            let callbacksMap = this._myAxesCallbacks[PP.AxesEvent.Y_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //AXES CHANGED
        if (!glMatrix.vec2.exactEquals(this._myAxesInfo.myAxes, this._myAxesInfo.myPrevAxes)) {
            let callbacksMap = this._myAxesCallbacks[PP.AxesEvent.AXES_CHANGED];
            this._triggerCallbacks(callbacksMap, this._myAxesInfo);
        }

        //ALWAYS        
        let callbacksMap = this._myAxesCallbacks[PP.AxesEvent.ALWAYS];
        this._triggerCallbacks(callbacksMap, this._myAxesInfo);
    }

    _getInternalButton(buttonType) {
        let buttonData = { pressed: false, touched: false, value: 0 };
        if (this.isGamepadActive()) {
            if (buttonType < this._myGamepad.buttons.length) {
                let gamepadButton = this._myGamepad.buttons[buttonType];
                buttonData.pressed = gamepadButton.pressed;
                buttonData.touched = gamepadButton.touched;
                buttonData.value = gamepadButton.value;
            } else if (buttonType == PP.ButtonType.BOTTOM_BUTTON && this._myGamepad.buttons.length >= 3) {
                //This way if you are using a basic touch controller bottom button will work anyway
                let touchButton = this._myGamepad.buttons[2];
                buttonData.pressed = touchButton.pressed;
                buttonData.touched = touchButton.touched;
                buttonData.value = touchButton.value;
            }
        }

        return buttonData;
    }

    _getInternalAxes() {
        let axes = [0.0, 0.0];
        if (this.isGamepadActive()) {
            let internalAxes = this._myGamepad.axes;
            if (internalAxes.length == 4) {
                //in this case it could be both touch axes or thumbstick axes, that depends on the controller
                //to support both I simply choose the absolute max value (unused axes will always be 0)

                //X
                if (Math.abs(internalAxes[0]) > Math.abs(internalAxes[2])) {
                    axes[0] = internalAxes[0];
                } else {
                    axes[0] = internalAxes[2];
                }

                //Y
                if (Math.abs(internalAxes[1]) > Math.abs(internalAxes[3])) {
                    axes[1] = internalAxes[1];
                } else {
                    axes[1] = internalAxes[3];
                }

            } else if (internalAxes.length == 2) {
                axes[0] = internalAxes[0];
                axes[1] = internalAxes[1];
            }

            //y axis is recorder negative when thumbstick is pressed forward for weird reasons
            axes[1] = -axes[1];
        }

        return axes;
    }

    _updatePulse(dt) {
        let hapticActuators = this._getHapticActuators();
        if (hapticActuators.length > 0) {
            if (this._myPulseInfo.myIntensity > 0) {
                for (let i = 0; i < hapticActuators.length; i++) {
                    let hapticActuator = hapticActuators[i];
                    hapticActuator.pulse(this._myPulseInfo.myIntensity, Math.max(250, this._myPulseInfo.myDuration * 1000)); // Duration is managed by this class
                }
                this._myPulseInfo.myIsDevicePulsing = true;
            } else if (this._myPulseInfo.myIsDevicePulsing) {
                for (let i = 0; i < hapticActuators.length; i++) {
                    let hapticActuator = hapticActuators[i];
                    hapticActuator.pulse(0, 1);

                    try {
                        if (hapticActuator.reset != null) {
                            hapticActuator.reset();
                        }
                    } catch (error) {
                        // Do nothing
                    }
                }

                this._myPulseInfo.myIsDevicePulsing = false;
            }
        } else {
            this._myPulseInfo.myIsDevicePulsing = false;
        }

        this._myPulseInfo.myDuration -= dt;
        if (this._myPulseInfo.myDuration <= 0) {
            this._myPulseInfo.myIntensity = 0;
            this._myPulseInfo.myDuration = 0;
        }
    }

    _getHapticActuators() {
        let hapticActuators = [];

        if (this.isGamepadActive()) {
            if (this._myGamepad.hapticActuators != null) {
                for (let i = 0; i < this._myGamepad.hapticActuators.length; i++) {
                    hapticActuators.push(this._myGamepad.hapticActuators[i]);
                }
            }

            if (this._myGamepad.vibrationActuator != null) {
                hapticActuators.push(this._myGamepad.vibrationActuator);
            }
        }

        return hapticActuators;
    }

    _onXRSessionStart(manualStart, session) {
        this._myInputSource = null;
        this._myGamepad = null;

        if (session.inputSources != null && session.inputSources.length > 0) {
            for (let i = 0; i < session.inputSources.length; i++) {
                let inputSource = session.inputSources[i];
                if (inputSource.handedness == this._myHandedness) {
                    this._myInputSource = inputSource;
                    this._myGamepad = inputSource.gamepad;
                }
            }
        }

        session.addEventListener("inputsourceschange", function () {
            this._myInputSource = null;
            this._myGamepad = null;

            if (session.inputSources != null && session.inputSources.length > 0) {
                for (let i = 0; i < session.inputSources.length; i++) {
                    let inputSource = session.inputSources[i];
                    if (inputSource.handedness == this._myHandedness) {
                        this._myInputSource = inputSource;
                        this._myGamepad = inputSource.gamepad;
                    }
                }
            }
        }.bind(this));

        session.addEventListener("selectstart", this._selectStart.bind(this));
        session.addEventListener("selectend", this._selectEnd.bind(this));

        session.addEventListener("squeezestart", this._squeezeStart.bind(this));
        session.addEventListener("squeezeend", this._squeezeEnd.bind(this));

        this._myIsXRSessionActive = true;
    }

    _onXRSessionEnd(session) {
        this._myInputSource = null;
        this._myGamepad = null;

        this._mySelectPressed = false;
        this._mySqueezePressed = false;

        this._myIsXRSessionActive = false;
    }

    //Select and Squeeze are managed this way to be more compatible
    _selectStart(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySelectPressed = true;
        }
    }

    _selectEnd(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySelectPressed = false;
        }
    }

    _squeezeStart(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySqueezePressed = true;
        }
    }

    _squeezeEnd(event) {
        if (this._myInputSource != null && this._myInputSource == event.inputSource) {
            this._mySqueezePressed = false;
        }
    }

    _triggerCallbacks(callbacksMap, info) {
        for (let callback of callbacksMap.values()) {
            callback(info, this);
        }
    }
};