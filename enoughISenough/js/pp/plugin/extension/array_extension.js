//ARRAY
Array.prototype.pp_remove = function (index) {
    let elementRemoved = null;
    if (index >= 0 && index < this.length) {
        let arrayRemoved = this.splice(index, 1);
        if (arrayRemoved.length == 1) {
            elementRemoved = arrayRemoved[0];
        }
    }
    return elementRemoved;
};

//VECTOR 3

//glMatrix Bridge

Array.prototype.vec3_normalize = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
};

Array.prototype.vec3_copy = function (vector) {
    glMatrix.vec3.copy(this, vector);
    return this;
};

Array.prototype.vec3_clone = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.copy(out, this);
    return out;
};

Array.prototype.vec3_set = function (x, y = null, z = null) {
    if (y == null) {
        glMatrix.vec3.set(this, x, x, x);
    } else {
        glMatrix.vec3.set(this, x, y, z);
    }
    return this;
};

Array.prototype.vec3_zero = function () {
    glMatrix.vec3.zero(this);
    return this;
};

Array.prototype.vec3_angle = function (vector) {
    return glMatrix.vec3.angle(this, vector);
};

Array.prototype.vec3_length = function () {
    return glMatrix.vec3.length(this);
};

Array.prototype.vec3_add = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.add(out, this, vector);
    return out;
};

Array.prototype.vec3_sub = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, vector);
    return out;
};

Array.prototype.vec3_mul = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.mul(out, this, vector);
    return out;
};

Array.prototype.vec3_div = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.div(out, this, vector);
    return out;
};

Array.prototype.vec3_scale = function (value, out = glMatrix.vec3.create()) {
    glMatrix.vec3.scale(out, this, value);
    return out;
};

Array.prototype.vec3_negate = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.negate(out, this);
    return out;
};

//New Methods

Array.prototype.vec3_toRadians = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, glMatrix.glMatrix.toRadian(this[0]), glMatrix.glMatrix.toRadian(this[1]), glMatrix.glMatrix.toRadian(this[2]));
    return out;
};

Array.prototype.vec3_toDegrees = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.set(out, this[0] * (180 / Math.PI), this[1] * (180 / Math.PI), this[2] * (180 / Math.PI));
    return out;
};

Array.prototype.vec3_radiansToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromRadians(this);
    return out;
};

Array.prototype.vec3_degreesToQuat = function (out = glMatrix.quat.create()) {
    out.quat_fromDegrees(this);
    return out;
};

Array.prototype.vec3_isNormalized = function () {
    return Math.abs(glMatrix.vec3.length(this) - 1) < this._pp_epsilon;
};

Array.prototype.vec3_getComponentAlongAxis = function (axis, out = glMatrix.vec3.create()) {
    let angle = glMatrix.vec3.angle(this, axis);
    let length = Math.cos(angle) * glMatrix.vec3.length(this);

    glMatrix.vec3.copy(out, axis);
    glMatrix.vec3.scale(out, out, length);
    return out;
};

Array.prototype.vec3_removeComponentAlongAxis = function () {
    let componentAlong = glMatrix.vec3.create();
    return function (axis, out = glMatrix.vec3.create()) {
        this.vec3_getComponentAlongAxis(axis, componentAlong);
        glMatrix.vec3.sub(out, this, componentAlong);
        return out;
    };
}();

Array.prototype.vec3_isConcordant = function (vector) {
    return glMatrix.vec3.angle(this, vector) <= Math.PI / 2;
};

Array.prototype.vec3_rotateAroundAxis = function () {
    let quat = glMatrix.quat.create();
    return function (axis, angle, origin = [0, 0, 0], out = glMatrix.vec3.create()) {
        glMatrix.vec3.sub(out, this, origin);

        glMatrix.quat.setAxisAngle(quat, axis, angle);
        glMatrix.vec3.transformQuat(out, out, quat);

        glMatrix.vec3.add(out, out, origin);
        return out;
    };
}();

Array.prototype.vec3_convertPositionToWorld = function (parentTransform, out) {
    return this.vec3_convertPositionToWorldMatrix(parentTransform, out);
};

Array.prototype.vec3_convertPositionToLocal = function (parentTransform, out) {
    return this.vec3_convertPositionToLocalMatrix(parentTransform, out);
};

Array.prototype.vec3_convertPositionToWorldMatrix = function (parentTransform, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformMat4(out, this, parentTransform);
    return out;
};

