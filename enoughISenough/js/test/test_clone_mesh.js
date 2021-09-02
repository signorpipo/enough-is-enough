WL.registerComponent('test-clone-mesh', {
    objectToClone: { type: WL.Type.Object }
}, {
    init: function () {
    },
    start: function () {
        /*
        this.mesh = this.object.pp_addComponent("mesh");
        let otherMesh = this.objectToClone.pp_getComponent("mesh");
        this.mesh.material = otherMesh.material;
        this.mesh.mesh = otherMesh.mesh;
        this.mesh.skin = otherMesh.skin;
        */

        let params = new PP.CloneParams();
        //params.myIgnoreChildren = true;
        //params.myComponentsToIgnore.push("mesh");
        this.cloned = this.objectToClone.pp_clone(params);
        this.cloned.pp_getPositionWorld();
        this.cloned.pp_translate([0.11, 0, 0]);
        //console.log(this.cloned.pp_getPositionWorld());

    },
    update: function (dt) {
        let a = 2;
        a += 2;
    }
});