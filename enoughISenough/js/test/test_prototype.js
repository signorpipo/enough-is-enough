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
        this.object.pp_setPosition([1, 2, 3]);
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_setPositionWorld([3, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.object.pp_setPositionLocal([4, 5, 7]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        console.warn("ROTATION");
        this.object.pp_setRotation([20, 50, 120]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_setRotationDegrees([21, 54, 123]);
        this.consoleWarnFixed(this.object.pp_getRotationDegrees());
        this.object.pp_setRotationRadians([-2.9116, -1.1416, 1.7416]);
        this.consoleWarnFixed(this.object.pp_getRotationRadians());
        this.object.pp_setRotationMatrix([-0.0707, 0.4101, 0.9093, 0.9243, 0.3698, -0.0949, -0.3751, 0.8337, -0.4052]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationMatrix());
        this.object.pp_setRotationQuat([0, 0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationQuat());
        console.warn("ROTATION WORLD");
        this.object.pp_setRotationWorld([-20, 50, 120]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_setRotationWorldDegrees([-20, -37, 12]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldDegrees());
        this.object.pp_setRotationWorldRadians([-2.9116, -1.1416, 1.7416]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldRadians());
        this.object.pp_setRotationWorldMatrix([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationWorldMatrix());
        this.object.pp_setRotationWorldQuat([0.4911, 0.6793, 0.2719, -0.4727]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldQuat());
        console.warn("ROTATION LOCAL");
        this.object.pp_setRotationLocal([22, 45, 163]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_setRotationLocalDegrees([22, -45, 163]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalDegrees());
        this.object.pp_setRotationLocalRadians([-2.9116, -1.1416, 1.7416]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalRadians());
        this.object.pp_setRotationLocalMatrix([-0.0707, 0.4101, 0.9093, 0.9243, 0.3698, -0.0949, -0.3751, 0.8337, -0.4052]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationLocalMatrix());
        this.object.pp_setRotationLocalQuat([0.4911, 0.6793, 0.2719, -0.4727]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalQuat());
        console.warn("SCALE");
        this.object.pp_setScale([2, 5, 4]);
        this.consoleWarnFixed(this.object.pp_getScale());
        this.object.pp_setScaleWorld([3.2, 1.65, 4.4]);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.object.pp_setScaleLocal([5.2, 3.1, 9.1]);
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        console.warn("TRANSFORM");
        this.object.pp_setTransformMatrix([1, 0, 0, 0, 0, 2.4, 0, 0, 0, 0, 3.2, 0, 4, 2, 3, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransform());
        this.object.pp_setTransformMatrix([3, 0, 0, 0, 0, 2.4, 0, 0, 0, 0, 1.2, 0, 1, 2, 3, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformMatrix());
        this.object.pp_setTransformQuat([0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017]);
        this.consoleWarnFixed(this.object.pp_getTransformQuat());
        console.warn("TRANSFORM WORLD");
        this.object.pp_setTransformMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setTransformWorldMatrix([-0.2458, 1.3998, 1.4071, 0.0000, 2.7900, 3.1750, -2.6712, 0.0000, -2.4621, 0.9808, -1.4058, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
        this.object.pp_setTransformWorldMatrix([-0.1229, 0.6999, 0.7036, 0.0000, 0.5580, 0.6350, -0.5342, 0.0000, -0.8207, 0.3270, -0.4686, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
        this.object.pp_setTransformWorldQuat([0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017]);
        this.consoleWarnFixed(this.object.pp_getTransformWorldQuat());
        console.warn("TRANSFORM LOCAL");
        this.object.pp_setTransformLocal([-0.2458, 1.3998, 1.4071, 0.0000, 2.7900, 3.1750, -2.6712, 0.0000, -2.4621, 0.9808, -1.4058, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());
        this.consoleWarnFixed(this.object.pp_getTransformLocalQuat());
        this.object.pp_setTransformLocalMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalMatrix());
        this.object.pp_setTransformLocalQuat([-0.4215, -0.7461, 0.0695, 0.5108, -7.3773, 3.4221, -5.6718, -0.3181]);
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
        let result = [[], [], []];
        for (let i = 0; i < vector.length; i++) {
            result[Math.floor(i / 3)].push(vector[i].toFixed(4));
        }
        console.warn(result);
    }
});

/*WL.Object.prototype.pp_test = function () {
    console.log("OMG IT WORKS");
};*/