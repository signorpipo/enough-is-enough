
PP.EasyTuneNumberWidget = class EasyTuneNumberWidget {

    constructor(gamepad, blockEditButtonType) {
        this._myGamepad = gamepad;
        this._myBlockEditButtonType = blockEditButtonType;

        this._mySetup = new PP.EasyTuneNumberWidgetSetup();
        this._myUI = new PP.EasyTuneNumberWidgetUI();

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();

        this._myAppendToVariableName = "";

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;
        this._myStepButtonEditIntensity = 0;
        this._myStepButtonEditIntensityTimer = 0;

        this._myValueEditActive = false;
        this._myStepEditActive = false;

        this._myValueRealValue = null;
        this._myStepMultiplierValue = null;
    }

    setEasyTuneVariable(variable, appendToVariableName) {
        this._myVariable = variable;

        if ((typeof appendToVariableName) !== 'undefined') {
            this._myAppendToVariableName = appendToVariableName;
        } else {
            this._myAppendToVariableName = "";
        }

        this._refreshUI();
    }

    _refreshUI() {
        if (this._myVariable) {
            this._myUI.myVariableLabelTextComponent.text = this._myVariable.myName.concat(this._myAppendToVariableName);
            this._myUI.myValueTextComponent.text = this._myVariable.myValue.toFixed(this._myVariable.myDecimalPlaces);
            this._myUI.myStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myStepPerSecond);
        }
    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }
        this._myUI.setVisible(visible);

        if (!this._myIsVisible && visible) {
            this._myScrollVariableTimer = 0;
        }

        this._myIsVisible = visible;
    }

    registerScrollVariableRequestEventListener(id, callback) {
        this._myScrollVariableRequestCallbacks.set(id, callback);
    }

    unregisterScrollVariableRequestEventListener(id) {
        this._myScrollVariableRequestCallbacks.delete(id);
    }

    start(parentObject, additionalSetup) {
        this._myUI.build(parentObject, this._mySetup, additionalSetup);
        this._myUI.setAdditionalButtonsActive(additionalSetup.myEnableAdditionalButtons);

        this._addListeners();
    }

    update(dt) {
        if (this._isActive()) {
            this._updateValue(dt);
        }
    }

    _updateValue(dt) {
        let stickVariableIntensity = 0;

        if (this._myGamepad && !this._myGamepad.getButtonInfo(this._myBlockEditButtonType).myIsPressed) {
            let y = this._myGamepad.getAxesInfo().myAxes[1];

            if (Math.abs(y) > this._mySetup.myEditThumbstickMinThreshold) {
                let normalizedEditAmount = (Math.abs(y) - this._mySetup.myEditThumbstickMinThreshold) / (1 - this._mySetup.myEditThumbstickMinThreshold);
                stickVariableIntensity = Math.sign(y) * normalizedEditAmount;
            }
        }

        let valueIntensity = 0;
        if (this._myValueEditActive) {
            valueIntensity = stickVariableIntensity;
        } else if (this._myValueButtonEditIntensity != 0) {
            if (this._myValueButtonEditIntensityTimer <= 0) {
                valueIntensity = this._myValueButtonEditIntensity;
            } else {
                this._myValueButtonEditIntensityTimer -= dt;
            }
        }

        if (valueIntensity != 0) {
            let amountToAdd = valueIntensity * this._myVariable.myStepPerSecond * dt;

            this._myValueRealValue += amountToAdd;

            let decimalPlacesMultiplier = Math.pow(10, this._myVariable.myDecimalPlaces);
            this._myVariable.myValue = Math.round(this._myValueRealValue * decimalPlacesMultiplier + Number.EPSILON) / decimalPlacesMultiplier;
            this._myUI.myValueTextComponent.text = this._myVariable.myValue.toFixed(this._myVariable.myDecimalPlaces);
        } else {
            this._myValueRealValue = this._myVariable.myValue;
        }

        let stepIntensity = 0;
        if (this._myStepEditActive) {
            stepIntensity = stickVariableIntensity;
        } else if (this._myStepButtonEditIntensity != 0) {
            if (this._myStepButtonEditIntensityTimer <= 0) {
                stepIntensity = this._myStepButtonEditIntensity;
            } else {
                this._myStepButtonEditIntensityTimer -= dt;
            }
        }

        if (stepIntensity != 0) {
            let amountToAdd = stepIntensity * this._mySetup.myStepMultiplierStepPerSecond * dt;

            this._myStepMultiplierValue += amountToAdd;
            if (Math.abs(this._myStepMultiplierValue) >= 1) {
                if (Math.sign(this._myStepMultiplierValue) > 0) {
                    this._myStepMultiplierValue -= 1;
                    this._changeStep(this._myVariable.myStepPerSecond * 10);
                } else {
                    this._myStepMultiplierValue += 1;
                    this._changeStep(this._myVariable.myStepPerSecond * 0.1);
                }
            }
        } else {
            this._myStepMultiplierValue = 0;
        }
    }

    _isActive() {
        return this._myIsVisible && this._myVariable;
    }

    _addListeners() {
        let ui = this._myUI;

        ui.myNextButtonCursorTargetComponent.addClickFunction(this._scrollVariableRequest.bind(this, 1));
        ui.myNextButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myNextButtonBackgroundComponent.material));
        ui.myNextButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myNextButtonBackgroundComponent.material));

        ui.myPreviousButtonCursorTargetComponent.addClickFunction(this._scrollVariableRequest.bind(this, -1));
        ui.myPreviousButtonCursorTargetComponent.addHoverFunction(this._genericHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));
        ui.myPreviousButtonCursorTargetComponent.addUnHoverFunction(this._genericUnHover.bind(this, ui.myPreviousButtonBackgroundComponent.material));

        ui.myValueIncreaseButtonCursorTargetComponent.addHoverFunction(this._setValueEditIntensity.bind(this, ui.myValueIncreaseButtonBackgroundComponent.material, 1));
        ui.myValueIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setValueEditIntensity.bind(this, ui.myValueIncreaseButtonBackgroundComponent.material, 0));
        ui.myValueDecreaseButtonCursorTargetComponent.addHoverFunction(this._setValueEditIntensity.bind(this, ui.myValueDecreaseButtonBackgroundComponent.material, -1));
        ui.myValueDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setValueEditIntensity.bind(this, ui.myValueDecreaseButtonBackgroundComponent.material, 0));

        ui.myValueCursorTargetComponent.addClickFunction(this._resetValue.bind(this));
        ui.myValueCursorTargetComponent.addHoverFunction(this._setValueEditActive.bind(this, ui.myValueText, true));
        ui.myValueCursorTargetComponent.addUnHoverFunction(this._setValueEditActive.bind(this, ui.myValueText, false));

        ui.myStepCursorTargetComponent.addClickFunction(this._resetStep.bind(this));
        ui.myStepCursorTargetComponent.addHoverFunction(this._setStepEditActive.bind(this, ui.myStepText, true));
        ui.myStepCursorTargetComponent.addUnHoverFunction(this._setStepEditActive.bind(this, ui.myStepText, false));

        ui.myStepIncreaseButtonCursorTargetComponent.addHoverFunction(this._setStepEditIntensity.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material, 1));
        ui.myStepIncreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, ui.myStepIncreaseButtonBackgroundComponent.material, 0));
        ui.myStepDecreaseButtonCursorTargetComponent.addHoverFunction(this._setStepEditIntensity.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material, -1));
        ui.myStepDecreaseButtonCursorTargetComponent.addUnHoverFunction(this._setStepEditIntensity.bind(this, ui.myStepDecreaseButtonBackgroundComponent.material, 0));
    }

    _setValueEditIntensity(material, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myValueButtonEditIntensityTimer = this._mySetup.myButtonEditDelay;
                this._genericHover(material);
            } else {
                this._genericUnHover(material);
            }

            this._myValueButtonEditIntensity = value;
        }
    }

    _setStepEditIntensity(material, value) {
        if (this._isActive() || value == 0) {
            if (value != 0) {
                this._myStepButtonEditIntensityTimer = 0;
                this._genericHover(material);
            } else {
                this._genericUnHover(material);
            }

            this._myStepButtonEditIntensity = value;
        }
    }

    _setValueEditActive(text, active) {
        if (this._isActive() || value == 0) {
            if (active) {
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myValueTextScale;
            }

            this._myValueEditActive = active;
        }
    }

    _setStepEditActive(text, active) {
        if (this._isActive() || value == 0) {
            if (active) {
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myStepTextScale;
            }

            this._myStepEditActive = active;
        }
    }

    _scrollVariableRequest(amount) {
        if (this._isActive()) {
            for (let value of this._myScrollVariableRequestCallbacks.values()) {
                value(amount);
            }
        }
    }

    _resetValue() {
        if (this._isActive()) {
            this._myVariable.myValue = this._myVariable.myInitialValue;
            this._myUI.myValueTextComponent.text = this._myVariable.myValue.toFixed(this._myVariable.myDecimalPlaces);
        }
    }

    _resetStep() {
        if (this._isActive()) {
            this._changeStep(this._myVariable.myInitialStepPerSecond);
        }
    }

    _changeStep(step) {
        step = Math.pp_roundDecimal(step, 10);
        this._myVariable.myStepPerSecond = step;
        this._myUI.myStepTextComponent.text = this._mySetup.myStepStartString.concat(this._myVariable.myStepPerSecond);
    }

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }
};