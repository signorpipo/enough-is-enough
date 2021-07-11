

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

WL.Object.prototype.pp_getRotationEuler = function (rotation) {
    return this.pp_getRotationWorldEuler(rotation);
};

WL.Object.prototype.pp_getRotationEulerDegrees = function (rotation) {
    return this.pp_getRotationWorldEulerDegrees(rotation);
};

WL.Object.prototype.pp_getRotationEulerRadians = function (rotation) {
    return this.pp_getRotationWorldEulerRadians(rotation);
};

WL.Object.prototype.pp_getRotationQuat = function (rotation) {
    return this.pp_getRotationWorldQuat(rotation);
};

//Rotation World

WL.Object.prototype.pp_getRotationWorld = function (rotation) {
    return this.pp_getRotationWorldEuler(rotation);
};

WL.Object.prototype.pp_getRotationWorldEuler = function (rotation) {
    return this.pp_getRotationWorldEulerDegrees(rotation);
};

WL.Object.prototype.pp_getRotationWorldEulerDegrees = function (rotation) {
    rotation = this.pp_getRotationWorldEulerRadians(rotation);
    rotation[0] = this._pp_toDegrees(rotation[0]);
    rotation[1] = this._pp_toDegrees(rotation[1]);
    rotation[2] = this._pp_toDegrees(rotation[2]);
    return rotation;
};

WL.Object.prototype.pp_getRotationWorldEulerRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.vec3.create()) {
        this.pp_getRotationWorldQuat(quat);
        this._pp_quaternionToEuler(quat, rotation);
        return rotation;
    };
}();

WL.Object.prototype.pp_getRotationWorldQuat = function (rotation = glMatrix.quat.create()) {
    glMatrix.quat.copy(rotation, this.transformWorld);
    return rotation;
};

//Rotation Local

WL.Object.prototype.pp_getRotationLocal = function (rotation) {
    return this.pp_getRotationLocalEuler(rotation);
};

WL.Object.prototype.pp_getRotationLocalEuler = function (rotation) {
    return this.pp_getRotationLocalEulerDegrees(rotation);
};

WL.Object.prototype.pp_getRotationLocalEulerDegrees = function (rotation) {
    rotation = this.pp_getRotationLocalEulerRadians(rotation);
    rotation.forEach(function (value, index, array) {
        array[index] = this._pp_toDegrees(value);
    }.bind(this));
    return rotation;
};

WL.Object.prototype.pp_getRotationLocalEulerRadians = function () {
    let quat = glMatrix.quat.create();
    return function (rotation = glMatrix.vec3.create()) {
        this.pp_getRotationLocalQuat(quat);
        this._pp_quaternionToEuler(quat, rotation);
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
    return scale;
};

WL.Object.prototype.pp_getScaleLocal = function (scale = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(scale, this.scalingLocal);
    return scale;
};

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