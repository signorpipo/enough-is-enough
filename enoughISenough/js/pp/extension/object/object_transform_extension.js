
//GETTER

//Position

WL.Object.prototype.pp_getPosition = function (position) {
    return this.pp_getPositionWorld(position);
};

WL.Object.prototype.pp_getPositionWorld = function (position = glMatrix.vec3.create()) {
    this.getTranslationWorld(position);
    return position;
};

WL.Object.prototype.pp_getPositionLocal = function (position = glMatrix.vec3.create()) {
    this.getTranslationLocal(position);
    return position;
};

//Rotation

WL.Object.prototype.pp_getRotation = function (rotation) {
    return this.pp_getRotationWorld(rotation);
};
WL.Object.prototype.pp_getRotationDegrees = function (rotation) {
    return this.pp_getRotationWorldDegrees(rotation);
};

WL.Object.prototype.pp_getRotationRadians = function (rotation) {
    return this.pp_getRotationWorldRadians(rotation);
};

WL.Object.prototype.pp_getRotationMatrix = function (rotation) {
    return this.pp_getRotationWorldMatrix(rotation);
};

WL.Object.prototype.pp_getRotationQuat = function (rotation) {
    return this.pp_getRotationWorldQuat(rotation);
};

//Rotation World

WL.Object.prototype.pp_getRotationWorld = function (rotation) {
    return this.pp_getRotationWorldDegrees(rotation);
};

WL.Object.prototype.pp_getRotationWorldDegrees = function (rotation) {
    rotation = this.pp_getRotationWorldRadians(rotation);
    rotation.forEach(function (value, index, array) {
        array[index] = this._pp_toDegrees(value);
    }.bind(this));
    return rotation;
};

WL.Object.prototype.pp_getRotationWorldRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.vec3.create()) {
        this.pp_getRotationWorldQuat(quat);
        this._pp_quaternionToRadians(quat, rotation);
        return rotation;
    };
}();

WL.Object.prototype.pp_getRotationWorldMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.mat3.create()) {
        this.pp_getRotationWorldQuat(quat);
        glMatrix.mat3.fromQuat(rotation, quat);
        return rotation;
    };
}();

WL.Object.prototype.pp_getRotationWorldQuat = function (rotation = glMatrix.quat.create()) {
    glMatrix.quat.copy(rotation, this.transformWorld);
    return rotation;
};

//Rotation Local

WL.Object.prototype.pp_getRotationLocal = function (rotation) {
    return this.pp_getRotationLocalDegrees(rotation);
};

WL.Object.prototype.pp_getRotationLocalDegrees = function (rotation) {
    rotation = this.pp_getRotationLocalRadians(rotation);
    rotation.forEach(function (value, index, array) {
        array[index] = this._pp_toDegrees(value);
    }.bind(this));
    return rotation;
};

WL.Object.prototype.pp_getRotationLocalRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.vec3.create()) {
        this.pp_getRotationLocalQuat(quat);
        this._pp_quaternionToRadians(quat, rotation);
        return rotation;
    };
}();

WL.Object.prototype.pp_getRotationLocalMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.mat3.create()) {
        this.pp_getRotationLocalQuat(quat);
        glMatrix.mat3.fromQuat(rotation, quat);
        return rotation;
    };
}();

WL.Object.prototype.pp_getRotationLocalQuat = function (rotation = glMatrix.quat.create()) {
    glMatrix.quat.copy(rotation, this.transformLocal);
    return rotation;
};

//Scale

WL.Object.prototype.pp_getScale = function (scale) {
    return this.pp_getScaleWorld(scale);
};

WL.Object.prototype.pp_getScaleWorld = function (scale = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(scale, this.scalingWorld);
    glMatrix.vec3.scale(scale, scale, 2);
    return scale;
};

WL.Object.prototype.pp_getScaleLocal = function (scale = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(scale, this.scalingLocal);
    glMatrix.vec3.scale(scale, scale, 2);
    return scale;
};

