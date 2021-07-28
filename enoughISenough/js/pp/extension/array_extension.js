//Vector 3

Array.prototype.vec3_normalize = function (out = glMatrix.vec3.create()) {
    glMatrix.vec3.normalize(out, this);
    return out;
};