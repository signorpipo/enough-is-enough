
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
    rotation[0] = this._pp_toDegrees(rotation[0]);
    rotation[1] = this._pp_toDegrees(rotation[1]);
    rotation[2] = this._pp_toDegrees(rotation[2]);
    return rotation;
};

WL.Object.prototype.pp_getRotationWorldRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.vec3.create()) {
        this.pp_getRotationWorldQuat(quat);
        this._pp_quaternionToEuler(quat, rotation);
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
        this._pp_quaternionToEuler(quat, rotation);
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
        right[0] = rotation[0];
        right[1] = rotation[1];
        right[2] = rotation[2];
        return right;
    };
}();


WL.Object.prototype.pp_getRightLocal = function () {
    let rotation = glMatrix.mat3.create();
    return function (right = glMatrix.vec3.create()) {
        this.pp_getRotationLocalMatrix(rotation);
        right[0] = rotation[0];
        right[1] = rotation[1];
        right[2] = rotation[2];
        return right;
    };
}();

//Utils

WL.Object.prototype._pp_quaternionToEuler = function () {
    let mat3 = glMatrix.mat3.create();
    return function (quatRotation, eulerRotation = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(mat3, quatRotation);

        //Rotation order is ZYX
        eulerRotation[1] = Math.asin(-this._pp_clamp(mat3[2], -1, 1));

        if (Math.abs(mat3[2]) < 0.9999999) {

            eulerRotation[0] = Math.atan2(mat3[5], mat3[8]);
            eulerRotation[2] = Math.atan2(mat3[1], mat3[0]);

        } else {

            eulerRotation[0] = 0;
            eulerRotation[2] = Math.atan2(-mat3[3], mat3[4]);
        }

        return eulerRotation;
    };
}();

WL.Object.prototype._pp_toDegrees = function (angle) {
    return angle * (180 / Math.PI);
};

WL.Object.prototype._pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};