//Transform

WL.Object.prototype.pp_getTransform = function (transform) {
    return this.pp_getTransformWorld(transform);
};

WL.Object.prototype.pp_getTransformMatrix = function (transform) {
    return this.pp_getTransformWorldMatrix(transform);
};

WL.Object.prototype.pp_getTransformQuat = function (transform) {
    return this.pp_getTransformWorldQuat(transform);
};

//Transform World

WL.Object.prototype.pp_getTransformWorld = function (transform) {
    return this.pp_getTransformWorldMatrix(transform);
};

WL.Object.prototype.pp_getTransformWorldMatrix = function () {
    let transformQuat = glMatrix.quat2.create();
    let scale = glMatrix.vec3.create();
    return function (transform = glMatrix.mat4.create()) {
        this.pp_getTransformWorldQuat(transformQuat);
        this.pp_getScaleWorld(scale);
        glMatrix.mat4.fromQuat2(transform, transformQuat);
        glMatrix.mat4.scale(transform, transform, scale);
        return transform;
    };
}();

WL.Object.prototype.pp_getTransformWorldQuat = function (transform = glMatrix.quat2.create()) {
    glMatrix.quat2.copy(transform, this.transformWorld);
    return transform;
};

//Transform Local

WL.Object.prototype.pp_getTransformLocal = function (transform) {
    return this.pp_getTransformLocalMatrix(transform);
};

WL.Object.prototype.pp_getTransformLocalMatrix = function () {
    let transformQuat = glMatrix.quat2.create();
    let scale = glMatrix.vec3.create();
    return function (transform = glMatrix.mat4.create()) {
        this.pp_getTransformLocalQuat(transformQuat);
        this.pp_getScaleLocal(scale);
        glMatrix.mat4.fromQuat2(transform, transformQuat);
        glMatrix.mat4.scale(transform, transform, scale);
        return transform;
    };
}();

WL.Object.prototype.pp_getTransformLocalQuat = function (transform = glMatrix.quat2.create()) {
    glMatrix.quat2.copy(transform, this.transformLocal);
    return transform;
};

//Forward

WL.Object.prototype.pp_getForward = function (forward) {
    return this.pp_getForwardWorld(forward);
};

WL.Object.prototype.pp_getForwardWorld = function () {
    let rotation = glMatrix.mat3.create();
    return function (forward = glMatrix.vec3.create()) {
        this.pp_getRotationWorldMatrix(rotation);
        forward[0] = rotation[6];
        forward[1] = rotation[7];
        forward[2] = rotation[8];
        return forward;
    };
}();


WL.Object.prototype.pp_getForwardLocal = function () {
    let rotation = glMatrix.mat3.create();
    return function (forward = glMatrix.vec3.create()) {
        this.pp_getRotationLocalMatrix(rotation);
        forward[0] = rotation[6];
        forward[1] = rotation[7];
        forward[2] = rotation[8];
        return forward;
    };
}();

//Up

WL.Object.prototype.pp_getUp = function (up) {
    return this.pp_getUpWorld(up);
};

WL.Object.prototype.pp_getUpWorld = function () {
    let rotation = glMatrix.mat3.create();
    return function (up = glMatrix.vec3.create()) {
        this.pp_getRotationWorldMatrix(rotation);
        up[0] = rotation[3];
        up[1] = rotation[4];
        up[2] = rotation[5];
        return up;
    };
}();


WL.Object.prototype.pp_getUpLocal = function () {
    let rotation = glMatrix.mat3.create();
    return function (up = glMatrix.vec3.create()) {
        this.pp_getRotationLocalMatrix(rotation);
        up[0] = rotation[3];
        up[1] = rotation[4];
        up[2] = rotation[5];
        return up;
    };
}();

//Right

WL.Object.prototype.pp_getRight = function (right) {
    return this.pp_getRightWorld(right);
};

