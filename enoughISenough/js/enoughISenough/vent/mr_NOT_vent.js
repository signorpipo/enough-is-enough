class MrNOTVentSetup {
    constructor() {
        this.myDirection = [0, 0, -1];

        this.myTimeToReachTarget = 50;
        this.myMaxPatience = 15;
        this.myReachTargetDistance = 5;
    }
}

class MrNOTVent {
    constructor(mrNOTSetup, ventRuntimeSetup, callbackOnPatienceOver, callbackOnReach) {
        this._myMrNOTSetup = mrNOTSetup;
        this._myObject = Global.myGameObjects.get(GameObjectType.MR_NOT);

        this._myStartPosition = [0, 11, -18];
        this._myRotation = [40, 0, 0];
        this._myScale = [5, 5, 5];


        this._myTargetPosition = [0, 1, 0];
        this._myDirection = this._myTargetPosition.vec3_sub(this._myStartPosition);

        this._myCallbackOnPatienceOver = callbackOnPatienceOver;
        this._myCallbackOnReach = callbackOnReach;

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Mr NOT Clone");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(0.05, "end"));
        this._myFSM.addState("move", this._move.bind(this));
        this._myFSM.addState("stop", this._stopUpdate.bind(this));
        this._myFSM.addState("disappear", this._disappear.bind(this));
        this._myFSM.addState("inactive");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareMove.bind(this));
        this._myFSM.addTransition("first_wait", "move", "end", this._startMove.bind(this));
        this._myFSM.addTransition("move", "disappear", "disappear", this._prepareDisappear.bind(this));
        this._myFSM.addTransition("move", "stop", "startStop");
        this._myFSM.addTransition("stop", "disappear", "disappear", this._prepareDisappear.bind(this));
        this._myFSM.addTransition("disappear", "inactive", "end");
        this._myFSM.addTransition("move", "inactive", "hide");
        this._myFSM.addTransition("disappear", "inactive", "hide");
        this._myFSM.addTransition("stop", "inactive", "hide");
        this._myFSM.addTransition("inactive", "first_wait", "start", this._prepareMove.bind(this));

        this._myFSM.init("init");

        this._myCollisions = this._myObject.pp_getComponentsHierarchy("collision");
        this._myPhysx = this._myObject.pp_getComponentHierarchy("physx");
        this._myCollisionsCollector = this._myObject.pp_getComponentHierarchy("physx-collector-component").getCollisionsCollector();

        this._myExplodeAudio = Global.myAudioPoolMap.getAudio(SfxID.MR_NOT_EXPLODE);
        this._myHitAudio = Global.myAudioPoolMap.getAudio(SfxID.CLONE_EXPLODE);
        this._myAppearAudio = Global.myAudioPoolMap.getAudio(SfxID.MR_NOT_FAST_APPEAR);

        this._myRumbleScreen = new RumbleScreen();

        //Setup
        this._myReachTargetDistance = 5;
        this._myMinTargetDistance = 10;
        this._myMinParticleDistance = this._myScale[0] * 0.55;
        this._myParticlesSize = 6.5;
        this._myParticlesSizeMrNot = 0.9;
        this._myMaxPatience = 1;
        this._myPatienceRefill = 0;

        this._myReachTargetDistance = this._myMrNOTSetup.myReachTargetDistance;

        let directionAngle = this._myDirection.vec3_angle(this._myDirection.vec3_removeComponentAlongAxis([0, 1, 0]));
        let distanceToIgnore = this._myReachTargetDistance / Math.cos(Math.pp_toRadians(directionAngle));

        this._mySpeed = (this._myTargetPosition.vec3_sub(this._myStartPosition).vec3_length() - distanceToIgnore) / this._myMrNOTSetup.myTimeToReachTarget;
        this._myMaxPatience = this._myMrNOTSetup.myMaxPatience;