Array.prototype.vec3_convertPositionToLocalMatrix = function () {
    let inverse = glMatrix.mat4.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        glMatrix.mat4.invert(inverse, parentTransform);
        glMatrix.vec3.transformMat4(out, this, inverse);
        return out;
    };
}();

Array.prototype.vec3_convertPositionToWorldQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToWorldMatrix(parentTransformMatrix, out);
    };
}();

Array.prototype.vec3_convertPositionToLocalQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_setPositionRotationQuatScale(position, rotation, one);
        return this.vec3_convertPositionToLocalMatrix(parentTransformMatrix, out);
    };
}();

Array.prototype.vec3_convertDirectionToWorld = function (parentTransform, out) {
    return this.vec3_convertDirectionToWorldMatrix(parentTransform, out);
};

Array.prototype.vec3_convertDirectionToLocal = function (parentTransform, out) {
    return this.vec3_convertDirectionToLocalMatrix(parentTransform, out);
};

Array.prototype.vec3_convertDirectionToWorldMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Array.prototype.vec3_convertDirectionToLocalMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();


Array.prototype.vec3_convertDirectionToWorldQuat = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Array.prototype.vec3_convertDirectionToLocalQuat = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

//QUAT

//glMatrix Bridge

Array.prototype.quat_normalize = function (out = glMatrix.quat.create()) {
    glMatrix.quat.normalize(out, this);
    return out;
};

Array.prototype.quat_copy = function (quat) {
    glMatrix.quat.copy(this, quat);
    return this;
};

Array.prototype.quat_set = function (x, y = null, z = null, w = null) {
    if (y == null) {
        glMatrix.quat.set(this, x, x, x, x);
    } else {
        glMatrix.quat.set(this, x, y, z, w);
    }
    return this;
};

Array.prototype.quat_identity = function () {
    glMatrix.quat.identity(this);
    return this;
};

//New Methods

Array.prototype.quat_fromRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (radiansRotation) {
        radiansRotation.vec3_toDegrees(vector);
        return this.quat_fromDegrees(vector);
    };
}();

Array.prototype.quat_fromDegrees = function (degreesRotation) {
    glMatrix.quat.fromEuler(this, degreesRotation[0], degreesRotation[1], degreesRotation[2]);
    return this;
};

Array.prototype.quat_toRadians = function () {
    let mat3 = glMatrix.mat3.create();
    return function (out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(mat3, this);

        //Rotation order is ZYX 
        out[1] = Math.asin(-this._pp_clamp(mat3[2], -1, 1));

        if (Math.abs(mat3[2]) < (1 - this._pp_epsilon)) {
            out[0] = Math.atan2(mat3[5], mat3[8]);
            out[2] = Math.atan2(mat3[1], mat3[0]);
        } else {
            out[0] = 0;
            out[2] = Math.atan2(-mat3[3], mat3[4]);
        }

        return out;
    };
}();

Array.prototype.quat_toDegrees = function (out = glMatrix.vec3.create()) {
    this.quat_toRadians(out);
    out.vec3_toDegrees(out);
    return out;
};

Array.prototype.quat_isNormalized = function () {
    return Math.abs(glMatrix.quat.length(this) - 1) < this._pp_epsilon;
};

//QUAT 2

//glMatrix Bridge

Array.prototype.quat2_normalize = function (out = glMatrix.quat2.create()) {
    glMatrix.quat2.normalize(out, this);
    return out;
};

Array.prototype.quat2_copy = function (quat2) {
    glMatrix.quat2.copy(this, quat2);
    return this;
};

Array.prototype.quat2_identity = function () {
    glMatrix.quat2.identity(this);
    return this;
};

Array.prototype.quat2_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.quat2.getTranslation(out, this);
    return this;
};

Array.prototype.quat2_getRotationQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.copy(out, this);
    return this;
};

Array.prototype.quat2_setPositionRotationQuat = function (position, rotation) {
    glMatrix.quat2.fromRotationTranslation(this, rotation, position);
    return this;
};

//New Methods

Array.prototype.quat2_getAxes = function () {
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

Array.prototype.quat2_toLocal = function () {
    let invertQuat = glMatrix.quat2.create();
    return function (parentTransform, out = glMatrix.quat2.create()) {
        glMatrix.quat2.conjugate(invertQuat, parentTransform);
        glMatrix.quat2.mul(out, invertQuat, this);
        return out;
    };
}();

Array.prototype.quat2_toWorld = function (parentTransform, out = glMatrix.quat2.create()) {
    glMatrix.quat2.mul(out, parentTransform, this);
    return out;
};

Array.prototype.quat2_toTransformMatrix = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.fromQuat2(out, this);
    return out;
};

