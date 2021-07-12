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
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationMatrix());
        this.consoleWarnFixed(this.object.pp_getRotationQuat());
        console.warn("ROTATION WORLD");
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEuler());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEulerDegrees());
        this.consoleWarnFixed(this.object.pp_getRotationWorldEulerRadians());
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationWorldMatrix());
        this.consoleWarnFixed(this.object.pp_getRotationWorldQuat());
        console.warn("ROTATION LOCAL");
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEuler());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEulerDegrees());
        this.consoleWarnFixed(this.object.pp_getRotationLocalEulerRadians());
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationLocalMatrix());
        this.consoleWarnFixed(this.object.pp_getRotationLocalQuat());
        console.warn("SCALE");
        this.consoleWarnFixed(this.object.pp_getScale());
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        console.warn("TRANSFORM");
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransform());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformMatrix());
        this.consoleWarnFixed(this.object.pp_getTransformQuat());
        console.warn("TRANSFORM WORLD");
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
        this.consoleWarnFixed(this.object.pp_getTransformWorldQuat());
        console.warn("TRANSFORM LOCAL");
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalMatrix());
        this.consoleWarnFixed(this.object.pp_getTransformLocalQuat());
        console.warn("FORWARD");
        this.consoleWarnFixed(this.object.pp_getForward());
        this.consoleWarnFixed(this.object.pp_getForwardWorld());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        console.warn("UP");
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getUpWorld());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        console.warn("RIGHT");
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        console.warn("\nTEST END");
    },
    consoleWarnFixed(vector) {
        let result = [];
        for (let value of vector) {
            result.push(value.toFixed(4));
        }
        console.warn(result);
    },
    consoleWarnMatrix4Fixed(vector) {
        let result = [[], [], [], []];
        for (let i = 0; i < vector.length; i++) {
            result[Math.floor(i / 4)].push(vector[i].toFixed(4));
        }
        console.warn(result);
    },
    consoleWarnMatrix3Fixed(vector) {
        let result = [[], [], [], []];
        for (let i = 0; i < vector.length; i++) {
            result[Math.floor(i / 3)].push(vector[i].toFixed(4));
        }
        console.warn(result);
    }
});

/*WL.Object.prototype.pp_test = function () {
    console.log("OMG IT WORKS");
};*/