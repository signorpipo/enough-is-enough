//VECTOR 3

//glMatrix Bridge

Float32Array.prototype.vec3_normalize = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
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

Float32Array.prototype.vec3_angle = function (vector) {
    return glMatrix.vec3.angle(this, vector);
};

Float32Array.prototype.vec3_length = function () {
    return glMatrix.vec3.length(this);
};

Float32Array.prototype.vec3_add = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.add(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_sub = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.sub(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_mul = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.mul(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_div = function (vector, out = glMatrix.vec3.create()) {
    glMatrix.vec3.div(out, this, vector);
    return out;
};

Float32Array.prototype.vec3_scale = function (value, out = glMatrix.vec3.create()) {
    glMatrix.vec3.scale(out, this, value);
    return out;
};

Float32Array.prototype.vec3_negate = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.negate(out, this);
    return out;
};

//New Methods

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

Float32Array.prototype.vec3_isNormalized = function () {
    return Math.abs(glMatrix.vec3.length(this) - 1) < this._pp_epsilon;
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

Float32Array.prototype.vec3_convertPositionToWorld = function (parentTransform, out) {
    return this.vec3_convertPositionToWorldMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertPositionToLocal = function (parentTransform, out) {
    return this.vec3_convertPositionToLocalMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertPositionToWorldMatrix = function (parentTransform, out = glMatrix.vec3.create()) {
    glMatrix.vec3.transformMat4(out, this, parentTransform);
    return out;
};

Float32Array.prototype.vec3_convertPositionToLocalMatrix = function () {
    let inverse = glMatrix.mat4.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        glMatrix.mat4.invert(inverse, parentTransform);
        glMatrix.vec3.transformMat4(out, this, inverse);
        return out;
    };
}();

Float32Array.prototype.vec3_convertPositionToWorldQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_fromPositionRotation(position, rotation);
        return this.vec3_convertPositionToWorldMatrix(parentTransformMatrix, out);
    };
}();

Float32Array.prototype.vec3_convertPositionToLocalQuat = function () {
    let parentTransformMatrix = glMatrix.mat4.create();
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getPosition(position);
        parentTransform.quat2_getRotationQuat(rotation);
        parentTransformMatrix.mat4_fromPositionRotation(position, rotation);
        return this.vec3_convertPositionToLocalMatrix(parentTransformMatrix, out);
    };
}();

Float32Array.prototype.vec3_convertDirectionToWorld = function (parentTransform, out) {
    return this.vec3_convertDirectionToWorldMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertDirectionToLocal = function (parentTransform, out) {
    return this.vec3_convertDirectionToLocalMatrix(parentTransform, out);
};

Float32Array.prototype.vec3_convertDirectionToWorldMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Float32Array.prototype.vec3_convertDirectionToLocalMatrix = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.mat4_getRotationQuat(rotation);
        glMatrix.quat.conjugate(rotation, rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();


Float32Array.prototype.vec3_convertDirectionToWorldQuat = function () {
    let rotation = glMatrix.quat.create();
    return function (parentTransform, out = glMatrix.vec3.create()) {
        parentTransform.quat2_getRotationQuat(rotation);
        glMatrix.vec3.transformQuat(out, this, rotation);
        return out;
    };
}();

Float32Array.prototype.vec3_convertDirectionToLocalQuat = function () {
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

Float32Array.prototype.quat_normalize = function (out = glMatrix.quat.create()) {
    glMatrix.quat.normalize(out, this);
    return out;
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

Float32Array.prototype.quat_toRadians = function () {
    let mat3 = glMatrix.mat3.create();
    return function (out = glMatrix.vec3.create()) {
        glMatrix.mat3.fromQuat(mat3, this);

        //Rotation order is ZYX 
        out[1] = Math.asin(-Math.pp_clamp(mat3[2], -1, 1));

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

Float32Array.prototype.quat_toDegrees = function (out = glMatrix.vec3.create()) {
    this.quat_toRadians(out);
    out.vec3_toDegrees(out);
    return out;
};

Float32Array.prototype.quat_isNormalized = function () {
    return Math.abs(glMatrix.quat.length(this) - 1) < this._pp_epsilon;
};

//QUAT 2

//glMatrix Bridge

Float32Array.prototype.quat2_normalize = function (out = glMatrix.quat2.create()) {
    glMatrix.quat2.normalize(out, this);
    return out;
};

Float32Array.prototype.quat2_copy = function (quat2) {
    glMatrix.quat2.copy(this, quat2);
    return this;
};

Float32Array.prototype.quat2_identity = function () {
    glMatrix.quat2.identity(this);
    return this;
};

Float32Array.prototype.quat2_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.quat2.getTranslation(out, this);
    return this;
};

Float32Array.prototype.quat2_getRotationQuat = function (out = glMatrix.quat.create()) {
    glMatrix.quat.copy(out, this);
    return this;
};

Float32Array.prototype.quat2_fromPositionRotation = function (position, rotation) {
    glMatrix.quat2.fromRotationTranslation(this, rotation, position);
    return this;
};

//New Methods

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

Float32Array.prototype.quat2_toTransformMatrix = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.fromQuat2(out, this);
    return out;
};

Float32Array.prototype.quat2_fromTransformMatrix = function (transformMatrix) {
    transformMatrix.mat4_toTransformQuat(this);
    return this;
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

Float32Array.prototype.mat4_fromPositionRotationScale = function (position, rotation, scale) {
    glMatrix.mat4.fromRotationTranslationScale(this, rotation, position, scale);
    return this;
};

Float32Array.prototype.mat4_fromPositionRotation = function (position, rotation) {
    glMatrix.mat4.fromRotationTranslation(this, rotation, position);
    return this;
};

Float32Array.prototype.mat4_invert = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.invert(out, this);
    return out;
};

Float32Array.prototype.mat4_getScale = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getScaling(out, this);
    return out;
};

Float32Array.prototype.mat4_clone = function (out = glMatrix.mat4.create()) {
    glMatrix.mat4.copy(out, this);
    return out;
};

Float32Array.prototype.mat4_getPosition = function (out = glMatrix.vec3.create()) {
    glMatrix.mat4.getTranslation(out, this);
    return out;
};

Float32Array.prototype.mat4_getRotationQuat = function () {
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

Float32Array.prototype.mat4_toWorld = function () {
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

Float32Array.prototype.mat4_toLocal = function () {
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

Float32Array.prototype.mat4_setScale = function () {
    let tempScale = glMatrix.vec3.create();
    return function (scale) {
        glMatrix.mat4.getScaling(tempScale, this);
        glMatrix.vec3.divide(tempScale, scale, tempScale);
        glMatrix.mat4.scale(this, this, tempScale);
        return this;
    };
}();

Float32Array.prototype.mat4_hasUniformScale = function () {
    let scale = glMatrix.vec3.create();
    return function () {
        glMatrix.mat4.getScaling(scale, this);
        return Math.abs(scale[0] - scale[1]) < this._pp_epsilon && Math.abs(scale[1] - scale[2]) < this._pp_epsilon && Math.abs(scale[0] - scale[2]) < this._pp_epsilon;
    };
}();

Float32Array.prototype.mat4_toTransformQuat = function () {
    let position = glMatrix.vec3.create();
    let rotation = glMatrix.quat.create();
    return function (out = glMatrix.quat2.create()) {
        glMatrix.mat4.getTranslation(position, this);
        this.mat4_getRotationQuat(rotation, this);
        glMatrix.quat2.fromRotationTranslation(out, rotation, position);
        return out;
    };
}();

Float32Array.prototype.mat4_fromTransformQuat = function (transformQuat) {
    transformQuat.quat2_toTransformMatrix(this);
    return this;
};

//UTILS

Float32Array.prototype._pp_epsilon = 0.000001;