Array.prototype.quat2_fromTransformMatrix = function (transformMatrix) {
    transformMatrix.mat4_toTransformQuat(this);
    return this;
};

//MATRIX 4

//glMatrix Bridge

Array.prototype.mat4_copy = function (mat4) {
    glMatrix.mat4.copy(this, mat4);
    return this;
};

Array.prototype.mat4_identity = function () {
    glMatrix.mat4.identity(this);
    return this;
};

Array.prototype.mat4_invert = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.invert(out, this);
    return out;
};

Array.prototype.mat4_clone = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.copy(out, this);
    return out;
};

Array.prototype.mat4_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getTranslation(out, this);
    return out;
};

Array.prototype.mat4_getRotation = function (out = glMatrix.vec3.create()) {
    return this.mat4_getRotationDegrees(out);
};

Array.prototype.mat4_getRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toDegrees(out);
        return out;
    };
}();

Array.prototype.mat4_getRotationRadians = function () {
    let quat = glMatrix.quat.create();
    return function (out = glMatrix.vec3.create()) {
        this.mat4_getRotationQuat(quat);
        quat.quat_toRadians(out);
        return out;
    };
}();

Array.prototype.mat4_getRotationQuat = function () {
    let scale = glMatrix.vec3.create();
    let transformMatrixNoScale = glMatrix.mat4.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (out = glMatrix.quat.create()) {
        glMatrix.mat4.getScaling(scale, this);
        glMatrix.vec3.divide(inverseScale, one, scale);
        glMatrix.mat4.scale(transformMatrixNoScale, this, inverseScale);
        glMatrix.mat4.getRotation(out, transformMatrixNoScale);
        glMatrix.quat.normalize(out, out);
        return out;
    };
}();

Array.prototype.mat4_getScale = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getScaling(out, this);
    return out;
};

//New Methods

Array.prototype.mat4_setPosition = function (position) {
    this[12] = position[0];
    this[13] = position[1];
    this[14] = position[2];
    return this;
};

Array.prototype.mat4_setRotation = function (rotation) {
    this.mat4_setRotationDegrees(rotation);
    return this;
};

Array.prototype.mat4_setRotationDegrees = function () {
    let quat = glMatrix.quat.create();
    return function (rotation) {
        this.mat4_setRotationQuat(rotation.vec3_degreesToQuat(quat));
        return this;
    };
}();

Array.prototype.mat4_setRotationRadians = function () {
    let vector = glMatrix.vec3.create();
    return function (rotation) {
        this.mat4_setRotationDegrees(rotation.vec3_toDegrees(vector));
        return this;
    };
}();

Array.prototype.mat4_setRotationQuat = function () {
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    return function (rotation) {
        this.mat4_getPosition(position);
        this.mat4_getScale(scale);
        this.mat4_setPositionRotationQuatScale(position, rotation, scale);
        return this;
    };
}();

