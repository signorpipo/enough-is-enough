//Don't move inside easy_object_tuners folder, otherwise it won't resolve the parent class dependency

PP.EasyObjectTuner = class EasyObjectTuner {
    constructor(object, variableName, setAsDefault, useGrabTarget) {
        this._myObject = object;
        this._myUseGrabTarget = useGrabTarget;
        this._mySetAsDefault = setAsDefault;

        this._myEasyObject = this._myObject;
        if (this._myUseGrabTarget) {
            this._myEasyObject = PP.myEasyGrabTarget;
        }
        this._myPrevEasyObject = null;

        let variableNamePrefix = this._getVariableNamePrefix();

        if (variableName == "") {
            this._myEasyTuneVariableName = variableNamePrefix.concat(this._myObject.objectId);
        } else {
            this._myEasyTuneVariableName = variableNamePrefix.concat(variableName);
        }
    }

    start() {
        let easyTuneVariable = this._createEasyTuneVariable(this._myEasyTuneVariableName);

        PP.myEasyTuneVariables.add(easyTuneVariable);
        if (this._mySetAsDefault) {
            PP.setEasyTuneWidgetActiveVariable(this._myEasyTuneVariableName);
        }
    }

    update(dt) {
        if (PP.myEasyTuneVariables.isActive(this._myEasyTuneVariableName)) {
            if (this._myUseGrabTarget) {
                this._myEasyObject = PP.myEasyGrabTarget;
            }

            if (this._myPrevEasyObject != this._myEasyObject) {
                this._myPrevEasyObject = this._myEasyObject;
                if (this._myEasyObject) {
                    let value = this._getObjectValue(this._myEasyObject);
                    PP.myEasyTuneVariables.set(this._myEasyTuneVariableName, value);
                } else {
                    let value = this._getDefaultValue();
                    PP.myEasyTuneVariables.set(this._myEasyTuneVariableName, value);
                }
            }

            if (this._myEasyObject) {
                this._updateObjectValue(this._myEasyObject, PP.myEasyTuneVariables.get(this._myEasyTuneVariableName));
            }
        }
    }

    updateVariableValue(value) {
        PP.myEasyTuneVariables.set(this._myEasyTuneVariableName, value);
    }
};