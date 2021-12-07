WL.registerComponent("pp-easy-transform", {
    _myVariableName: { type: WL.Type.String, default: "" },
    _mySetAsDefault: { type: WL.Type.Bool, default: false },
    _myUseGrabTarget: { type: WL.Type.Bool, default: false },
    _myIsLocal: { type: WL.Type.Bool, default: false },
    _myScaleAsOne: { type: WL.Type.Bool, default: true },
}, {
    init: function () {
        this._myEasyObjectTuner = new PP.EasyTransform(this._myIsLocal, this.object, this._myVariableName, this._mySetAsDefault, this._myUseGrabTarget);
    },
    start: function () {
        this._myEasyObjectTuner.start();
    },
    update: function (dt) {
        this._myEasyObjectTuner.update(dt);
    }
});

PP.EasyTransform = class EasyTransform extends PP.EasyObjectTuner {
    constructor(isLocal, object, variableName, setAsDefault, useGrabTarget) {
        super(object, variableName, setAsDefault, useGrabTarget);
        this._myIsLocal = isLocal;
    }

    _getVariableNamePrefix() {
        return "Transform ";
    }

    _createEasyTuneVariable(variableName) {
        return new PP.EasyTuneEasyTransform(variableName, this._getDefaultValue(), this._myScaleAsOne);
    }

    _getObjectValue(object) {
        return this._myIsLocal ? object.pp_getTransformLocal() : object.pp_getTransformWorld();
    }

    _getDefaultValue() {
        return mat4_create();
    }

    _updateObjectValue(object, value) {
        if (this._myIsLocal) {
            object.pp_setTransformLocal(value);
        } else {
            object.pp_setTransformWorld(value);
        }
    }
};