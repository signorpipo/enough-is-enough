WL.registerComponent('test-print-axes', {
}, {
    init: function () {
        this._myCounter = 70;

        /*
        let parent = WL.scene.addObject(null);
        let child = WL.scene.addObject(parent);
        parent.scalingWorld = [2, 5, 4];
        //parent.scalingWorld = [1, 1, 1];
        child.scalingWorld = [4, 3, 7];
        //child.scalingWorld = [1, 1, 1];
        let transform = [0.5354, 0.5714, 0.1685, -0.5986, 5.3222, -4.4403, 6.6770, 2.4017];
        let transformParent = [0.1110, 0.1936, -0.0633, 0.9727, 0.4864, 0.0317, 0.0968, -0.0555];
        glMatrix.quat2.normalize(transform, transform);
        glMatrix.quat2.normalize(transformParent, transformParent);
        parent.transformWorld = transformParent;
        child.transformWorld = transform;

        let parentMatrixWorld = glMatrix.mat4.fromRotationTranslationScale([], parent.rotationWorld, parent.getTranslationWorld([]), parent.scalingWorld);
        let childMatrixLocal = glMatrix.mat4.fromRotationTranslationScale([], child.rotationLocal, child.getTranslationLocal([]), child.scalingLocal);
        let childMatrixWorld = glMatrix.mat4.fromRotationTranslationScale([], child.rotationWorld, child.getTranslationWorld([]), child.scalingWorld);

        this.consoleWarnFixed(child.pp_getTransformWorldQuat());
        this.consoleWarnFixed(parent.pp_convertTransformObjectToWorldQuat(child.pp_getTransformLocalQuat()));
        this.consoleWarnFixed(glMatrix.mat4.sub([], child.pp_getTransformWorldQuat(), parent.pp_convertTransformObjectToWorldQuat(child.pp_getTransformLocalQuat())));

        this.consoleWarnFixed(child.pp_getTransformLocalQuat());
        this.consoleWarnFixed(parent.pp_convertTransformWorldToObjectQuat(child.pp_getTransformWorldQuat()));
        this.consoleWarnFixed(glMatrix.mat4.sub([], child.pp_getTransformLocalQuat(), parent.pp_convertTransformWorldToObjectQuat(child.pp_getTransformWorldQuat())));

        //this.consoleWarnMatrix4Fixed(child.pp_getTransformLocalMatrix());
        //this.consoleWarnMatrix4Fixed(parent.pp_convertTransformWorldToObjectMatrix(child.pp_getTransformWorldMatrix()));
        //this.consoleWarnMatrix4Fixed(glMatrix.mat4.sub([], child.pp_getTransformLocalMatrix(), parent.pp_convertTransformWorldToObjectMatrix(child.pp_getTransformWorldMatrix())));

        //this.consoleWarnMatrix4Fixed(child.pp_getTransformWorldMatrix());
        //this.consoleWarnMatrix4Fixed(parent.pp_convertTransformObjectToWorldMatrix(child.pp_getTransformLocalMatrix()));
        //this.consoleWarnMatrix4Fixed(glMatrix.mat4.sub([], child.pp_getTransformWorldMatrix(), parent.pp_convertTransformObjectToWorldMatrix(child.pp_getTransformLocalMatrix())));

        //this.consoleWarnFixed(child.rotationWorld);
        //this.consoleWarnFixed(child.getTranslationWorld([]));
        //this.consoleWarnFixed(child.scalingWorld);

        let computedChildMatrixLocal = glMatrix.mat4.mul([], glMatrix.mat4.invert([], parentMatrixWorld), childMatrixWorld);
        child.pp_setTransformLocalMatrix(computedChildMatrixLocal);
        this.consoleWarnMatrix4Fixed(computedChildMatrixLocal);
        this.consoleWarnMatrix4Fixed(child.pp_getTransformLocalMatrix());

        this.consoleWarnFixed(child.rotationWorld);
        this.consoleWarnFixed(child.getTranslationWorld([]));
        this.consoleWarnFixed(child.scalingWorld);

        this.consoleWarnMatrix4Fixed(parent.pp_getTransformWorldMatrix());
        this.consoleWarnMatrix4Fixed(parent.pp_getTransformLocalMatrix());
        this.consoleWarnMatrix4Fixed(parentMatrixWorld);

        this.consoleWarnFixed(child.transformWorld);
        this.consoleWarnFixed(parent.toWorldSpaceTransform([], child.transformLocal));
        console.warn(childMatrixLocal);
        let computedChildMatrixWorld = glMatrix.mat4.mul([], parentMatrixWorld, childMatrixLocal);

        {
            let print = [[], [], [], []];
            for (let i = 0; i < childMatrixWorld.length; i++) {
                print[Math.floor(i / 4)].push(childMatrixWorld[i].toFixed(4));
            }
            console.warn(print);

            print = [[], [], [], []];
            for (let i = 0; i < computedChildMatrixWorld.length; i++) {
                print[Math.floor(i / 4)].push(computedChildMatrixWorld[i].toFixed(4));
            }
            console.warn(print);

            let difference = glMatrix.mat4.sub([], computedChildMatrixWorld, childMatrixWorld);

            print = [[], [], [], []];
            for (let i = 0; i < difference.length; i++) {
                print[Math.floor(i / 4)].push(difference[i].toFixed(4));
            }
            console.warn(print);
        }

        {
            let quat = [0.4911, 0.6793, 0.2719, -0.4727];
            quat.quat_normalize(quat);
            this.consoleWarnFixed(quat);

            let mat = glMatrix.mat4.fromRotationTranslationScale([], quat, [2, 3, 4], [3, 1, 2]);
            let mat2 = glMatrix.mat4.fromRotationTranslationScale([], quat, [2, 3, 4], [1, 1, 1]);
            let mat3 = mat.mat4_setScale([1, 1, 1]);
            let mat4 = computedChildMatrixWorld;
            let mat5 = computedChildMatrixWorld.mat4_clone().mat4_setScale([1, 1, 1]);

            let rotation = glMatrix.mat4.getRotation([], mat);
            let rotation2 = glMatrix.mat4.getRotation([], mat2);
            let rotation3 = glMatrix.mat4.getRotation([], mat3);
            let rotation4 = glMatrix.mat4.getRotation([], mat4);
            let rotation5 = glMatrix.mat4.getRotation([], mat5);

            this.consoleWarnFixed(rotation);
            this.consoleWarnFixed(rotation.quat_normalize());
            this.consoleWarnFixed(rotation2);
            this.consoleWarnFixed(rotation3);
            this.consoleWarnFixed(rotation3.quat_normalize());
            this.consoleWarnFixed(rotation4);
            this.consoleWarnFixed(rotation5);
            this.consoleWarnFixed(rotation5.quat_normalize());

            console.warn(glMatrix.mat4.mul([], parentMatrixWorld, childMatrixWorld).mat4_getScale());

            let axes = glMatrix.mat4.mul([], parentMatrixWorld, childMatrixWorld).mat4_getAxes();
            let angle1 = axes[0].vec3_angleBetween(axes[1]);
            let angle2 = axes[2].vec3_angleBetween(axes[1]);
            let angle3 = axes[2].vec3_angleBetween(axes[0]);
            console.warn(angle1 - Math.PI / 2, angle2 - Math.PI / 2, angle3 - Math.PI / 2);


        }
        */
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
    },
    start: function () {
        this._myDebugAxes = new PP.DebugAxes();
        this._myDebugAxes.setPositionOffset([0, 0, 0]);
    },
    update: function (dt) {
        if (this._myCounter >= 0) {
            this._myCounter--;
            if (this._myCounter == 0) {
                this._myCounter = 70;
                /*
                console.log(this.object.pp_getRight()[0].toFixed(4), this.object.pp_getRight()[1].toFixed(4), this.object.pp_getRight()[2].toFixed(4));
                console.log(this.object.pp_getUp()[0].toFixed(4), this.object.pp_getUp()[1].toFixed(4), this.object.pp_getUp()[2].toFixed(4));
                console.log(this.object.pp_getForward()[0].toFixed(4), this.object.pp_getForward()[1].toFixed(4), this.object.pp_getForward()[2].toFixed(4));
                */
                /* 
                let right = [];
                let up = [];
                let forward = [];

                this.object.getRight(right);
                this.object.getUp(up);
                this.object.getForward(forward);

                console.log(right[0].toFixed(4), right[1].toFixed(4), right[2].toFixed(4));
                console.log(up[0].toFixed(4), up[1].toFixed(4), up[2].toFixed(4));
                console.log(forward[0].toFixed(4), forward[1].toFixed(4), forward[2].toFixed(4));
                */

                //console.log("   ");
            }
        }

        /*
        let right = [];
        let up = [];
        let forward = [];

        this.object.getRight(right);
        this.object.getUp(up);
        this.object.getForward(forward);

        this._myDebugForward.setStartDirectionLength(this.object.pp_getPosition(), forward, 0.1);
        this._myDebugForward.update(dt);

        this._myDebugUp.setStartDirectionLength(this.object.pp_getPosition(), up, 0.1);
        this._myDebugUp.update(dt);

        this._myDebugRight.setStartDirectionLength(this.object.pp_getPosition(), right, 0.1);
        this._myDebugRight.update(dt);
        */

        this._myDebugAxes.setTransform(this.object.transformWorld);
    }
});