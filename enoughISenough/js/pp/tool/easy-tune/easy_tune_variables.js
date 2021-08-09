//Variable Map
PP.EasyTuneVariableMap = class EasyTuneVariableMap {
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

PP.EasyTuneVariables = new PP.EasyTuneVariableMap();

//Variable Types
PP.EasyTuneVariableType = {
    NONE: 0,
    VEC1_NUMBER: 1,
    VEC3_NUMBER: 2,
    VEC1_BOOL: 3,
    VEC3_BOOL: 4
};

PP.EasyTuneVariable = class EasyTuneVariable {
    constructor(name, type, value) {
        this.myName = name.slice(0);
        this.myType = type;

        this.myValue = value;
        this.myInitialValue = value;
    }

    getValue() {
        return this.myValue;
    }

    setValue(value) {
        this.myValue = value;
        this.myInitialValue = this.myValue;
    }
};

//NUMBER

PP.EasyTuneNumberArray = class EasyTuneNumberArray extends PP.EasyTuneVariable {
    constructor(name, value, stepPerSecond, decimalPlaces) {
        let type = null;
        switch (value.length) {
            case 1:
                type = PP.EasyTuneVariableType.VEC1_NUMBER;
                break;
            case 3:
                type = PP.EasyTuneVariableType.VEC3_NUMBER;
                break;
            default:
                type = PP.EasyTuneVariableType.NONE;
        }

        super(name, type, null);

        this.mySize = value.length;

        PP.EasyTuneNumberArray.prototype.setValue.call(this, value);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myInitialStepPerSecond = this.myStepPerSecond;
    }

    setValue(value) {
        this.myValue = value.slice(0);
        this.myInitialValue = this.myValue.slice(0);
    }
};

PP.EasyTuneNumber = class EasyTuneNumber extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond, decimalPlaces) {
        super(name, [value], stepPerSecond, decimalPlaces);
    }

    getValue() {
        return this.myValue[0];
    }

    setValue(value) {
        super.setValue([value]);
    }
};

PP.EasyTuneInt = class EasyTuneInt extends PP.EasyTuneNumber {
    constructor(name, value, stepPerSecond) {
        super(name, value, stepPerSecond, 0);
    }
};

PP.EasyTuneIntArray = class EasyTuneIntArray extends PP.EasyTuneNumberArray {
    constructor(name, value, stepPerSecond) {
        super(name, value, stepPerSecond, 0);
    }
};

//BOOL

PP.EasyTuneBoolArray = class EasyTuneBoolArray extends PP.EasyTuneVariable {
    constructor(name, value) {
        let type = null;
        switch (value.length) {
            case 1:
                type = PP.EasyTuneVariableType.VEC1_BOOL;
                break;
            case 3:
                type = PP.EasyTuneVariableType.VEC3_BOOL;
                break;
            default:
                type = PP.EasyTuneVariableType.NONE;
        }

        super(name, type, null);

        this.mySize = value.length;

        PP.EasyTuneBoolArray.prototype.setValue.call(this, value);
    }

    setValue(value) {
        this.myValue = value.slice(0);
        this.myInitialValue = this.myValue.slice(0);
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