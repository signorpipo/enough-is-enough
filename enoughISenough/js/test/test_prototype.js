WL.registerComponent('test-prototype', {
}, {
    init: function () {
        this._myCounter = 3;
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
        let initParentTransform = [2.7510, -0.2407, -1.1722, 0.0000, 0.1662, 0.9674, 0.1914, 0.0000, 0.7252, -0.4809, 1.8008, 0.0000, 1.0000, -0.0000, -0.0000, 1.0000];
        let initTransform = [5.5891, 0.7359, -2.0544, 0.0000, 0.3699, 1.3017, 1.4727, 0.0000, 0.6263, -1.4985, 1.1672, 0.0000, 1.3324, 1.9347, 0.3828, 1.0000];
        this.object.pp_getParent().pp_setTransformWorldMatrix(initParentTransform);
        this.object.pp_setTransformWorldMatrix(initTransform);
        this.object.pp_getParent().pp_setParent(null);

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
        this.object.pp_setScale(6.32);
        this.consoleWarnFixed(this.object.pp_getScale());
        this.object.pp_setScaleWorld([3.2, 1.65, 4.4]);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.object.pp_setScaleWorld(5);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.object.pp_setScaleLocal([5.2, 3.1, 9.1]);
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        this.object.pp_setScaleLocal(1.3);
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

        console.warn("\nBACKWARD\n");
        this.consoleWarnFixed(this.object.pp_getBackward());
        this.consoleWarnFixed(this.object.pp_getBackwardWorld());
        this.consoleWarnFixed(this.object.pp_getBackwardLocal());

        console.warn("\nUP\n");
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getUpWorld());
        this.consoleWarnFixed(this.object.pp_getUpLocal());

        console.warn("\nDOWN\n");
        this.consoleWarnFixed(this.object.pp_getDown());
        this.consoleWarnFixed(this.object.pp_getDownWorld());
        this.consoleWarnFixed(this.object.pp_getDownLocal());

        console.warn("\nLEFT\n");
        this.consoleWarnFixed(this.object.pp_getLeft());
        this.consoleWarnFixed(this.object.pp_getLeftWorld());
        this.consoleWarnFixed(this.object.pp_getLeftLocal());

        console.warn("\nRIGHT\n");
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getRightLocal());

        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

        console.warn("\nLOOK AT\n");
        this.object.pp_lookAt([0.7071, 0.7071, 0]);
        this.object.pp_lookAtWorld([0.7071, 0.7071, 0]);
        this.object.pp_lookAtLocal([0.7071, 0.7071, 0]);

        console.warn("\nLOOK TO\n");
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_lookTo([0.7071, 0.7071, 0]);
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookTo([0.4472, -0.8944, 0]);
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookTo([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookTo([0, 0, 1], [0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookTo([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());

        console.warn("\nLOOK TO WORLD\n");
        this.object.pp_lookToWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToWorld([0, -1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookToWorld([0, 0, 1], [0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookToWorld([1, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookToWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToWorld([1, -1, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookToWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToWorld([2, -1, 3], [2, 1, 4]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.consoleWarnFixed(this.object.pp_getPosition());

        console.warn("\nLOOK TO LOCAL\n");
        this.object.pp_lookToLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToLocal([0, -1, 0]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookToLocal([0, 0, 1], [0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookToLocal([1, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookToLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToLocal([1, -1, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookToLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookToLocal([2, -1, 3], [2, 1, 4]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.consoleWarnFixed(this.object.pp_getPosition());

        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

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

        console.warn("\nRESET POSITION\n");
        this.object.pp_resetPosition();
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_resetPositionWorld();
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_resetPositionLocal();
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        console.warn("\nRESET ROTATION\n");
        this.object.pp_resetRotation();
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_resetRotationWorld();
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_resetRotationLocal();
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\nRESET SCALE\n");
        this.object.pp_resetScale();
        this.consoleWarnFixed(this.object.pp_getScale());
        this.object.pp_resetScaleWorld();
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        this.object.pp_resetScaleLocal();
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.consoleWarnFixed(this.object.pp_getScaleLocal());

        console.warn("\nRESET TRANSFORM\n");
        this.object.pp_setTransformWorldMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        this.object.pp_resetTransform();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransform());
        this.object.pp_resetTransformWorld();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());
        this.object.pp_resetTransformLocal();
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorld());
        this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocal());

        console.warn("\nTRANSLATE\n");
        this.object.pp_resetPositionWorld();
        this.object.pp_translate([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_translate([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_translate([1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getPosition());

        this.object.pp_resetPositionLocal();
        this.object.pp_translateLocal([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateLocal([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateLocal([1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        this.object.pp_resetPositionLocal();
        this.object.pp_lookTo(this.object.pp_getParent().pp_getUp());
        this.object.pp_translateObject([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateObject([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateObject([1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

        console.warn("\nTRANSLATE AXIS\n");
        let translateAxis = [23, 3, -12];
        let normalizedTranslateAxis = [];
        glMatrix.vec3.normalize(normalizedTranslateAxis, translateAxis);
        let length = glMatrix.vec3.length(translateAxis);
        this.object.pp_resetPosition();
        this.object.pp_translate(translateAxis);
        this.consoleWarnFixed(this.object.pp_getPosition());
        this.object.pp_resetPosition();
        this.object.pp_translateAxis(normalizedTranslateAxis, length);
        this.consoleWarnFixed(this.object.pp_getPosition());

        this.object.pp_resetPositionWorld();
        this.object.pp_translateWorld(translateAxis);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.object.pp_resetPositionWorld();
        this.object.pp_translateAxisWorld(normalizedTranslateAxis, length);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());

        this.object.pp_resetPositionLocal();
        this.object.pp_translateLocal(translateAxis);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_resetPositionLocal();
        this.object.pp_translateAxisLocal(normalizedTranslateAxis, length);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        this.object.pp_resetPositionWorld();
        this.object.pp_resetRotationWorld();
        this.object.pp_translateObject(translateAxis);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.object.pp_resetPositionWorld();
        this.object.pp_resetRotationWorld();
        this.object.pp_translateAxisObject(normalizedTranslateAxis, length);
        this.consoleWarnFixed(this.object.pp_getPositionWorld());

        this.object.pp_resetPositionLocal();
        this.object.pp_resetRotationLocal();
        this.object.pp_translateObject(translateAxis);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_resetPositionLocal();
        this.object.pp_resetRotationLocal();
        this.object.pp_translateAxisObject(normalizedTranslateAxis, length);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        console.warn("\nROTATE\n");
        this.object.pp_resetRotation();
        this.object.pp_rotate([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_resetRotation();
        this.object.pp_rotateDegrees([0, 30, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationDegrees());
        this.object.pp_resetRotation();
        this.object.pp_rotateRadians([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationRadians());
        this.object.pp_resetRotation();
        this.object.pp_rotateMatrix([0.5403, 0.8415, -0.0000, -0.8415, 0.5403, -0.0000, -0.0000, 0.0000, 1.0000]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationMatrix());
        this.object.pp_resetRotation();
        this.object.pp_rotateQuat([-0.4215, -0.7461, 0.0695, 0.5108]);
        this.consoleWarnFixed(this.object.pp_getRotationQuat());

        console.warn("\nROTATE WORLD\n");
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorld([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorldDegrees([0, 30, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldDegrees());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorldRadians([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldRadians());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorldMatrix([0.5403, 0.8415, -0.0000, -0.8415, 0.5403, -0.0000, -0.0000, 0.0000, 1.0000]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationWorldMatrix());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorldQuat([-0.4215, -0.7461, 0.0695, 0.5108]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldQuat());

        console.warn("\nROTATE LOCAL\n");
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocal([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocalDegrees([0, 30, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalDegrees());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocalRadians([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalRadians());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocalMatrix([0.5403, 0.8415, -0.0000, -0.8415, 0.5403, -0.0000, -0.0000, 0.0000, 1.0000]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationLocalMatrix());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocalQuat([-0.4215, -0.7461, 0.0695, 0.5108]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalQuat());

        console.warn("\nROTATE OBJECT\n");
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateObject([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateObjectDegrees([0, 30, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalDegrees());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateObjectRadians([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalRadians());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateObjectMatrix([0.5403, 0.8415, -0.0000, -0.8415, 0.5403, -0.0000, -0.0000, 0.0000, 1.0000]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationLocalMatrix());
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateObjectQuat([-0.4215, -0.7461, 0.0695, 0.5108]);
        this.consoleWarnFixed(this.object.pp_getRotationLocalQuat());

        this.object.pp_resetRotationWorld();
        this.object.pp_rotateObject([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateObjectDegrees([0, 30, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldDegrees());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateObjectRadians([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldRadians());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateObjectMatrix([0.5403, 0.8415, -0.0000, -0.8415, 0.5403, -0.0000, -0.0000, 0.0000, 1.0000]);
        this.consoleWarnMatrix3Fixed(this.object.pp_getRotationWorldMatrix());
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateObjectQuat([-0.4215, -0.7461, 0.0695, 0.5108]);
        this.consoleWarnFixed(this.object.pp_getRotationWorldQuat());

        console.warn("\nROTATE AXIS\n");
        this.object.pp_resetRotation();
        this.object.pp_rotateObject([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAxis(20, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAxisDegrees(10, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAxisRadians(Math.pp_toRadians(10), [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());

        console.warn("\nROTATE WORLD AXIS\n");
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorld([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisWorld(-20, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisWorldDegrees(10, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisWorldRadians(Math.pp_toRadians(10), [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());

        console.warn("\nROTATE LOCAL AXIS\n");
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocal([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisLocal(-20, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisLocalDegrees(10, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisLocalRadians(Math.pp_toRadians(10), [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\nROTATE OBJECT AXIS\n");
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorld([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisObject(-20, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisObjectDegrees(10, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAxisObjectRadians(Math.pp_toRadians(10), [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());

        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocal([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisObject(-20, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisObjectDegrees(10, [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAxisObjectRadians(Math.pp_toRadians(10), [1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\nROTATE AROUND\n");
        this.object.pp_rotateAround([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundDegrees([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundRadians([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundMatrix([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundQuat([-20, 0, 0], [1, 2, 3]);

        this.object.pp_rotateAroundWorldDegrees([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundWorldRadians([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundWorldMatrix([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundWorldQuat([-20, 0, 0], [1, 2, 3]);

        this.object.pp_rotateAroundLocalDegrees([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundLocalRadians([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundLocalMatrix([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundLocalQuat([-20, 0, 0], [1, 2, 3]);

        this.object.pp_rotateAroundObjectDegrees([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundObjectRadians([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundObjectMatrix([-20, 0, 0], [1, 2, 3]);
        this.object.pp_rotateAroundObjectQuat([-20, 0, 0], [1, 2, 3]);

        console.warn("\nROTATE AROUND AXIS\n");
        this.object.pp_resetRotation();
        this.object.pp_rotateObject([20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAroundAxis(20, [1, 0, 0], this.object.pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAroundAxisDegrees(10, [1, 0, 0], this.object.pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotation());
        this.object.pp_rotateAroundAxisRadians(Math.pp_toRadians(10), [1, 0, 0], this.object.pp_getParent().pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotation());

        console.warn("\nROTATE WORLD AROUND AXIS\n");
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorld([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisWorld(-20, [1, 0, 0], this.object.pp_getParent().pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisWorldDegrees(10, [1, 0, 0], this.object.pp_getParent().pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisWorldRadians(Math.pp_toRadians(10), [1, 0, 0], this.object.pp_getParent().pp_getPosition());
        this.consoleWarnFixed(this.object.pp_getRotationWorld());

        console.warn("\nROTATE LOCAL AROUND AXIS\n");
        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocal([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisLocal(-20, [1, 0, 0], this.object.pp_getPositionLocal());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisLocalDegrees(10, [1, 0, 0], this.object.pp_getPositionLocal());
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisLocalRadians(Math.pp_toRadians(10), [1, 0, 0], [0, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\nROTATE OBJECT AROUND AXIS\n");
        this.object.pp_resetRotationWorld();
        this.object.pp_rotateWorld([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisObject(-20, [1, 0, 0], -20, [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisObjectDegrees(10, [1, 0, 0], [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());
        this.object.pp_rotateAroundAxisObjectRadians(Math.pp_toRadians(10), [1, 0, 0], [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationWorld());

        this.object.pp_resetRotationLocal();
        this.object.pp_rotateLocal([-20, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisObject(-20, [1, 0, 0], [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisObjectDegrees(10, [1, 0, 0], [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());
        this.object.pp_rotateAroundAxisObjectRadians(Math.pp_toRadians(10), [1, 0, 0], [0, 1, 2]);
        this.consoleWarnFixed(this.object.pp_getRotationLocal());

        console.warn("\nSCALE OBJECT\n");
        this.object.pp_resetScaleWorld();
        this.object.pp_scaleObject([4, 2, 3]);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());
        this.object.pp_scaleObject(3);
        this.consoleWarnFixed(this.object.pp_getScaleWorld());

        this.object.pp_resetScaleLocal();
        this.object.pp_scaleObject([4, 2, 3]);
        this.consoleWarnFixed(this.object.pp_getScaleLocal());
        this.object.pp_scaleObject(3);
        this.consoleWarnFixed(this.object.pp_getScaleLocal());

        //Reset Transform To Init
        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

        console.warn("\nCONVERT POSITION OBJECT WORLD\n");
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_convertPositionObjectToWorld([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_convertPositionObjectToWorld([0, 1, 0]));
        this.consoleWarnFixed(this.object.pp_convertPositionWorldToObject([1.7023, 3.2364, 1.8554]));
        this.consoleWarnFixed(this.object.pp_convertPositionWorldToObject(this.object.pp_convertPositionObjectToWorld([0, 1, 0])));

        console.warn("\nCONVERT POSITION LOCAL WORLD\n");
        this.consoleWarnFixed(this.object.pp_getParent().pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_convertPositionLocalToWorld([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_convertPositionLocalToWorld([2, 1, 0]));
        this.consoleWarnFixed(this.object.pp_convertPositionWorldToLocal([6.6682, 0.486, -2.153]));
        this.consoleWarnFixed(this.object.pp_convertPositionWorldToLocal(this.object.pp_convertPositionLocalToWorld([0, 1, 2])));

        console.warn("\nCONVERT POSITION LOCAL OBJECT\n");
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.consoleWarnFixed(this.object.pp_convertPositionObjectToLocal([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_convertPositionObjectToLocal([0, 2, 3]));
        this.consoleWarnFixed(this.object.pp_convertPositionLocalToObject([0.0114, 1.839, 3.605]));
        this.consoleWarnFixed(this.object.pp_convertPositionLocalToObject(this.object.pp_convertPositionObjectToLocal([1, 3, -20])));

        console.warn("\nCONVERT POSITION CHAIN\n");
        this.consoleWarnFixed(this.object.pp_convertPositionObjectToWorld(this.object.pp_convertPositionLocalToObject(this.object.pp_convertPositionWorldToLocal([1, 3, -20]))));
        this.consoleWarnFixed(this.object.pp_convertPositionWorldToObject(this.object.pp_convertPositionLocalToWorld(this.object.pp_convertPositionObjectToLocal([1, 3, -20]))));

        let tempDirection = [];
        console.warn("\nCONVERT DIRECTION OBJECT WORLD\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getForwardWorld(), this.object.pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getForwardWorld());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToWorld([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToWorld([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToWorld([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToWorld([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToObject([0.3132, -0.7492, 0.5836]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToObject([0.9395, -2.2477, 1.7508]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToObject(this.object.pp_getForwardWorld()));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToObject(this.object.pp_convertDirectionObjectToWorld([1, 2, 0])));

        console.warn("\nCONVERT DIRECTION LOCAL WORLD\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getParent().pp_getForwardWorld(), this.object.pp_getParent().pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getParent().pp_getForwardWorld());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToWorld([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToWorld([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToWorld([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToWorld([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToLocal([0.3626, -0.2404, 0.9004]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToLocal([1.0878, -0.7213, 2.7012]));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToLocal(this.object.pp_getParent().pp_getForwardWorld()));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToLocal(this.object.pp_convertDirectionLocalToWorld([1, 2, 0])));

        console.warn("\nCONVERT DIRECTION OBJECT LOCAL\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getForwardLocal(), this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToLocal([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToLocal([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToLocal([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToLocal([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToObject([0.1193, -0.5610, 0.8192]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToObject([0.3578, -1.6831, 2.4575]));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToObject(this.object.pp_getForwardLocal()));
        this.consoleWarnFixed(this.object.pp_convertDirectionLocalToObject(this.object.pp_convertDirectionObjectToLocal([1, 2, 0])));

        console.warn("\nCONVERT DIRECTION CHAIN\n");
        this.consoleWarnFixed(this.object.pp_convertDirectionObjectToWorld(this.object.pp_convertDirectionLocalToObject(this.object.pp_convertDirectionWorldToLocal([1, 3, -20]))));
        this.consoleWarnFixed(this.object.pp_convertDirectionWorldToObject(this.object.pp_convertDirectionLocalToWorld(this.object.pp_convertDirectionObjectToLocal([1, 3, -20]))));

        {
            this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
            this.object.pp_setTransformMatrix(initTransform);
            //this.object.parent.scalingWorld = [1, 1, 1];
            //this.object.scalingWorld = [1, 1, 1];
            this.object.setDirty();
            this.object.pp_getParent().setDirty();
            let defaultMatrix = glMatrix.mat4.create();
            let defaultQuat2 = glMatrix.quat2.create();

            let child = WL.scene.addObject(this.object);
            child.pp_setRotation([20, 30, -10]);
            child.pp_setPosition([2, 0, -7]);
            child.pp_setScale([4, 3, 2]);
            child.pp_markDirty();

            console.warn("\nCONVERT TRANSFORM OBJECT WORLD\n");
            this.consoleWarnMatrix4Fixed(child.pp_getTransformWorldMatrix());
            this.consoleWarnMatrix4Fixed(child.pp_getTransformWorldQuat());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldQuat());

            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorld(child.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldQuat(child.pp_getTransformLocalQuat()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldMatrix(defaultMatrix));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldQuat(defaultQuat2));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObject(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectMatrix(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectQuat(this.object.pp_getTransformWorldQuat()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectMatrix(this.object.pp_convertTransformObjectToWorldMatrix(defaultMatrix)));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectQuat(this.object.pp_convertTransformObjectToWorldQuat(defaultQuat2)));

            console.warn("\nCONVERT TRANSFORM LOCAL WORLD\n");
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldQuat());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalQuat());

            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToWorld(this.object.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToWorldMatrix(this.object.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToWorldQuat(this.object.pp_getTransformLocalQuat()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToLocal(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToLocalMatrix(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToLocalQuat(this.object.pp_getTransformWorldQuat()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToLocalMatrix(this.object.pp_convertTransformLocalToWorldMatrix(this.object.pp_getTransformLocalMatrix())));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToLocalQuat(this.object.pp_convertTransformLocalToWorldQuat(this.object.pp_getTransformLocalQuat())));

            console.warn("\nCONVERT TRANSFORM LOCAL OBJECT\n");
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldQuat());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformLocalQuat());

            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToLocal(defaultMatrix));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToLocalMatrix(defaultMatrix));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToLocalQuat(defaultQuat2));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToObject(this.object.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToObjectMatrix(this.object.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToObjectQuat(this.object.pp_getTransformLocalQuat()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToObjectMatrix(this.object.pp_convertTransformObjectToLocalMatrix(defaultMatrix)));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformLocalToObjectQuat(this.object.pp_convertTransformObjectToLocalQuat(defaultQuat2)));

            console.warn("\nCONVERT TRANSFORM CHAIN\n");
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorld(this.object.pp_convertTransformLocalToObject(this.object.pp_convertTransformWorldToLocal(defaultMatrix))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObject(this.object.pp_convertTransformLocalToWorld(this.object.pp_convertTransformObjectToLocal(defaultMatrix))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldMatrix(this.object.pp_convertTransformLocalToObjectMatrix(this.object.pp_convertTransformWorldToLocalMatrix(this.object.pp_getTransformWorldMatrix()))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectMatrix(this.object.pp_convertTransformLocalToWorldMatrix(this.object.pp_convertTransformObjectToLocalMatrix(this.object.pp_getTransformWorldMatrix()))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldQuat(this.object.pp_convertTransformLocalToObjectQuat(this.object.pp_convertTransformWorldToLocalQuat(defaultQuat2))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectQuat(this.object.pp_convertTransformLocalToWorldQuat(this.object.pp_convertTransformObjectToLocalQuat(defaultQuat2))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldQuat(this.object.pp_convertTransformLocalToObjectQuat(this.object.pp_convertTransformWorldToLocalQuat(this.object.pp_getTransformWorldQuat()))));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectQuat(this.object.pp_convertTransformLocalToWorldQuat(this.object.pp_convertTransformObjectToLocalQuat(this.object.pp_getTransformWorldQuat()))));

            console.warn("\nCONVERT TRANSFORM OBJECT WORLD UNIFORM\n");
            this.object.pp_setScale([3, 3, 3]);
            child.pp_setScale([2, 2, 2]);

            this.consoleWarnMatrix4Fixed(child.pp_getTransformWorldMatrix());
            this.consoleWarnMatrix4Fixed(this.object.pp_getTransformWorldMatrix());

            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorld(child.pp_getTransformLocalMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformObjectToWorldMatrix(defaultMatrix));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObject(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectMatrix(this.object.pp_getTransformWorldMatrix()));
            this.consoleWarnMatrix4Fixed(this.object.pp_convertTransformWorldToObjectMatrix(this.object.pp_convertTransformObjectToWorldMatrix(defaultMatrix)));
        }

        console.warn("\nUNIFORM SCALE\n");
        this.object.pp_setScale([2, 2, 2]);
        console.warn(this.object.pp_hasUniformScale());
        this.object.pp_setScale([2, 2, 1]);
        console.warn(this.object.pp_hasUniformScale());
        this.object.pp_setScaleWorld([3, 2, 2]);
        console.warn(this.object.pp_hasUniformScaleWorld());
        this.object.pp_setScaleWorld([3, 2, 1]);
        console.warn(this.object.pp_hasUniformScaleWorld());
        this.object.pp_setScaleLocal([1, 2, 3]);
        console.warn(this.object.pp_hasUniformScaleLocal());
        this.object.pp_setScaleLocal([3, 3, 3]);
        console.warn(this.object.pp_hasUniformScaleLocal());

        console.warn("\nCAULDRON\n");
        this.object.pp_setName("ciao");
        this.object.pp_getName();
        this.object.pp_setActive(false);
        this.object.pp_setActiveHierarchy(true);
        this.object.pp_setActiveChildren(true);
        this.object.pp_getChildren();
        this.object.pp_markDirty();
        this.object.pp_equals(this.object.pp_getParent());
        this.object.pp_getComponent("ciao", 1);
        this.object.pp_getComponentHierarchy("ciao", 1);
        this.object.pp_getComponentChildren("ciao", 1);
        this.object.pp_getComponents("ciao");
        this.object.pp_getComponentsHierarchy("ciao");
        this.object.pp_getComponentsChildren("ciao");
        this.object.pp_addComponent("mesh");

        console.warn("\nMATRIX STABILITY\n");
        this.object.pp_setTransformWorldMatrix([0.9706, 4.1994, 4.1739, 0.0000, 1.5245, 3.1750, -3.5490, 0.0000, -5.6314, 1.9616, -0.6641, 0.0000, -13.8437, -2.7853, -36.3777, 1.0000]);
        let initialMatrix = this.object.pp_getTransformWorldMatrix();
        for (let i = 0; i < 100; i++) {
            this.object.pp_setTransformWorldMatrix(this.object.pp_getTransformWorldMatrix());
        }
        glMatrix.mat4.sub(initialMatrix, this.object.pp_getTransformWorldMatrix(), initialMatrix);
        initialMatrix = initialMatrix.map(a => a < 0.00000002 ? 0 : a);
        console.warn(initialMatrix);

        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

        console.warn("\nQUAT TRANSFORM POSITION STABILITY\n");
        {
            let transform = [0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017];
            let transformParent = [0.1110, 0.1936, -0.0633, 0.9727, 0.4864, 0.0317, 0.0968, -0.0555];
            glMatrix.quat2.normalize(transform, transform);
            glMatrix.quat2.normalize(transformParent, transformParent);
            this.object.parent.pp_setTransformWorldQuat(transformParent);
            this.object.pp_setTransformWorldQuat(transform);
            let initialPos = this.object.pp_getPositionWorld();
            for (let i = 0; i < 100; i++) {
                this.object.pp_setTransformWorldQuat(this.object.pp_getTransformWorldQuat());
            }
            glMatrix.vec3.sub(initialPos, this.object.pp_getPositionWorld(), initialPos);
            initialPos = initialPos.map(a => a < 0.00000002 ? 0 : a);
            console.warn(initialPos);
        }

        console.warn("\nQUAT TRANSFORM POSITION STABILITY WLE\n");
        {
            this.object.scalingWorld = [5, 1, 2];
            this.object.parent.scalingWorld = [2, 5, 3];
            //this.object.parent.scalingWorld = [1, 1, 1];
            let transform = [0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017];
            let transformParent = [0.1110, 0.1936, -0.0633, 0.9727, 0.4864, 0.0317, 0.0968, -0.0555];
            glMatrix.quat2.normalize(transform, transform);
            glMatrix.quat2.normalize(transformParent, transformParent);
            this.object.parent.transformWorld = transformParent;
            this.object.transformWorld = transform;
            this.object.parent.setDirty();
            this.object.setDirty();
            let initialPos = [];
            this.object.getTranslationWorld(initialPos);
            for (let i = 0; i < 100; i++) {
                let currentTransformWorld = this.object.transformWorld;
                this.object.transformWorld = currentTransformWorld;
                this.object.setDirty();
            }
            let finalPos = [];
            this.object.getTranslationWorld(finalPos);
            glMatrix.vec3.sub(initialPos, finalPos, initialPos);
            initialPos = initialPos.map(a => a < 0.00000002 ? 0 : a);
            console.warn(initialPos);
        }

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