Array.prototype.mat4_setScale = function () {
    let tempScale = glMatrix.vec3.create();
    return function (scale) {
        glMatrix.mat4.getScaling(tempScale, this);
        glMatrix.vec3.divide(tempScale, scale, tempScale);
        glMatrix.mat4.scale(this, this, tempScale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationScale = function (position, rotation, scale) {
    this.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return this;
};

Array.prototype.mat4_setPositionRotationDegreesScale = function () {
    let quat = glMatrix.quat.create();
    return function (position, rotation, scale) {
        this.mat4_setPositionRotationQuatScale(position, rotation.vec3_degreesToQuat(quat), scale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationRadiansScale = function () {
    let vector = glMatrix.vec3.create();
    return function (position, rotation, scale) {
        this.mat4_setPositionRotationDegreesScale(position, rotation.vec3_toRadians(vector), scale);
        return this;
    };
}();

Array.prototype.mat4_setPositionRotationQuatScale = function (position, rotation, scale) {
    glMatrix.mat4.fromRotationTranslationScale(this, rotation, position, scale);
    return this;
};

Array.prototype.mat4_getAxes = function (out = [glMatrix.vec3.create(), glMatrix.vec3.create(), glMatrix.vec3.create()]) {
    glMatrix.vec3.set(out[0], this[0], this[1], this[2]);
    glMatrix.vec3.set(out[1], this[4], this[5], this[6]);
    glMatrix.vec3.set(out[2], this[8], this[9], this[10]);

    glMatrix.vec3.normalize(out[0], out[0]);
    glMatrix.vec3.normalize(out[1], out[1]);
    glMatrix.vec3.normalize(out[2], out[2]);

    return out;
};

Array.prototype.mat4_toLocal = function () {
    let invertMatrix = glMatrix.mat4.create();
    return function (parentTransform, out = glMatrix.mat4.create()) {
        glMatrix.mat4.invert(invertMatrix, parentTransform);
        glMatrix.mat4.mul(out, invertMatrix, this);
        return out;
    };
}();

Array.prototype.mat4_toWorld = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.mat4.create()) {
        if (parentTransform.mat4_hasUniformScale()) {
            glMatrix.mat4.mul(out, parentTransform, this);
        } else {
            glMatrix.vec3.set(position, this[12], this[13], this[14]);
            position.vec3_convertPositionToWorldMatrix(parentTransform, position);

            glMatrix.mat4.getScaling(scale, parentTransform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(convertTransform, parentTransform, inverseScale);

            glMatrix.mat4.mul(out, convertTransform, this);
            glMatrix.mat4.scale(out, out, scale);

            out[12] = position[0];
            out[13] = position[1];
            out[14] = position[2];
            out[15] = 1;
        }
        return out;
    };
}();

Array.prototype.mat4_toLocal = function () {
    let convertTransform = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let scale = glMatrix.vec3.create();
    let inverseScale = glMatrix.vec3.create();
    let one = glMatrix.vec3.create();
    glMatrix.vec3.set(one, 1, 1, 1);
    return function (parentTransform, out = glMatrix.mat4.create()) {
        if (parentTransform.mat4_hasUniformScale()) {
            glMatrix.mat4.invert(convertTransform, parentTransform);
            glMatrix.mat4.mul(out, convertTransform, this);
        } else {
            glMatrix.vec3.set(position, this[12], this[13], this[14]);
            position.vec3_convertPositionToLocalMatrix(parentTransform, position);

            glMatrix.mat4.getScaling(scale, parentTransform);
            glMatrix.vec3.divide(inverseScale, one, scale);
            glMatrix.mat4.scale(convertTransform, parentTransform, inverseScale);

            glMatrix.mat4.invert(convertTransform, convertTransform);
            glMatrix.mat4.mul(out, convertTransform, this);
            glMatrix.mat4.scale(out, out, inverseScale);

            out[12] = position[0];
            out[13] = position[1];
            out[14] = position[2];
            out[15] = 1;
        }
        return out;
    };
}();

Array.prototype.mat4_hasUniformScale = function () {
    let scale = glMatrix.vec3.create();
    return function () {
        glMatrix.mat4.getScaling(scale, this);
        return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
    };
}();

Array.prototype.mat4_toTransformQuat = function () {
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function (out = glMatrix.quat2.create()) {
        glMatrix.mat4.getTranslation(position, this);
        this.mat4_getRotationQuat(rotation, this);
        glMatrix.quat2.fromRotationTranslation(out, rotation, position);
        return out;
    };
}();

Array.prototype.mat4_fromTransformQuat = function (transformQuat) {
    transformQuat.quat2_toTransformMatrix(this);
    return this;
};

//CREATION

function vec3_create(x = null, y = null, z = null) {
    let out = glMatrix.vec3.create();
    if (x != null) {
        out.vec3_set(x, y, z);
    }
    return out;
}

function quat_create(x = null, y = null, z = null, w = null) {
    let out = glMatrix.quat.create();
    if (x != null) {
        out.quat_set(x, y, z, w);
    }
    return out;
}

function quat2_create() {
    let out = glMatrix.quat2.create();
    return out;
}

function mat4_create() {
    let out = glMatrix.mat4.create();
    return out;
}

function mat4_fromPositionRotationScale(position, rotation, scale) {
    return mat4_fromPositionRotationDegreesScale(position, rotation, scale);
}

function mat4_fromPositionRotationDegreesScale(position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationDegreesScale(position, rotation, scale);
    return out;
}

function mat4_fromPositionRotationRadiansScale(position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationRadiansScale(position, rotation, scale);
    return out;
}

function mat4_fromPositionRotationQuatScale(position, rotation, scale) {
    let out = glMatrix.mat4.create();
    out.mat4_setPositionRotationQuatScale(position, rotation, scale);
    return out;
}

//UTILS

Array.prototype._pp_epsilon = 0.000001;

Array.prototype._pp_clamp = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};