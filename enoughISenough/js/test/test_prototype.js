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

        console.warn("\LOOK AT WORLD\n");
        this.object.pp_lookAtWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtWorld([0, -1, 0]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAtWorld([0, 0, 1], [0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAtWorld([1, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAtWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtWorld([1, -1, 1]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.object.pp_lookAtWorld([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtWorld([2, -1, 3], [2, 1, 4]);
        this.consoleWarnFixed(this.object.pp_getRight());
        this.consoleWarnFixed(this.object.pp_getUp());
        this.consoleWarnFixed(this.object.pp_getForward());
        this.consoleWarnFixed(this.object.pp_getPosition());

        console.warn("\LOOK AT LOCAL\n");
        this.object.pp_lookAtLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtLocal([0, -1, 0]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookAtLocal([0, 0, 1], [0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookAtLocal([1, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookAtLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtLocal([1, -1, 1]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.object.pp_lookAtLocal([0, 0, 1], [0, 1, 0]);
        this.object.pp_lookAtLocal([2, -1, 3], [2, 1, 4]);
        this.consoleWarnFixed(this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getUpLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
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

        console.warn("\TRANSLATE\n");
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
        this.object.pp_lookAt(this.object.pp_getParent().pp_getUp());
        this.object.pp_translateObject([0, 0, 1]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateObject([0, 1, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.object.pp_translateObject([1, 0, 0]);
        this.consoleWarnFixed(this.object.pp_getPositionLocal());

        console.warn("\ROTATE\n");
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

        console.warn("\ROTATE WORLD\n");
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

        console.warn("\ROTATE LOCAL\n");
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

        console.warn("\ROTATE OBJECT\n");
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

        //Reset Transform To Init
        this.object.pp_getParent().pp_setTransformMatrix(initParentTransform);
        this.object.pp_setTransformMatrix(initTransform);

        console.warn("\nTRANSFORM POSITION OBJECT WORLD\n");
        this.consoleWarnFixed(this.object.pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_transformPositionObjectToWorld([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_transformPositionObjectToWorld([0, 1, 0]));
        this.consoleWarnFixed(this.object.pp_transformPositionWorldToObject([1.7023, 3.2364, 1.8554]));
        this.consoleWarnFixed(this.object.pp_transformPositionWorldToObject(this.object.pp_transformPositionObjectToWorld([0, 1, 0])));

        console.warn("\nTRANSFORM POSITION LOCAL WORLD\n");
        this.consoleWarnFixed(this.object.pp_getParent().pp_getPositionWorld());
        this.consoleWarnFixed(this.object.pp_transformPositionLocalToWorld([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_transformPositionLocalToWorld([2, 1, 0]));
        this.consoleWarnFixed(this.object.pp_transformPositionWorldToLocal([6.6682, 0.486, -2.153]));
        this.consoleWarnFixed(this.object.pp_transformPositionWorldToLocal(this.object.pp_transformPositionLocalToWorld([0, 1, 2])));

        console.warn("\nTRANSFORM POSITION LOCAL OBJECT\n");
        this.consoleWarnFixed(this.object.pp_getPositionLocal());
        this.consoleWarnFixed(this.object.pp_transformPositionObjectToLocal([0, 0, 0]));
        this.consoleWarnFixed(this.object.pp_transformPositionObjectToLocal([0, 2, 3]));
        this.consoleWarnFixed(this.object.pp_transformPositionLocalToObject([0.0114, 1.839, 3.605]));
        this.consoleWarnFixed(this.object.pp_transformPositionLocalToObject(this.object.pp_transformPositionObjectToLocal([1, 3, -20])));

        console.warn("\nTRANSFORM POSITION CHAIN\n");
        this.consoleWarnFixed(this.object.pp_transformPositionObjectToWorld(this.object.pp_transformPositionLocalToObject(this.object.pp_transformPositionWorldToLocal([1, 3, -20]))));
        this.consoleWarnFixed(this.object.pp_transformPositionWorldToObject(this.object.pp_transformPositionLocalToWorld(this.object.pp_transformPositionObjectToLocal([1, 3, -20]))));

        let tempDirection = [];
        console.warn("\nTRANSFORM DIRECTION OBJECT WORLD\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getForwardWorld(), this.object.pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getForwardWorld());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToWorld([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToWorld([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToWorld([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToWorld([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToObject([0.3132, -0.7492, 0.5836]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToObject([0.9395, -2.2477, 1.7508]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToObject(this.object.pp_getForwardWorld()));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToObject(this.object.pp_transformDirectionObjectToWorld([1, 2, 0])));

        console.warn("\nTRANSFORM DIRECTION LOCAL WORLD\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getParent().pp_getForwardWorld(), this.object.pp_getParent().pp_getRightWorld());
        this.consoleWarnFixed(this.object.pp_getParent().pp_getForwardWorld());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToWorld([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToWorld([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToWorld([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToWorld([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToLocal([0.3626, -0.2404, 0.9004]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToLocal([1.0878, -0.7213, 2.7012]));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToLocal(this.object.pp_getParent().pp_getForwardWorld()));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToLocal(this.object.pp_transformDirectionLocalToWorld([1, 2, 0])));

        console.warn("\nTRANSFORM DIRECTION OBJECT LOCAL\n");
        glMatrix.vec3.add(tempDirection, this.object.pp_getForwardLocal(), this.object.pp_getRightLocal());
        this.consoleWarnFixed(this.object.pp_getForwardLocal());
        this.consoleWarnFixed(tempDirection);
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToLocal([0, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToLocal([0, 0, 2]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToLocal([0, 0, 3]));
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToLocal([-1, 0, 1]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToObject([0.1193, -0.5610, 0.8192]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToObject([0.3578, -1.6831, 2.4575]));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToObject(this.object.pp_getForwardLocal()));
        this.consoleWarnFixed(this.object.pp_transformDirectionLocalToObject(this.object.pp_transformDirectionObjectToLocal([1, 2, 0])));

        console.warn("\nTRANSFORM DIRECTION CHAIN\n");
        this.consoleWarnFixed(this.object.pp_transformDirectionObjectToWorld(this.object.pp_transformDirectionLocalToObject(this.object.pp_transformDirectionWorldToLocal([1, 3, -20]))));
        this.consoleWarnFixed(this.object.pp_transformDirectionWorldToObject(this.object.pp_transformDirectionLocalToWorld(this.object.pp_transformDirectionObjectToLocal([1, 3, -20]))));

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