        this._myFSM.perform("start");
    }

    update(dt) {
        this._myCollisionsCollector.update(dt);

        this._myFSM.update(dt);

        this._myRumbleScreen.update(dt);
    }

    isDone() {
        return this._myFSM.isInState("inactive");
    }

    hide() {
        this._myRumbleScreen.stop();
        this._myObject.pp_setActive(false);
        this._myFSM.perform("hide");

        Global.myAudioPoolMap.releaseAudio(SfxID.MR_NOT_EXPLODE, this._myExplodeAudio);
        Global.myAudioPoolMap.releaseAudio(SfxID.CLONE_EXPLODE, this._myHitAudio);
        Global.myAudioPoolMap.releaseAudio(SfxID.MR_NOT_FAST_APPEAR, this._myAppearAudio);
        this._myExplodeAudio = null;
        this._myHitAudio = null;
        this._myAppearAudio = null;
    }

    stop() {
        this._myFSM.perform("startStop");
    }

    _prepareMove() {
        PP.MeshUtils.setFogColor(this._myObject, [0, 0, 0, 0]);
        this._myObject.pp_setPosition(this._myStartPosition);
        this._myObject.pp_setScale(this._myScale);
        this._myObject.pp_setRotation(this._myRotation);

        let angle = -this._myMrNOTSetup.myDirection.vec3_angleSigned([0, 0, -1], [0, 1, 0]);
        this._myObject.pp_rotateAroundAxis(angle, [0, 1, 0], [0, 0, 0]);
        this._myObject.pp_getPosition(this._myStartPosition);
        this._myDirection = this._myTargetPosition.vec3_sub(this._myStartPosition);

        for (let collision of this._myCollisions) {
            if (collision.collider == WL.Collider.Sphere) {
                collision.extents = [this._myScale[0] * 1.1, this._myScale[0] * 1.1, this._myScale[0] * 1.1];
            } else {
                collision.extents = [this._myScale[0], this._myScale[1], this._myScale[2] * 0.2];
            }
        }

        this._myPhysx.extents = [this._myScale[0] * 0.018, this._myScale[1] * 0.018, this._myScale[2] * 0.025];

        this._myCurrentPosition = [];
        this._myObject.pp_getPosition(this._myCurrentPosition);

        this._myPatience = this._myMaxPatience;

        this._myAppearAudio.setPosition(this._myObject.pp_getPosition());
        this._myAppearAudio.play();

        this._myRumbleScreen.stop();

        this._myRumbleScreen.start(0.3, 1.5);
        PP.myRightGamepad.pulse(0.6, 0.3);
        PP.myLeftGamepad.pulse(0.6, 0.3);

        this._myHitsReceived = 0;
    }

    _startMove() {
        this._myObject.pp_setActive(true);
    }

    _move(dt) {
        this._myTargetPosition.vec3_sub(this._myStartPosition, this._myDirection);
        this._myDirection.vec3_normalize(this._myDirection);
        this._myDirection.vec3_scale(this._mySpeed * dt, this._myDirection);
        this._myObject.pp_translateWorld(this._myDirection);

        this._myObject.pp_getPosition(this._myCurrentPosition);
        let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToTargetFromStart = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToCurrentFromStart = this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();

        if (distanceToTarget < this._myReachTargetDistance || distanceToTargetFromStart < distanceToCurrentFromStart) {
            //console.log("mr NOT Hits Received -", this._myHitsReceived);
            if (PP.myEasyTuneVariables.get("Prevent Vent Lost")) {
                this._checkHit(false, true);
            } else if (this._myCallbackOnReach) {
                this._myCallbackOnReach(this);
            }
        } else {
            this._checkHit();

            /*
            let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
            if (distanceToTarget < this._myMinTargetDistance) {
                this._myCallbackOnPatienceOver();
                this._myFSM.perform("explode");
            }
            */
        }
    }

    _stopUpdate() {
        this._checkHit(true);
    }

    _checkHit(avoidCallbacks = false, alwaysHit = false) {
        let hit = false;
        let hittingObjects = [];

        let useCollider = false;
        if (useCollider) {
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
                            if (evidenceComponent && evidenceComponent.getEvidence() && evidenceComponent.getEvidence().canHit()) {
                                hit = true;
                                hittingObjects.push(collidingComponent.object);
                            }
                        }
                    }
                }
            }
        }

        let usePhysx = true;
        if (usePhysx) {
            let collisionsStart = this._myCollisionsCollector.getCollisionsStart();
            if (collisionsStart.length > 0) {
                for (let collision of collisionsStart) {
                    let evidenceComponent = collision.pp_getComponent("evidence-component");
                    if (evidenceComponent && evidenceComponent.getEvidence() && evidenceComponent.getEvidence().canHit()) {
                        hit = true;
                        hittingObjects.push(collision);
                    }
                }
            }
        }

        if (hit || alwaysHit) {
            let patienceToRemove = 0;
            for (let object of hittingObjects) {
                this._myHitAudio.setPosition(object.pp_getPosition());
                this._myHitAudio.setPitch(Math.pp_random(0.85, 1.05));
                this._myHitAudio.play();

                let evidence = object.pp_getComponent("evidence-component");
                evidence.bigHit(this._myObject);

                patienceToRemove++;
            }


            this._myHitsReceived += patienceToRemove;

            if (!avoidCallbacks) {
                this._myPatience -= patienceToRemove;

                let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();

                if (distanceToTarget > this._myMinTargetDistance) {
                    this._myPatience = Math.max(this._myPatience, this._myPatienceRefill);
                }

                if (this._myPatience <= 0 || alwaysHit) {
                    Global.myStatistics.myMrNOTDismissed += 1;
                    this._myFSM.perform("disappear");
                    this._myCallbackOnPatienceOver();
                }
            }
        }
    }

    disappear() {
        this._myFSM.perform("disappear");
    }

    _prepareDisappear() {
        this._myDisappearTimer = new PP.Timer(0);
        this._myDisappearEndTimer = new PP.Timer(0.7, false);
        this._myObject.pp_getPosition(this._myCurrentPosition);
    }

    _disappear(dt) {
        if (this._myDisappearTimer.isRunning()) {
            this._myDisappearTimer.update(dt);
            if (this._myDisappearTimer.isDone()) {
                this._myObject.pp_setActive(false);
                Global.myParticlesManager.explosion(this._myCurrentPosition, 1.6, [this._myParticlesSizeMrNot, this._myParticlesSizeMrNot, this._myParticlesSizeMrNot], GameObjectType.MR_NOT, true);
                this._myDisappearEndTimer.start();

                this._myMrNotUp = this._myObject.pp_getUp();
                this._myMrNotForward = this._myObject.pp_getForward();
                let audioPosition = this._myMrNotForward.vec3_scale(this._myScale[2] * 0.675).vec3_add(this._myCurrentPosition);
                //this._myMrNotUp.vec3_scale(1.35).vec3_add(audioPosition, audioPosition);
                this._myExplodeAudio.setPosition(audioPosition);
                this._myExplodeAudio.setPitch(1);
                this._myExplodeAudio.play();

                this._myRumbleScreen.start(Math.pp_random(0.4, 0.6), 1);
                PP.myRightGamepad.pulse(0.6, 0.5);
                PP.myLeftGamepad.pulse(0.6, 0.5);
            }
        }

        if (this._myDisappearEndTimer.isRunning()) {
            this._myDisappearEndTimer.update(dt);
            if (this._myDisappearEndTimer.isDone()) {
                this._myObject.pp_setActive(false);
                this._myRumbleScreen.stop();
                this._myFSM.perform("end");

                Global.myAudioPoolMap.releaseAudio(SfxID.MR_NOT_EXPLODE, this._myExplodeAudio);
                Global.myAudioPoolMap.releaseAudio(SfxID.CLONE_EXPLODE, this._myHitAudio);
                Global.myAudioPoolMap.releaseAudio(SfxID.MR_NOT_FAST_APPEAR, this._myAppearAudio);
                this._myExplodeAudio = null;
                this._myHitAudio = null;
                this._myAppearAudio = null;
            }
        }
    }
}