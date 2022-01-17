class MrNOTCloneSetup {
    constructor() {
        this.myStartHeight = 4;
        this.myEndHeight = 1.4;
        this.myTimeToReachTarget = 7;
        this.myStartDistance = 30;

        this.myDirection = [0, 0, 1];
    }
}

class CloneRotationSetup {
    constructor() {
        this.mySpinSpeed = new RangeValue([0, 0], false);
        this.mySpinChance = new RangeValueOverTime([2, 2], [2, 2], 0, 0, true);
        this.mySpinStartTime = -1;

        this.myTiltAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        /* 
         this.mySpinSpeed = new RangeValue([4, 6], false);
         this.mySpinChance = new RangeValueOverTime([1, 30], [1, 15], 60, 120, true);
         this.mySpinStartTime = 60;
 
         this.myTiltAngle = new RangeValueOverTime([0, 0], [0, 15], 20, 60, false);
         */
    }
}

class MrNOTClone {
    constructor(position, targetPosition, timeToReachTarget, rotationSetup, callbackOnDismiss, callbackOnReach) {
        this._myObject = Global.myGameObjectPoolMap.getObject(GameObjectType.MR_NOT_CLONE);
        PP.MeshUtils.setAlpha(this._myObject, 0);
        this._myObject.pp_setPosition(position);
        this._myFacing = targetPosition.vec3_sub(position);
        this._myObject.pp_lookTo(this._myFacing, [0, 1, 0]);
        this._myObject.pp_setScale([1, 1, 1]);
        this._myObject.pp_setActive(true);
        this._myScale = this._myObject.pp_getScale();

        this._myStartPosition = position;

        this._myTargetPosition = targetPosition;

        this._myTimeToReachTarget = timeToReachTarget;

        this._myCallbackOnDismiss = callbackOnDismiss;
        this._myCallbackOnReach = callbackOnReach;

        this._myCurrentPosition = [];
        this._myObject.pp_getPosition(this._myCurrentPosition);

        this._mySpeed = this._myTargetPosition.vec3_sub(this._myCurrentPosition).vec3_length() / this._myTimeToReachTarget;
        this._myTempTranslation = [0, 0, 0];

        this._mySpawnTimer = new PP.Timer(0.5);

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Mr NOT Clone"); 
        this._myFSM.addState("init");
        this._myFSM.addState("move", this._move.bind(this));
        this._myFSM.addState("stop");
        this._myFSM.addState("unspawning", this._unspawning.bind(this));
        this._myFSM.addState("inactive");

        this._myFSM.addTransition("init", "move", "start");
        this._myFSM.addTransition("move", "unspawning", "unspawn");
        this._myFSM.addTransition("move", "stop", "startStop");
        this._myFSM.addTransition("stop", "unspawning", "unspawn");
        this._myFSM.addTransition("unspawning", "inactive", "end");
        this._myFSM.addTransition("move", "inactive", "destroy");
        this._myFSM.addTransition("unspawning", "inactive", "destroy");

        this._myFSM.init("init");
        this._myFSM.perform("start");

        this._myCollisions = this._myObject.pp_getComponentsHierarchy("collision");

        this._myHitAudio = Global.myAudioManager.createAudioPlayer(SfxID.CLONE_EXPLODE);
        this._myAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.CLONE_APPEAR);

        this._myAppearAudioDelay = new PP.Timer(0.2);

        let tiltAngle = rotationSetup.myTiltAngle.get(Global.myVentDuration) * Math.pp_randomSign();
        this._myObject.pp_rotateObject([0, 0, tiltAngle]);

        this._mySpin = false;
        if (rotationSetup.mySpinStartTime >= 0 && Global.myVentDuration >= rotationSetup.mySpinStartTime) {
            this._mySpin = rotationSetup.mySpinChance.get(Global.myVentDuration) == 1;
        }
        this._mySpinSpeed = rotationSetup.mySpinSpeed.get(Global.myVentDuration) * Math.pp_randomSign();

        //Setup
        this._myReachTargetDistance = Global.myRingRadius * 2;
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    canUnspawn() {
        return this._myFSM.canPerform("unspawn");
    }

