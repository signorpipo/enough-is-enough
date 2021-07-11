WL.registerComponent('test-prototype', {
}, {
    init: function () {
        this._myCounter = 1;
    },
    start: function () {
    },
    update: function (dt) {
        if (this._myCounter >= 0) {
            this._myCounter--;
            if (this._myCounter == 0) {
                this.test();
            }
        }
    },
    test() {
        console.warn("TEST START\n");
        console.warn("POSITION");
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        console.warn("ROTATION");
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.consoleWarnFixed(this.object.pp_getRotationEuler());
        this.consoleWarnFixed(this.object.pp_getRotationEulerDegrees());
        this.consoleWarnFixed(this.object.pp_getRotationEulerRadians());
        this.consoleWarnFixed(this.object.pp_getRotationQuat());
        console.warn("ROTATION WORLD");
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEuler());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEulerDegrees());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEulerRadians());
        this.consoleWarnFixed(this.object.pp_getRotationWorldQuat());
        console.warn("ROTATION LOCAL");
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEuler());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEulerDegrees());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEulerRadians());
        this.consoleWarnFixed(this.object.pp_getRotationLocalQuat());
        console.warn("SCALE");
        this.consoleWarnFixed(this.object.pp_getScale());
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        console.warn("\nTEST END");
    },
    consoleWarnFixed(vector) {
        let result = [];
        for (let value of vector) {
            result.push(value.toFixed(4));
        }
        console.warn(result);
    }
});

/*WL.Object.prototype.pp_test = function () {
    console.log("OMG IT WORKS");
};*/