WL.Object.prototype.pp_getRightWorld = function () {
    let rotation = glMatrix.mat3.create();
    return function (right = glMatrix.vec3.create()) {
        this.pp_getRotationWorldMatrix(rotation);
        right[0] = -rotation[0];
        right[1] = -rotation[1];
        right[2] = -rotation[2];
        return right;
    };
}();


WL.Object.prototype.pp_getRightLocal = function () {
    let rotation = glMatrix.mat3.create();
    return function (right = glMatrix.vec3.create()) {
        this.pp_getRotationLocalMatrix(rotation);
        right[0] = -rotation[0];
        right[1] = -rotation[1];
        right[2] = -rotation[2];
        return right;
    };
}();

//SETTER

//Position

WL.Object.prototype.pp_setPosition = function (position) {
    this.pp_setPositionWorld(position);
};

WL.Object.prototype.pp_setPositionWorld = function (position) {
    this.setTranslationWorld(position);
};

WL.Object.prototype.pp_setPositionLocal = function (position) {
    this.setTranslationLocal(position);
};

//Rotation

WL.Object.prototype.pp_setRotation = function (rotation) {
    this.pp_setRotationWorld(rotation);
};
WL.Object.prototype.pp_setRotationDegrees = function (rotation) {
    this.pp_setRotationWorldDegrees(rotation);
};

WL.Object.prototype.pp_setRotationRadians = function (rotation) {
    this.pp_setRotationWorldRadians(rotation);
};

WL.Object.prototype.pp_setRotationMatrix = function (rotation) {
    this.pp_setRotationWorldMatrix(rotation);
};

WL.Object.prototype.pp_setRotationQuat = function (rotation) {
    this.pp_setRotationWorldQuat(rotation);
};

//Rotation World

WL.Object.prototype.pp_setRotationWorld = function (rotation) {
    this.pp_setRotationWorldDegrees(rotation);
};

WL.Object.prototype.pp_setRotationWorldDegrees = function (rotation) {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        this._pp_degreesToQuaternion(rotation, quat);
        this.pp_setRotationWorldQuat(quat);
    };
}();

WL.Object.prototype.pp_setRotationWorldRadians = function () {
    let degreesRotation = glMatrix.vec3.create();
    return function (rotation) {
        rotation.forEach(function (value, index, array) {
            degreesRotation[index] = this._pp_toDegrees(value);
        }.bind(this));
        this.pp_setRotationWorldDegrees(degreesRotation);
    };
}();

WL.Object.prototype.pp_setRotationWorldMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        glMatrix.quat.fromMat3(quat, rotation);
        this.pp_setRotationWorldQuat(quat);
    };
}();

WL.Object.prototype.pp_setRotationWorldQuat = function (rotation) {
    let transformWorld = this.transformWorld;
    glMatrix.quat.copy(transformWorld, rotation);
    this.transformWorld = transformWorld;
};

//Rotation Local

WL.Object.prototype.pp_setRotationLocal = function (rotation) {
    this.pp_setRotationLocalDegrees(rotation);
};

WL.Object.prototype.pp_setRotationLocalDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        this._pp_degreesToQuaternion(rotation, quat);
        this.pp_setRotationLocalQuat(quat);
    };
}();

WL.Object.prototype.pp_setRotationLocalRadians = function () {
    let degreesRotation = glMatrix.vec3.create();
    return function (rotation) {
        rotation.forEach(function (value, index, array) {
            degreesRotation[index] = this._pp_toDegrees(value);
        }.bind(this));
        this.pp_setRotationLocalDegrees(degreesRotation);
    };
}();

WL.Object.prototype.pp_setRotationLocalMatrix = function () {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        glMatrix.quat.fromMat3(quat, rotation);
        this.pp_setRotationLocalQuat(quat);
    };
}();

WL.Object.prototype.pp_setRotationLocalQuat = function (rotation) {
    let transformLocal = this.transformLocal;
    glMatrix.quat.copy(transformLocal, rotation);
    this.transformLocal = transformLocal;

};

//Scale

