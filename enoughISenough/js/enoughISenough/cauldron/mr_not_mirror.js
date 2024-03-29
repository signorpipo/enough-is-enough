WL.registerComponent("mr_not_mirror", {
}, {
    init: function () {
    },
    start: function () {
    },
    update: function (dt) {
        if (Global.myUpdateReady) {
            let difference = this.object.pp_getPosition().vec3_sub(Global.myPlayerPosition);
            let diffLength = difference.vec3_length();

            let distanceFactor = Math.pp_mapToRange(diffLength, 0.1, 0.5, 0.9, 0);

            let forward = this.object.pp_getUp();
            let playerForward = Global.myPlayerForward;
            if (!forward.vec3_isConcordant(playerForward)) {
                playerForward = playerForward.vec3_negate();
            }

            let angle = Math.pp_toDegrees(forward.vec3_angleRadians(playerForward));

            let angleFactor = Math.pp_mapToRange(angle, 10, 45, 0.9, 0);

            let alpha = Math.pp_clamp(angleFactor * distanceFactor, 0, 0.6);

            PP.MeshUtils.setAlpha(this.object, alpha);
        }
    }
});