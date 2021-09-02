//Overall Deep Clone not implemented
WL.MeshComponent.prototype.pp_clone = function (object, params) {
    let clonedMesh = object.addComponent("mesh");

    if ((params.myDeepClone && params.myMesh_MaterialDeepCloneOverride == null) || params.myMesh_MaterialDeepCloneOverride) {
        clonedMesh.material = this.material.clone();
    } else {
        clonedMesh.material = this.material;
    }

    clonedMesh.mesh = this.mesh;
    clonedMesh.skin = this.skin;

    return clonedMesh;
};