WL.Object.prototype.pp_setScale = function (scale) {
    this.pp_setScaleWorld(scale);
};

WL.Object.prototype.pp_setScaleWorld = function () {
    let halfScale = glMatrix.vec3.create();
    return function (scale) {
        glMatrix.vec3.scale(halfScale, scale, 0.5);
        glMatrix.vec3.divide(halfScale, halfScale, this.scalingWorld);
        this.scale(halfScale);
    };
}();

WL.Object.prototype.pp_setScaleLocal = function () {
    let halfScale = glMatrix.vec3.create();
    return function (scale) {
        glMatrix.vec3.scale(halfScale, scale, 0.5);
        this.resetScaling();
        this.scale(halfScale);
    };
}();

//Transform

WL.Object.prototype.pp_setTransform = function (transform) {
    this.pp_setTransformWorld(transform);
};

WL.Object.prototype.pp_setTransformMatrix = function (transform) {
    this.pp_setTransformWorldMatrix(transform);
};

WL.Object.prototype.pp_setTransformQuat = function (transform) {
    this.pp_setTransformWorldQuat(transform);
};

//Transform World

WL.Object.prototype.pp_setTransformWorld = function (transform) {
    return this.pp_setTransformWorldMatrix(transform);
};

WL.Object.prototype.pp_setTransformWorldMatrix = function () {
    let transformQuat = glMatrix.quat2.create();
    let transformMatrixNoScale = glMatrix.mat4.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (transform) {
        glMatrix.mat4.getScaling(scale, transform);
        glMatrix.vec3.divide(inverseScale, one, scale);
        glMatrix.mat4.scale(transformMatrixNoScale, transform, inverseScale);
        glMatrix.quat2.fromMat4(transformQuat, transformMatrixNoScale);
        this.pp_setScaleWorld(scale);
        this.pp_setTransformWorldQuat(transformQuat);
    };
}();

WL.Object.prototype.pp_setTransformWorldQuat = function (transform) {
    this.transformWorld = transform;
};

//Transform Local

WL.Object.prototype.pp_setTransformLocal = function (transform) {
    return this.pp_setTransformLocalMatrix(transform);
};

WL.Object.prototype.pp_setTransformLocalMatrix = function () {
    let transformQuat = glMatrix.quat2.create();
    let transformMatrixNoScale = glMatrix.mat4.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (transform) {
        glMatrix.mat4.getScaling(scale, transform);
        glMatrix.vec3.divide(inverseScale, one, scale);
        glMatrix.mat4.scale(transformMatrixNoScale, transform, inverseScale);
        glMatrix.quat2.fromMat4(transformQuat, transformMatrixNoScale);
        this.pp_setScaleLocal(scale);
        this.pp_setTransformLocalQuat(transformQuat);
    };
}();

WL.Object.prototype.pp_setTransformLocalQuat = function (transform) {
    this.transformLocal = transform;
};

//Utils

WL.Object.prototype._pp_quaternionToRadians = function () {
    let mat3 = glMatrix.mat3.create();
    return function (quatRotation, radiansRotation = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(mat3, quatRotation);

        //Rotation order is ZYX
        radiansRotation[1] = Math.asin(-this._pp_clamp(mat3[2], -1, 1));

        if (Math.abs(mat3[2]) < 0.9999999) {

            radiansRotation[0] = Math.atan2(mat3[5], mat3[8]);
            radiansRotation[2] = Math.atan2(mat3[1], mat3[0]);

        } else {

            radiansRotation[0] = 0;
            radiansRotation[2] = Math.atan2(-mat3[3], mat3[4]);
        }

        return radiansRotation;
    };
}();

WL.Object.prototype._pp_degreesToQuaternion = function (degreesRotation, quatRotation = glMatrix.quat.create()) {
    glMatrix.quat.fromEuler(quatRotation, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return quatRotation;
};

WL.Object.prototype._pp_toDegrees = function (angle) {
    return angle * (180 / Math.PI);
};

WL.Object.prototype._pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};