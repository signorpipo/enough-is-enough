class MrNOT {
    constructor(callbackOnPatienceOver, callbackOnReach, callbackOnExplosionDone) {
        this._myObject = Global.myGameObjects.get(GameObjectType.MR_NOT);

        this._myStartPosition = [0, 11, -18];
        this._myRotation = [40, 0, 0];
        this._myScale = [5, 5, 5];

        this._myTargetPosition = [0, 0, 0];
        this._myDirection = this._myTargetPosition.vec3_sub(this._myStartPosition);

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Time To Reach Target", 30, 10, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Max Patience", 15, 10));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Reach Distance", 5, 10, 3));

        this._myTimeToReachTarget = 20;

        this._myCallbackOnPatienceOver = callbackOnPatienceOver;
        this._myCallbackOnReach = callbackOnReach;
        this._myCallbackOnExplosionDone = callbackOnExplosionDone;

        this._mySpeed = this._myTargetPosition.vec3_sub(this._myStartPosition).vec3_length() / this._myTimeToReachTarget;

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Mr NOT Clone");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(0.1, "end"));
        this._myFSM.addState("move", this._move.bind(this));
        this._myFSM.addState("explode", this._exploding.bind(this));
        this._myFSM.addState("disappear", this._disappear.bind(this));
        this._myFSM.addState("inactive");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareMove.bind(this));
        this._myFSM.addTransition("first_wait", "move", "end", this._startMove.bind(this));
        this._myFSM.addTransition("move", "explode", "explode", this._prepareExplode.bind(this));
        this._myFSM.addTransition("explode", "disappear", "end", this._prepareDisappear.bind(this));
        this._myFSM.addTransition("disappear", "inactive", "end");
        this._myFSM.addTransition("move", "inactive", "hide");
        this._myFSM.addTransition("explode", "inactive", "hide");
        this._myFSM.addTransition("disappear", "inactive", "hide");
        this._myFSM.addTransition("inactive", "first_wait", "start", this._prepareMove.bind(this));

        this._myFSM.init("init");

        this._myCollisions = this._myObject.pp_getComponentsHierarchy("collision");

        this._myExplodeAudio = Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_EXPLODE_EXPLODE);
        this._myHitAudio = Global.myAudioManager.createAudioPlayer(SfxID.CLONE_EXPLODE);
        this._myAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_FAST_APPEAR);

        this._myRumbleScreen = new RumbleScreen();

        //Setup
        this._myReachTargetDistance = 5;
        this._myMinTargetDistance = 10;
        this._myMinParticleDistance = this._myScale[0] * 0.55;
        this._myParticlesSize = 6.5;
        this._myParticlesSizeMrNot = 0.9;
        this._myMaxPatience = 1;
        this._myPatienceRefill = 5;
    }

    start(dt) {
        this._mySpeed = this._myTargetPosition.vec3_sub(this._myStartPosition).vec3_length() / PP.myEasyTuneVariables.get("Time To Reach Target");
        this._myReachTargetDistance = PP.myEasyTuneVariables.get("Reach Distance");
        this._myMaxPatience = PP.myEasyTuneVariables.get("Max Patience");

        this._myFSM.perform("start");
    }

    update(dt) {
        if (Global.myDebugShortcutsEnabled) {
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                //this._myCallbackOnPatienceOver();
                //this._myFSM.perform("explode");
            }
        }

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
    }

    _prepareMove() {
        PP.MeshUtils.setFogColor(this._myObject, [0, 0, 0, 0]);
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

        this._myAppearAudio.setPosition(this._myObject.pp_getPosition());
        this._myAppearAudio.play();
    }

    _startMove() {
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

            /*
            let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
            if (distanceToTarget < this._myMinTargetDistance) {
                this._myCallbackOnPatienceOver();
                this._myFSM.perform("explode");
            }
            */
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
            this._myHitAudio.setPosition(hittingObject.pp_getPosition());
            this._myHitAudio.setPitch(Math.pp_random(0.85, 1.05));
            this._myHitAudio.play();

            let evidence = hittingObject.pp_getComponent("evidence-component");
            evidence.hit(this._myObject);

            if (!avoidCallbacks) {
                let hittingPosition = hittingObject.pp_getPosition();
                //Global.myParticlesManager.explosion(hittingPosition, [this._myParticlesSize, this._myParticlesSize, this._myParticlesSize], evidence.getEvidence().getEvidenceSetup().myObjectType);
                //spawn particles

                this._myPatience -= 1;

                let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();

                if (distanceToTarget > this._myMinTargetDistance) {
                    this._myPatience = Math.max(this._myPatience, this._myPatienceRefill);
                }

                if (this._myPatience <= 0) {
                    this._myCallbackOnPatienceOver();
                    this._myFSM.perform("explode");
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
            GameObjectType.WONDERMELON,
            GameObjectType.SHATTERED_COIN,
            GameObjectType.PSI,
            GameObjectType.WONDERLAND,
            GameObjectType.ANT_MAIN_CHARACTER,
            GameObjectType.HEART,
            GameObjectType.HALO_SWORD,
            GameObjectType.FOX,
            GameObjectType.PICO_8,
            GameObjectType.EGGPLANT,
            GameObjectType.VR,
            GameObjectType.TROPHY,
            GameObjectType.FAMILY,
            GameObjectType.MIRROR,
            GameObjectType.WAYFINDER,
            GameObjectType.ETHEREUM,
            GameObjectType.EVERYEYE,
            GameObjectType.ALOE_VERA,
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

            this._myExplodeAudio.setPosition(this._myParticlesPosition.pp_clone());
            this._myExplodeAudio.setPitch(Math.pp_random(0.85, 1.05));
            this._myExplodeAudio.play();

            this._myParticlesPosition = this._getNextParticlePosition();

            this._myRumbleScreen.start(Math.pp_random(0.4, 0.6), 1);
        }
    }

    _addPulse(position, justRandom) {
        let gamepad = PP.myLeftGamepad;
        if (position.vec3_isConcordant([1, 0, 0])) {
            gamepad = PP.myRightGamepad;
        }

        if (justRandom) {
            gamepad = (Math.pp_random() < 0.5) ? PP.myLeftGamepad : PP.myRightGamepad;
            if (gamepad == PP.myLeftGamepad && !PP.myRightGamepad.isPulsing()) {
                gamepad = PP.myRightGamepad;
            } else if (gamepad == PP.myRightGamepad && !PP.myLeftGamepad.isPulsing()) {
                gamepad = PP.myLeftGamepad;
            }
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
            }
        }
    }

    _getNextParticlePosition() {
        let attempts = 100;
        let distance = 0;

        let position = [0, 0, 0];

        while (attempts > 0) {
            let randomX = Math.pp_random(0, this._myScale[0] * 0.6) * Math.pp_randomSign();
            let randomY = Math.pp_random(0, this._myScale[1] * 0.6) * Math.pp_randomSign();
            let randomZ = Math.pp_random(this._myScale[2] * 0.65, this._myScale[2] * 0.7);

            this._myMrNotUp.vec3_scale(randomY, position);
            this._myMrNotRight.vec3_scale(randomX).vec3_add(position, position);
            if (position.vec3_length() > this._myScale[0] * 0.65) {
                position.vec3_normalize(position).vec3_scale(Math.pp_random(this._myScale[0] * 0.6, this._myScale[0] * 0.65));
            }
            this._myMrNotForward.vec3_scale(randomZ).vec3_add(position, position);

            this._myMrNotUp.vec3_scale(Math.pp_random(1.25, 1.5)).vec3_add(position, position);
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
                }
            }
        }

        return position;
    }
}

class RumbleScreen {
    constructor() {
        this._myTimer = new PP.Timer(0, false);
    }

    start(duration, intensity) {
        this._myTimer.start(duration);
        this._myIntensity = intensity;
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            let rumbleValue = 0.04 * this._myIntensity;
            Global.myPlayerRumbleObject.pp_setPositionLocal([Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue)]);

            if (this._myTimer.isDone()) {
                this.stop();
            }
        }
    }

    stop() {
        Global.myPlayerRumbleObject.pp_resetPositionLocal();
    }
}