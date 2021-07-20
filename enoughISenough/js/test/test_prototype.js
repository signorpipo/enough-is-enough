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

        console.warn("\nPOSITION\n");
        this.object.pp_setPosition([1, 2, 3]);
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_setPositionWorld([3, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.object.pp_setPositionLocal([4, 5, 7]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        console.warn("\nROTATION\n");
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

        console.warn("\nROTATION WORLD\n");
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

        console.warn("\nROTATION LOCAL\n");
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

        console.warn("\nSCALE\n");
        this.object.pp_setScale([2, 5, 4]);
        this.consoleWarnFixed(this.object.pp_getScale());
        this.object.pp_setScaleWorld([3.2, 1.65, 4.4]);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.object.pp_setScaleLocal([5.2, 3.1, 9.1]);
        this.consoleWarnFixed(this.object.pp_getScaleLocal());

        console.warn("\nTRANSFORM\n");
        this.object.pp_setTransformMatrix([1, 0, 0, 0, 0, 2.4, 0, 0, 0, 0, 3.2, 0, 4, 2, 3, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransform());
        this.object.pp_setTransformMatrix([3, 0, 0, 0, 0, 2.4, 0, 0, 0, 0, 1.2, 0, 1, 2, 3, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformMatrix());
        this.object.pp_setTransformQuat([0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017]);
        this.consoleWarnFixed(this.object.pp_getTransformQuat());

        console.warn("\nTRANSFORM WORLD\n");
        this.object.pp_setTransformMatrix([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setTransformWorldMatrix([-0.2458, 1.3998, 1.4071, 0.0000, 2.7900, 3.1750, -2.6712, 0.0000, -2.4621, 0.9808, -1.4058, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
        this.object.pp_setTransformWorldMatrix([-0.1229, 0.6999, 0.7036, 0.0000, 0.5580, 0.6350, -0.5342, 0.0000, -0.8207, 0.3270, -0.4686, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
        this.object.pp_setTransformWorldQuat([0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017]);
        this.consoleWarnFixed(this.object.pp_getTransformWorldQuat());

        console.warn("\nTRANSFORM LOCAL\n");
        this.object.pp_setTransformLocal([-0.2458, 1.3998, 1.4071, 0.0000, 2.7900, 3.1750, -2.6712, 0.0000, -2.4621, 0.9808, -1.4058, 0.0000, 0.1834, -2.7853, -19.6426, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());
        this.object.pp_setTransformLocalMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalMatrix());
        this.object.pp_setTransformLocalQuat([-0.4215, -0.7461, 0.0695, 0.5108, -7.3773, 3.4221, -5.6718, -0.3181]);
        this.consoleWarnFixed(this.object.pp_getTransformLocalQuat());

        console.warn("\nFORWARD\n");
        this.consoleWarnFixed(this.object.pp_getForward());
        this.consoleWarnFixed(this.object.pp_getForwardWorld());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());

        console.warn("\nUP\n");
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getUpWorld());
        this.consoleWarnFixed(this.object.pp_getUpLocal());

        console.warn("\nRIGHT\n");
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getRightLocal());

        console.warn("\LOOK AT\n");
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_lookAt([0.7071, 0.7071, 0]);
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0.4472, -0.8944, 0]);
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1], [0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAt([0, -1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1], [0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([1, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAt([1, -1, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAt([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAt([2, -1, 3], [2, 1, 4]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.consoleWarnFixed(this.object.pp_getPosition());

        console.warn("\nPARENT\n");
        this.object.pp_setPosition([1, 2, 3]);
        let oldParent = this.object.pp_getParent();
        let nullParent = null;
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(nullParent);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(oldParent);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(nullParent, false);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(oldParent, false);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(nullParent, false);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.object.pp_setParent(oldParent);
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());

        console.warn("\RESET POSITION\n");
        this.object.pp_resetPosition();
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_resetPositionWorld();
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_resetPositionLocal();
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        console.warn("\RESET ROTATION\n");
        this.object.pp_resetRotation();
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_resetRotationWorld();
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_resetRotationLocal();
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\RESET SCALE\n");
        this.object.pp_resetScale();
        this.consoleWarnFixed(this.object.pp_getScale());
        this.object.pp_resetScaleWorld();
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        this.object.pp_resetScaleLocal();
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());

        console.warn("\RESET TRANSFORM\n");
        this.object.pp_setTransformWorldMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        this.object.pp_resetTransform();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransform());
        this.object.pp_resetTransformWorld();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());
        this.object.pp_resetTransformLocal();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());

        console.warn("\nMATRIX STABILITY\n");
        this.object.pp_setTransformWorldMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        let initialMatrix = this.object.pp_getTransformWorldMatrix();
        for (let i = 0; i < 100; i++) {
            this.object.pp_setTransformWorldMatrix(this.object.pp_getTransformWorldMatrix());
        }
        glMatrix.mat4.sub(initialMatrix, this.object.pp_getTransformWorldMatrix(), initialMatrix);
        initialMatrix = initialMatrix.map(a => a < 0.00000002 ? 0 : a);
        console.warn(initialMatrix);

        console.warn("\QUAT TRANSFORM POSITION STABILITY\n");
        this.object.pp_setTransformWorldQuat([0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017]);
        let initialPos = this.object.pp_getPositionWorld();
        for (let i = 0; i < 100; i++) {
            this.object.pp_setTransformWorldQuat(this.object.pp_getTransformWorldQuat());
        }
        glMatrix.vec3.sub(initialPos, this.object.pp_getPositionWorld(), initialPos);
        initialPos = initialPos.map(a => a < 0.00000002 ? 0 : a);
        console.warn(initialPos);

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

/*
let mat = [];
this.pp_getTransformWorldMatrix(mat);
glMatrix.mat4.sub(mat, mat, transform);
mat = mat.map(a => a < 0.00002 ? 0 : a);
console.warn(mat);
*/