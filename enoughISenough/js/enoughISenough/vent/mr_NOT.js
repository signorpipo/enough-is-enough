class MrNOT {
    constructor(callbackOnPatienceOver, callbackOnReach, callbackOnExplosionDone) {
        this._myObject = Global.myGameObjects.get(GameObjectType.MR_NOT);

        this._myStartPosition = [0, 11, -18];
        this._myRotation = [40, 0, 0];
        this._myScale = [5, 5, 5];

        this._myTargetPosition = [0, 0, 0];
        this._myDirection = this._myTargetPosition.vec3_sub(this._myStartPosition);

        this._myTimeToReachTarget = 10;

        this._myCallbackOnPatienceOver = callbackOnPatienceOver;
        this._myCallbackOnReach = callbackOnReach;
        this._myCallbackOnExplosionDone = callbackOnExplosionDone;

        this._mySpeed = this._myTargetPosition.vec3_sub(this._myStartPosition).vec3_length() / 20;

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Mr NOT Clone");
        this._myFSM.addState("init");
        this._myFSM.addState("move", this._move.bind(this));
        this._myFSM.addState("explode", this._exploding.bind(this));
        this._myFSM.addState("disappear", this._disappear.bind(this));
        this._myFSM.addState("inactive");

        this._myFSM.addTransition("init", "move", "start", this._prepareMove.bind(this));
        this._myFSM.addTransition("move", "explode", "explode", this._prepareExplode.bind(this));
        this._myFSM.addTransition("explode", "disappear", "end", this._prepareDisappear.bind(this));
        this._myFSM.addTransition("disappear", "inactive", "end");
        this._myFSM.addTransition("move", "inactive", "hide");
        this._myFSM.addTransition("explode", "inactive", "hide");
        this._myFSM.addTransition("disappear", "inactive", "hide");
        this._myFSM.addTransition("inactive", "move", "start", this._prepareMove.bind(this));

        this._myFSM.init("init");

        this._myCollisions = this._myObject.pp_getComponentsHierarchy("collision");

        this._myExplodeAudio = Global.myAudioManager.createAudioPlayer(SfxID.BLABLA_2);

        //Setup
        this._myReachTargetDistance = 4;
        this._myMinTargetDistance = 15;
        this._myMinParticleDistance = this._myScale[0] * 0.75;
        this._myParticlesSize = 6.5;
        this._myParticlesSizeMrNot = 0.9;
        this._myMaxPatience = 1;
        this._myPatienceRefill = 1;

    }

    start(dt) {
        this._myFSM.perform("start");
    }

    update(dt) {
        if (Global.myDebugShortcutsEnabled) {
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myCallbackOnPatienceOver();
                this._myFSM.perform("explode");
            }
        }

        this._myFSM.update(dt);
    }

    isDone() {
        return this._myFSM.isInState("inactive");
    }

    hide() {
        this._myObject.pp_setActive(false);
        this._myFSM.perform("hide");
    }

    _prepareMove() {
        PP.MeshUtils.setAlpha(this._myObject, 1);
        this._myObject.pp_setPosition(this._myStartPosition);
        this._myObject.pp_setScale(this._myScale);
        this._myObject.pp_setRotation(this._myRotation);

        for (let collision of this._myCollisions) {
            if (collision.collider == WL.Collider.Sphere) {
                collision.extents = [this._myScale[0] * 1.1, this._myScale[0] * 1.1, this._myScale[0] * 1.1];
            } else {
                collision.extents = [this._myScale[0], this._myScale[1], this._myScale[2] * 0.2];
            }
        }

        this._myCurrentPosition = [];
        this._myObject.pp_getPosition(this._myCurrentPosition);

        this._myPatience = this._myMaxPatience;

        this._myObject.pp_setActive(true);
    }

    _move(dt) {
        this._myDirection.vec3_normalize(this._myDirection);
        this._myDirection.vec3_scale(this._mySpeed * dt, this._myDirection);
        this._myObject.pp_translateWorld(this._myDirection);

        this._myObject.pp_getPosition(this._myCurrentPosition);
        let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToTargetFromStart = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
        let distanceToCurrentFromStart = this._myStartPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();

        if (distanceToTarget < this._myReachTargetDistance || distanceToTargetFromStart < distanceToCurrentFromStart) {
            if (this._myCallbackOnReach) {
                this._myCallbackOnReach(this);
            }
        } else {
            this._checkHit();
        }
    }

    _checkHit(avoidCallbacks = false) {
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

            if (!avoidCallbacks) {
                let hittingPosition = hittingObject.pp_getPosition();
                //Global.myParticlesManager.explosion(hittingPosition, [this._myParticlesSize, this._myParticlesSize, this._myParticlesSize], evidence.getEvidence().getEvidenceSetup().myObjectType);
                //spawn particles

                this._myPatience -= 1;
                if (this._myPatience <= 0) {
                    let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
                    if (distanceToTarget > this._myMinTargetDistance || false) {
                        this._myPatience = this._myPatienceRefill;
                    } else {
                        this._myCallbackOnPatienceOver();
                        this._myFSM.perform("explode");
                    }
                }
            }
        }
    }

    _prepareExplode() {
        this._mySpawnDelays = [2.5, 2.3, 2.0, 1.5, 1.0, 0.7, 0.6, 0.5, 0.4, 0.3];
        this._myExplodeTimer = new PP.Timer(20);
        this._mySpawnParticlesTimer = new PP.Timer(this._mySpawnDelays[0]);

        this._myMrNotUp = this._myObject.pp_getUp();
        this._myMrNotRight = this._myObject.pp_getRight();
        this._myMrNotForward = this._myObject.pp_getForward();

        this._myObject.pp_getPosition(this._myCurrentPosition);
        this._myParticlesPosition = null;
        this._myParticlesPosition = this._getNextParticlePosition();

        this._myPossibleGameObjectTypes = [
            //GameObjectType.TRIAL_TIMER,
            //GameObjectType.ZESTY_MARKET,
            GameObjectType.TUCIA_DRAWING,
            GameObjectType.CPLUSPLUS_PRIMER,
            GameObjectType.PIANO,
            GameObjectType.MICCO_THE_BEAR,
            GameObjectType.WATER_LILY,
            GameObjectType.LOL,
            GameObjectType.DRINK_ME_EARRING,
            //GameObjectType.STARING_CUBE,
        ];
    }

    _exploding(dt) {
        this._checkHit(true);

        this._myExplodeTimer.update(dt);
        if (this._myExplodeTimer.isDone()) {
            this._myFSM.perform("end");
        }

        this._mySpawnParticlesTimer.update(dt);
        if (this._mySpawnParticlesTimer.isDone()) {
            let delay = this._mySpawnDelays[0];
            if (this._mySpawnDelays.length > 1) {
                this._mySpawnDelays.shift();
            }
            this._mySpawnParticlesTimer.start(delay);
            let type = Math.pp_randomPick(this._myPossibleGameObjectTypes);
            Global.myParticlesManager.explosion(this._myParticlesPosition, 1.25, [this._myParticlesSize, this._myParticlesSize, this._myParticlesSize], type, true);

            this._addPulse(this._myParticlesPosition, this._mySpawnDelays.length <= 1);

            this._myParticlesPosition = this._getNextParticlePosition();
            this._myExplodeAudio.play();
        }
    }

    _addPulse(position, justRandom) {
        let gamepad = PP.myLeftGamepad;
        if (position.vec3_isConcordant([1, 0, 0])) {
            gamepad = PP.myRightGamepad;
        }

        if (justRandom) {
            gamepad = (Math.pp_random() < 0.5) ? PP.myLeftGamepad : PP.myRightGamepad;
        }

        gamepad.pulse(Math.pp_random(0.4, 0.8), Math.pp_random(0.4, 0.6));
    }

    _prepareDisappear() {
        this._myDisappearTimer = new PP.Timer(3);
        this._myDisappearEndTimer = new PP.Timer(3, false);
    }

    _disappear(dt) {
        if (this._myDisappearTimer.isRunning()) {
            this._myDisappearTimer.update(dt);
            if (this._myDisappearTimer.isDone()) {
                this._myObject.pp_setActive(false);
                Global.myParticlesManager.explosion(this._myCurrentPosition, 1.6, [this._myParticlesSizeMrNot, this._myParticlesSizeMrNot, this._myParticlesSizeMrNot], GameObjectType.MR_NOT, true);
                this._myDisappearEndTimer.start();
                this._myExplodeAudio.play();

                PP.myRightGamepad.pulse(0.6, 0.5);
                PP.myLeftGamepad.pulse(0.6, 0.5);
            }
        }

        if (this._myDisappearEndTimer.isRunning()) {
            this._myDisappearEndTimer.update(dt);
            if (this._myDisappearEndTimer.isDone()) {
                this._myObject.pp_setActive(false);
                this._myFSM.perform("end");
            }
        }
    }

    _getNextParticlePosition() {
        let attempts = 100;
        let distance = 0;

        let position = [0, 0, 0];

        while (attempts > 0) {
            let randomX = Math.pp_random(0, this._myScale[0] * 0.8) * Math.pp_randomSign();
            let randomY = Math.pp_random(0, this._myScale[1] * 0.8) * Math.pp_randomSign();
            let randomZ = Math.pp_random(this._myScale[2] * 0.65, this._myScale[2] * 0.7);

            this._myMrNotUp.vec3_scale(randomY, position);
            this._myMrNotRight.vec3_scale(randomX).vec3_add(position, position);
            if (position.vec3_length() > this._myScale[0] * 0.8) {
                position.vec3_normalize(position).vec3_scale(Math.pp_random(this._myScale[0] * 0.75, this._myScale[0] * 0.8));
            }
            this._myMrNotForward.vec3_scale(randomZ).vec3_add(position, position);

            this._myMrNotUp.vec3_scale(Math.pp_random(0.75, 1)).vec3_add(position, position);
            console.error(this._myScale[1].toFixed());
            this._myCurrentPosition.vec3_add(position, position);

            if (this._myParticlesPosition == null) {
                attempts = 0;
            } else {
                let relativeParticlePosition = this._myParticlesPosition.vec3_sub(this._myCurrentPosition);
                let relativeNewPosition = position.vec3_sub(this._myCurrentPosition);
                distance = position.vec3_distance(this._myParticlesPosition);
                if (distance > this._myMinParticleDistance &&
                    relativeNewPosition.vec3_isConcordant([1, 0, 0]) != relativeParticlePosition.vec3_isConcordant([1, 0, 0])) {
                    attempts = 0;
                } else {
                    attempts -= 1;
                    if (attempts == 0) {
                        console.error("attempts");
                    }
                }
            }
        }

        return position;
    }
}