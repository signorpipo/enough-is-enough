WL.registerComponent("ring-sfx-on-collision", {
}, {
    init: function () {
    },
    start: function () {
        this._myPhysx = this.object.pp_getComponent("physx");
        //this._myPhysx.onCollision(this._onCollision.bind(this));
        this._myPhysxToIgnore = [];

        this._myCollisionAudio = Global.myAudioManager.createAudioPlayer(SfxID.COLLISION);
        this._myCollisionPitch = this._myCollisionAudio.getPitch();
    },
    update: function (dt) {
        if (this._myPhysx.active) {
            this._myPhysx.active = false;
        }

        if (this._myPhysxToIgnore.length > 0) {
            for (let element of this._myPhysxToIgnore) {
                element[1].update(dt);
            }
            this._myPhysxToIgnore.pp_removeAll(element => element[1].isDone());
        }
    },
    _onCollision(type, physx) {
        if (type == WL.CollisionEventType.Touch) {
            let evidence = physx.object.pp_getComponent("evidence-component");
            let timeActive = 1.5;
            //timeActive = 0;
            if (evidence != null && evidence.getTimeActive() >= timeActive) {
                if (!this._myPhysxToIgnore.pp_has(element => element[0].pp_equals(physx.object))) {
                    this._myCollisionAudio.setPosition(physx.object.pp_getPosition());
                    this._myCollisionAudio.setPitch(Math.pp_random(this._myCollisionPitch - 0.15, this._myCollisionPitch + 0.05));
                    this._myCollisionAudio.play();
                }
            }
        } else if (type == WL.CollisionEventType.TouchLost) {
            if (physx.object.pp_getComponent("evidence-component") != null) {
                this._myPhysxToIgnore.push([physx.object, new PP.Timer(0.1)]);
            }
        }
    }
});