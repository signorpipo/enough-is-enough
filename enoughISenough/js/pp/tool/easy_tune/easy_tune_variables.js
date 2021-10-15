//Variable Map
PP.EasyTuneVariables = class EasyTuneVariables {
    constructor() {
        this._myMap = new Map();
    }

    add(variable) {
        this._myMap.set(variable.myName, variable);
    }

    remove(variableName) {
        this._myMap.delete(variableName);
    }

    get(variableName) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            return variable.getValue();
        }

        return null;
    }

    set(variableName, value) {
        let variable = this._myMap.get(variableName);
        if (variable) {
            variable.setValue(value);
        }
    }

    getEasyTuneVariable(variableName) {
        return this._myMap.get(variableName);
    }

    _getInternalMap() {
        return this._myMap;
    }
};

//Variable Types
PP.EasyTuneVariableType = {
    NONE: 0,
    NUMBER: 1,
    BOOL: 2,
    EASY_TRANSFORM: 3
};

PP.EasyTuneVariable = class EasyTuneVariable {
    constructor(name, type) {
        this.myName = name.slice(0);
        this.myType = type;

        this.myValue = null;
        this.myInitialValue = null;
    }

    getValue() {
        return this.myValue;
    }

    setValue(value) {
        this.myValue = value;
        this.myInitialValue = this.myValue;
    }
};

PP.EasyTuneVariableArray = class EasyTuneVariableArray extends PP.EasyTuneVariable {
    constructor(name, type, value) {
        super(name, type);

        PP.EasyTuneVariableArray.prototype.setValue.call(this, value);
    }

    setValue(value) {
        this.myValue = value.slice(0);
        this.myInitialValue = this.myValue.slice(0);
    }
};

//NUMBER

PP.EasyTuneNumberArray = class EasyTuneNumberArray extends PP.EasyTuneVariableArray {
    constructor(name, value, stepPerSecond, decimalPlaces, min = null, max = null) {
        let tempValue = value.slice(0);

        if (min != null) {
            for (let i = 0; i < value.length; i++) {
                tempValue[i] = Math.pp_clamp(tempValue[i], min, max);
            }
        }

        super(name, PP.EasyTuneVariableType.NUMBER, tempValue);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myInitialStepPerSecond = this.myStepPerSecond;

        this.myMin = min;
        this.myMax = max;
    }
};

PP.EasyTuneNumber = class EasyTuneNumber extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond, decimalPlaces, min, max) {
        super(name, [value], stepPerSecond, decimalPlaces, min, max);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value) {
        super.setValue([value]);
    }
};

PP.EasyTuneInt = class EasyTuneInt extends PP.EasyTuneNumber {
    constructor(name, value, stepPerSecond, min, max) {
        super(name, value, stepPerSecond, 0, min, max);
    }
};

PP.EasyTuneIntArray = class EasyTuneIntArray extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond, min, max) {
        let tempValue = value.slice(0);

        for (let i = 0; i < value.length; i++) {
            tempValue[i] = Math.round(tempValue[i]);
        }

        super(name, tempValue, stepPerSecond, 0, Math.round(min), Math.round(max));
    }
};

//BOOL

PP.EasyTuneBoolArray = class EasyTuneBoolArray extends PP.EasyTuneVariableArray {
    constructor(name, value) {
        super(name, PP.EasyTuneVariableType.BOOL, value);
    }
};

PP.EasyTuneBool = class EasyTuneBool extends PP.EasyTuneBoolArray {
    constructor(name, value) {
        super(name, [value]);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value) {
        super.setValue([value]);
    }
};

PP.EasyTuneBool = class EasyTuneBool extends PP.EasyTuneBoolArray {
    constructor(name, value) {
        super(name, [value]);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value) {
        super.setValue([value]);
    }
};

//EASY TUNE EASY TRANSFORM

PP.EasyTuneEasyTransform = class EasyTuneEasyTransform extends PP.EasyTuneVariable {
    constructor(name, value, scaleAsOne = true, positionStepPerSecond = 1, rotationStepPerSecond = 50, scaleStepPerSecond = 1) {
        super(name, PP.EasyTuneVariableType.EASY_TRANSFORM);

        this.myPosition = value.mat4_getPosition();
        this.myRotation = value.mat4_getRotationDegrees();
        this.myScale = value.mat4_getScale();

        this.myScaleAsOne = scaleAsOne;

        this.myPositionStepPerSecond = positionStepPerSecond;
        this.myRotationStepPerSecond = rotationStepPerSecond;
        this.myScaleStepPerSecond = scaleStepPerSecond;

        this.myInitialPosition = this.myPosition.vec3_clone();
        this.myInitialRotation = this.myRotation.vec3_clone();
        this.myInitialScale = this.myScale.vec3_clone();

        this.myInitialPositionStepPerSecond = this.myPositionStepPerSecond;
        this.myInitialRotationStepPerSecond = this.myRotationStepPerSecond;
        this.myInitialScaleStepPerSecond = this.myScaleStepPerSecond;

        this.myDecimalPlaces = 3;

        this.myTransform = mat4_create();
    }

    getValue() {
        this.myTransform.mat4_setPositionRotationDegreesScale(this.myPosition, this.myRotation, this.myScale);
        return this.myTransform;
    }

    setValue(value) {
        this.myPosition = value.mat4_getPosition();
        this.myRotation = value.mat4_getRotationDegrees();
        this.myScale = value.mat4_getScale();

        this.myInitialPosition = this.myPosition.vec3_clone();
        this.myInitialRotation = this.myRotation.vec3_clone();
        this.myInitialScale = this.myScale.vec3_clone();
    }
};