    unspawn() {
        if (this._myFSM.canPerform("unspawn")) {
            this._mySpawnTimer.start(PP.myEasyTuneVariables.get("Unspawn Menu Time"));
        }
        this._myFSM.perform("unspawn");
    }

    stop() {
        this._myFSM.perform("startStop");
    }

    isDone() {
        return this._myFSM.isInState("inactive");
    }

    destroy() {
        Global.myGameObjectPoolMap.releaseObject(GameObjectType.MR_NOT_CLONE, this._myObject);
        this._myObject = null;
        this._myFSM.perform("destroy");
    }

    _move(dt) {
        if (this._mySpin) {
            this._myObject.pp_rotateObject([0, 0, Math.sin(dt * this._mySpinSpeed) * 180]);
        }

        if (this._myAppearAudioDelay.isRunning()) {
            this._myAppearAudioDelay.update(dt);
            if (this._myAppearAudioDelay.isDone()) {
                this._myAppearAudio.setPosition(this._myObject.pp_getPosition());
                this._myAppearAudio.setPitch(Math.pp_random(0.85, 1.05));
                this._myAppearAudio.play();
            }
        }

        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);
            PP.MeshUtils.setAlpha(this._myObject, this._mySpawnTimer.getPercentage());
        }

        this._myObject.pp_getPosition(this._myCurrentPosition);
        this._myTargetPosition.vec3_sub(this._myCurrentPosition, this._myFacing);

        this._myObject.pp_lookTo(this._myFacing);

        this._myTempTranslation[2] = this._mySpeed * dt;
        this._myObject.pp_translateObject(this._myTempTranslation);

        this._myObject.pp_getPosition(this._myCurrentPosition);
        let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToTargetFromStart = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToCurrentFromStart = this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();

        if (distanceToTarget < this._myReachTargetDistance || distanceToTargetFromStart < distanceToCurrentFromStart) {
            if (PP.myEasyTuneVariables.get("Prevent Vent Lost")) {
                this._myCallbackOnDismiss(this, null);
                this.unspawn();
            } else {
                if (this._myCallbackOnReach) {
                    this._myCallbackOnReach(this);
                }
            }
        } else {
            this._checkHit();
        }
    }

    _checkHit() {
        let hit = false;
        let hittingObject = null;

        let collidingComps = [];
        for (let collision of this._myCollisions) {
            collidingComps.push(collision.queryOverlaps());
        }

        if (collidingComps.length > 0) {
            for (let i = 0; i < collidingComps[0].length; ++i) {
                let collidingComponent = collidingComps[0][i];
                if (collidingComponent.object.pp_getComponent("evidence-component") != null) {
                    let isColliding = true;
                    for (let j = 1; j < collidingComps.length; ++j) {
                        if (collidingComps[j].pp_find(element => element.equals(collidingComponent)) == null) {
                            isColliding = false;
                            break;
                        }
                    }

                    if (isColliding) {
                        let evidenceComponent = collidingComponent.object.pp_getComponent("evidence-component");
                        if (evidenceComponent.getEvidence().canHit()) {
                            hit = true;
                            hittingObject = collidingComponent.object;
                            break;
                        }
                    }
                }
            }
        }

        if (hit) {
            let evidence = hittingObject.pp_getComponent("evidence-component");
            evidence.hit(this._myObject);
            this.unspawn();
            this._myHitAudio.setPosition(this._myObject.pp_getPosition());
            this._myHitAudio.setPitch(Math.pp_random(0.85, 1.05));
            this._myHitAudio.play();
            if (this._myCallbackOnDismiss) {
                this._myCallbackOnDismiss(this, hittingObject);
            }

            Global.myStatistics.myMrNOTCloneDismissed += 1;
        }
    }

    _unspawning(dt) {
        this._mySpawnTimer.update(dt);

        let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._mySpawnTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        if (this._mySpawnTimer.isDone()) {
            Global.myParticlesManager.explosion(this._myObject.pp_getPosition(), 0.75, this._myScale.vec3_scale(PP.myEasyTuneVariables.get("mr NOT Clone Scale")), GameObjectType.MR_NOT_CLONE);
            this.destroy();
            this._myFSM.perform("end");
        }
    }
}