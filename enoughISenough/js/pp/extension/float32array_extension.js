//VECTOR 3

//glMatrix Bridge

Float32Array.prototype.vec3_normalize = function () {
    glMatrix.vec3.normalize(this, this);
    return this;
};

Float32Array.prototype.vec3_copy = function (vector) {
    glMatrix.vec3.copy(this, vector);
    return this;
};

Float32Array.prototype.vec3_set = function (x, y, z) {
    glMatrix.vec3.set(this, x, y, z);
    return this;
};

Float32Array.prototype.vec3_zero = function () {
    glMatrix.vec3.zero(this);
    return this;
};

Float32Array.prototype.vec3_add = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.add(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_mul = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.mul(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_scale = function (value, out = glMatrix.vec3.create()) {
    glMatrix.vec3.scale(out, this, value);
    return out;
};

//New Methods

Float32Array.prototype.vec3_getNormalized = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
};

Float32Array.prototype.vec3_toRadians = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, glMatrix.glMatrix.toRadian(this[0]), glMatrix.glMatrix.toRadian(this[1]), glMatrix.glMatrix.toRadian(this[2]));
    return out;
};

Float32Array.prototype.vec3_toDegrees = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[0] * (180 / Math.PI), this[1] * (180 / Math.PI), this[2] * (180 / Math.PI));
    return out;
};

Float32Array.prototype.vec3_radiansToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromRadians(this);
    return out;
};

Float32Array.prototype.vec3_degreesToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromDegrees(this);
    return out;
};

Float32Array.prototype.vec3_getComponentAlongAxis = function (axis, out = glMatrix.vec3.create()) {
    let angle = glMatrix.vec3.angle(this, axis);
    let length = Math.cos(angle) * glMatrix.vec3.length(this);

    glMatrix.vec3.copy(out, axis);
    glMatrix.vec3.scale(out, out, length);
    return out;
};

Float32Array.prototype.vec3_removeComponentAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function (axis, out = glMatrix.vec3.create()) {
        this.vec3_getComponentAlongAxis(axis, componentAlong);
        glMatrix.vec3.sub(out, this, componentAlong);
        return out;
    };
}();

Float32Array.prototype.vec3_isConcordant = function (vector) {
    return glMatrix.vec3.angle(this, vector) <= Math.PI / 2;
};

Float32Array.prototype.vec3_rotateAroundAxis = function () {
    let quat = glMatrix.quat.create();
    return function (axis, angle, origin = [0, 0, 0], out = glMatrix.vec3.create()) {
        glMatrix.vec3.sub(out, this, origin);

        glMatrix.quat.setAxisAngle(quat, axis, angle);
        glMatrix.vec3.transformQuat(out, out, quat);

        glMatrix.vec3.add(out, out, origin);
        return out;
    };
}();

//QUAT

//glMatrix Bridge

Float32Array.prototype.quat_normalize = function () {
    glMatrix.quat.normalize(this, this);
    return this;
};

Float32Array.prototype.quat_copy = function (quat) {
    glMatrix.quat.copy(this, quat);
    return this;
};

Float32Array.prototype.quat_set = function (x, y, z, w) {
    glMatrix.quat.set(this, x, y, z, w);
    return this;
};

Float32Array.prototype.quat_identity = function () {
    glMatrix.quat.identity(this);
    return this;
};

//New Methods

Float32Array.prototype.quat_getNormalized = function (out = glMatrix.quat.create()) {
    glMatrix.quat.normalize(out, this);
    return out;
};

Float32Array.prototype.quat_fromRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (radiansRotation) {
        radiansRotation.vec3_toDegrees(vector);
        return this.quat_fromDegrees(vector);
    };
}();

Float32Array.prototype.quat_fromDegrees = function (degreesRotation) {
    glMatrix.quat.fromEuler(this, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return this;
};

//QUAT 2

//glMatrix Bridge

Float32Array.prototype.quat2_normalize = function () {
    glMatrix.quat2.normalize(this, this);
    return this;
};

Float32Array.prototype.quat2_copy = function (quat2) {
    glMatrix.quat2.copy(this, quat2);
    return this;
};

Float32Array.prototype.quat2_identity = function () {
    glMatrix.quat2.identity(this);
    return this;
};

//New Methods

Float32Array.prototype.quat2_getNormalized = function (out = glMatrix.quat2.create()) {
    glMatrix.quat2.normalize(out, this);
    return out;
};

Float32Array.prototype.quat2_getAxes = function () {
    let rotationMatrix = glMatrix.mat3.create();
    return function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
        glMatrix.mat3.fromQuat(rotationMatrix, this);

        glMatrix.vec3.set(out[0], rotationMatrix[0], rotationMatrix[1], rotationMatrix[2]);
        glMatrix.vec3.set(out[1], rotationMatrix[3], rotationMatrix[4], rotationMatrix[5]);
        glMatrix.vec3.set(out[2], rotationMatrix[6], rotationMatrix[7], rotationMatrix[8]);

        glMatrix.vec3.normalize(out[0], out[0]);
        glMatrix.vec3.normalize(out[1], out[1]);
        glMatrix.vec3.normalize(out[2], out[2]);

        return out;
    };
}();

Float32Array.prototype.quat2_toLocal = function () {
    let invertQuat = glMatrix.quat2.create();
    return function (parentTransform, out = glMatrix.quat2.create()) {
        glMatrix.quat2.conjugate(invertQuat, parentTransform);
        glMatrix.quat2.mul(out, invertQuat, this);
        return out;
    };
}();

Float32Array.prototype.quat2_toWorld = function (parentTransform, out = glMatrix.quat2.create()) {
    glMatrix.quat2.mul(out, parentTransform, this);
    return out;
};

//MATRIX 4

//glMatrix Bridge

Float32Array.prototype.mat4_copy = function (mat4) {
    glMatrix.mat4.copy(this, mat4);
    return this;
};

Float32Array.prototype.mat4_identity = function () {
    glMatrix.mat4.identity(this);
    return this;
};

Float32Array.prototype.mat4_fromRotationTranslationScale = function (rotation, translation, scale) {
    glMatrix.mat4.fromRotationTranslationScale(this, rotation, translation, scale);
    return this;
};

//New Methods

Float32Array.prototype.mat4_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    glMatrix.vec3.set(out[0], this[0], this[1], this[2]);
    glMatrix.vec3.set(out[1], this[4], this[5], this[6]);
    glMatrix.vec3.set(out[2], this[8], this[9], this[10]);

    glMatrix.vec3.normalize(out[0], out[0]);
    glMatrix.vec3.normalize(out[1], out[1]);
    glMatrix.vec3.normalize(out[2], out[2]);

    return out;
};

Float32Array.prototype.mat4_toLocal = function () {
    let invertMatrix = glMatrix.mat4.create();
    return function (parentTransform, out = glMatrix.mat4.create()) {
        glMatrix.mat4.invert(invertMatrix, parentTransform);
        glMatrix.mat4.mul(out, invertMatrix, this);
        return out;
    };
}();

Float32Array.prototype.mat4_toWorld = function (parentTransform, out = glMatrix.mat4.create()) {
    glMatrix.mat4.mul(out, parentTransform, this);
    return out;
};