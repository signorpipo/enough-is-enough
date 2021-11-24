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
        this._myFSM.addTransition("move", "explode", "explode");
        this._myFSM.addTransition("explode", "disappear", "end");
        this._myFSM.addTransition("move", "inactive", "hide");
        this._myFSM.addTransition("explode", "inactive", "hide");
        this._myFSM.addTransition("disappear", "inactive", "hide");
        this._myFSM.addTransition("inactive", "move", "start", this._prepareMove.bind(this));

        this._myFSM.init("init");

        this._myCollisions = this._myObject.pp_getComponentsHierarchy("collision");

        //Setup
        this._myReachTargetDistance = 4;
        this._myMinTargetDistance = 10;
    }

    start(dt) {
        this._myFSM.perform("start");
    }

    update(dt) {
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

        this._myPatience = 20;

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

            //spawn particles

            this._myPatience -= 0;
            if (this._myPatience < 0) {
                let distanceToTarget = this._myTargetPosition.vec3_removeComponentAlongAxis([0, 1, 0]).vec3_sub(this._myCurrentPosition.vec3_removeComponentAlongAxis([0, 1, 0])).vec3_length();
                if (distanceToTarget > this._myMinTargetDistance) {
                    this._myPatience = 5;
                } else {
                    this._myCallbackOnPatienceOver();
                }
            }
        }
    }

    _exploding(dt) {
    }

    _disappear(dt) {
    }
}