//Overall Deep Clone not implemented
WL.MeshComponent.prototype.pp_clone = function (object, params) {
    let clone = object.addComponent("mesh");

    if ((params.myDeepClone && params.myMesh_MaterialDeepCloneOverride == null) || params.myMesh_MaterialDeepCloneOverride) {
        clone.material = this.material.clone();
    } else {
        clone.material = this.material;
    }

    clone.mesh = this.mesh;
    clone.skin = this.skin;

    return clone;
};

//TEMP not complete
WL.PhysXComponent.prototype.pp_clone = function (object, params) {
    let clone = object.addComponent("physx");

    clone.angularDamping = this.angularDamping;
    clone.angularVelocity = this.angularVelocity.slice(0);

    clone.dynamicFriction = this.dynamicFriction;

    clone.extents = this.extents.slice(0);

    clone.kinematic = this.kinematic;

    clone.linearDamping = this.linearDamping;
    clone.linearVelocity = this.linearVelocity.slice(0);

    clone.mass = this.mass;
    clone.restitution = this.restitution;
    clone.shape = this.shape;
    clone.static = this.static;
    clone.staticFriction = this.staticFriction;

    return clone;
};