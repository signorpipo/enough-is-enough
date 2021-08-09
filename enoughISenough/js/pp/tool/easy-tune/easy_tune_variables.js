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
    NUMBER: 1,
    BOOL: 2
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

PP.EasyTuneNumber = class EasyTuneNumber extends PP.EasyTuneVariable {
    constructor(name, value, stepPerSecond, decimalPlaces) {
        super(name, PP.EasyTuneVariableType.NUMBER, value);

        this.myDecimalPlaces = decimalPlaces;
        this.myStepPerSecond = stepPerSecond;

        this.myInitialStepPerSecond = this.myStepPerSecond;
    }
};

PP.EasyTuneInt = class EasyTuneInt extends PP.EasyTuneNumber {
    constructor(name, value, stepPerSecond) {
        super(name, value, stepPerSecond, 0);
    }
};

PP.EasyTuneBool = class EasyTuneBool extends PP.EasyTuneVariable {
    constructor(name, value) {
        super(name, PP.EasyTuneVariableType.BOOL, value);
    }
};