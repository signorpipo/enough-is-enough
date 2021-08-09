
PP.EasyTuneBoolWidget = class EasyTuneBoolWidget {

    constructor(gamepad, blockEditButtonType) {
        this._myGamepad = gamepad;
        this._myBlockEditButtonType = blockEditButtonType;

        this._mySetup = new PP.EasyTuneBoolWidgetSetup();
        this._myUI = new PP.EasyTuneBoolWidgetUI();

        this._myVariable = null;

        this._myIsVisible = true;

        this._myScrollVariableRequestCallbacks = new Map();

        this._myAppendToVariableName = "";

        this._myValueButtonEditIntensity = 0;
        this._myValueButtonEditIntensityTimer = 0;

        this._myValueEditActive = false;

        this._myValueRealValue = null;
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
            this._myUI.myValueTextComponent.text = (this._myVariable.myValue) ? "true" : "false";
        }
    }

    setVisible(visible) {
        if (visible) {
            this._refreshUI();
        }
        this._myUI.setVisible(visible);

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
            stickVariableIntensity = this._myGamepad.getAxesInfo().myAxes[1];
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

        if (Math.abs(valueIntensity) > this._mySetup.myThumbstickToggleThreshold) {
            this._myVariable.myValue = valueIntensity > 0;
            this._refreshUI();
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

    _setValueEditActive(text, active) {
        if (this._isActive() || !active) {
            if (active) {
                text.scale(this._mySetup.myTextHoverScaleMultiplier);
            } else {
                text.scalingWorld = this._mySetup.myValueTextScale;
            }

            this._myValueEditActive = active;
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

    _genericHover(material) {
        material.color = this._mySetup.myButtonHoverColor;
    }

    _genericUnHover(material) {
        material.color = this._mySetup.myBackgroundColor;
    }
};