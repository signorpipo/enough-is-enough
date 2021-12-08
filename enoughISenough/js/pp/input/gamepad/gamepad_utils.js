PP.GamepadUtils = {
    _myPressTogetherMaxDelay: 0.15,
    _myTouchTogetherMaxDelay: 0.15,

    // gamepadButtonTypesList is a sequence of a gamepad and a list of buttonTypes like this ([gamepad1, squeeze, top, select], [gamepad2, bottom, squeeze, select], ...)
    // if the first paramter is a number it's used as fastPressCount
    areButtonsPressStart: function (...gamepadButtonTypesList) {
        let fastPressCount = null;
        let argumentsToForward = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            fastPressCount = gamepadButtonTypesList[0];
            argumentsToForward = gamepadButtonTypesList.slice(1);
        }
        return PP.GamepadUtils.areButtonsFastPressStart(fastPressCount, ...argumentsToForward);
    },

    areButtonsFastPressStart: function (fastPressCount, ...gamepadButtonTypesList) {
        let areButtonPressedRecently = true;
        let isOnePressStart = false;
        for (let gamepadButtonTypes of gamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

                if (!(button.myIsPressed && (fastPressCount == null || button.myFastPressStartCount == fastPressCount) && button.myTimePressed < PP.GamepadUtils._myPressTogetherMaxDelay)) {
                    areButtonPressedRecently = false;
                    break;
                }

                if (button.isPressStart(fastPressCount)) {
                    isOnePressStart = true;
                }
            }

            if (!areButtonPressedRecently) {
                break;
            }
        }

        return areButtonPressedRecently && isOnePressStart;
    },

    areButtonsPressEnd: function (...gamepadButtonTypesList) {
        let fastPressCount = null;
        let argumentsToForward = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            fastPressCount = gamepadButtonTypesList[0];
            argumentsToForward = gamepadButtonTypesList.slice(1);
        }
        return PP.GamepadUtils.areButtonsFastPressEnd(fastPressCount, ...argumentsToForward);
    },

    areButtonsFastPressEnd: function (fastPressCount, ...gamepadButtonTypesList) {
        let areButtonNotPressedRecently = true;
        let isOnePressEnd = false;
        for (let gamepadButtonTypes of gamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

                if (!(!button.myIsPressed && (fastPressCount == null || button.myFastPressEndCount == fastPressCount) && button.myTimeNotPressed < PP.GamepadUtils._myPressTogetherMaxDelay)) {
                    areButtonNotPressedRecently = false;
                    break;
                }

                if (button.isPressEnd(fastPressCount)) {
                    isOnePressEnd = true;
                }
            }

            if (!areButtonNotPressedRecently) {
                break;
            }
        }

        return areButtonNotPressedRecently && isOnePressEnd;
    },

    areButtonsTouchStart: function (...gamepadButtonTypesList) {
        let fastTouchCount = null;
        let argumentsToForward = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            fastTouchCount = gamepadButtonTypesList[0];
            argumentsToForward = gamepadButtonTypesList.slice(1);
        }
        return PP.GamepadUtils.areButtonsFastTouchStart(fastTouchCount, ...argumentsToForward);
    },

    areButtonsFastTouchStart: function (fastTouchCount, ...gamepadButtonTypesList) {
        let areButtonTouchedRecently = true;
        let isOneTouchStart = false;
        for (let gamepadButtonTypes of gamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

                if (!(button.myIsTouched && (fastTouchCount == null || button.myFastTouchStartCount == fastTouchCount) && button.myTimeTouched < PP.GamepadUtils._myTouchTogetherMaxDelay)) {
                    areButtonTouchedRecently = false;
                    break;
                }

                if (button.isTouchStart(fastTouchCount)) {
                    isOneTouchStart = true;
                }
            }

            if (!areButtonTouchedRecently) {
                break;
            }
        }

        return areButtonTouchedRecently && isOneTouchStart;
    },

    areButtonsTouchEnd: function (...gamepadButtonTypesList) {
        let fastTouchCount = null;
        let argumentsToForward = gamepadButtonTypesList;
        if (!isNaN(gamepadButtonTypesList[0])) {
            fastTouchCount = gamepadButtonTypesList[0];
            argumentsToForward = gamepadButtonTypesList.slice(1);
        }
        return PP.GamepadUtils.areButtonsFastTouchEnd(fastTouchCount, ...argumentsToForward);
    },

    areButtonsFastTouchEnd: function (fastTouchCount, ...gamepadButtonTypesList) {
        let areButtonNotTouchedRecently = true;
        let isOneTouchEnd = false;
        for (let gamepadButtonTypes of gamepadButtonTypesList) {
            let gamepad = gamepadButtonTypes[0];
            for (let i = 1; i < gamepadButtonTypes.length; i++) {
                let buttonType = gamepadButtonTypes[i];
                let button = gamepad.getButtonInfo(buttonType);

                if (!(!button.myIsTouched && (fastTouchCount == null || button.myFastTouchEndCount == fastTouchCount) && button.myTimeNotTouched < PP.GamepadUtils._myTouchTogetherMaxDelay)) {
                    areButtonNotTouchedRecently = false;
                    break;
                }

                if (button.isTouchEnd(fastTouchCount)) {
                    isOneTouchEnd = true;
                }
            }

            if (!areButtonNotTouchedRecently) {
                break;
            }
        }

        return areButtonNotTouchedRecently && isOneTouchEnd;
    },
};