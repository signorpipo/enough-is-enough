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
    BOOL: 2,
    VEC3_NUMBER: 3
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

PP.EasyTuneBool = class EasyTuneBool extends PP.EasyTuneVariable {
    constructor(name, value) {
        super(name, PP.EasyTuneVariableType.BOOL, value);
    }
};

PP.EasyTuneVecNumber = class EasyTuneVecNumber extends PP.EasyTuneVariable {
    constructor(name, size, value, stepPerSecond, decimalPlaces) {
        let type = null;
        switch (size) {
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

        PP.EasyTuneVecNumber.prototype.setValue.call(this, value);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myInitialStepPerSecond = this.myStepPerSecond;
    }

    setValue(value) {
        this.myValue = value.slice(0);
        this.myInitialValue = this.myValue.slice(0);
    }
};

PP.EasyTuneNumber = class EasyTuneNumber extends PP.EasyTuneVecNumber {
    constructor(name, value, stepPerSecond, decimalPlaces) {
        super(name, 1, [value], stepPerSecond, decimalPlaces);
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

PP.EasyTuneVec3Number = class EasyTuneVec3Number extends PP.EasyTuneVecNumber {
    constructor(name, value, stepPerSecond, decimalPlaces) {
        super(name, 3, value, stepPerSecond, decimalPlaces);
    }
};

PP.EasyTuneVec3Int = class EasyTuneVec3Int extends PP.EasyTuneVec3Number {
    constructor(name, value, stepPerSecond) {
        super(name, 3, value, stepPerSecond, 0);
    }
};