PP.PhysXCollisionCollector = class PhysXCollisionCollector {
    constructor(physxComponent, isTrigger = false) {
        this._myPhysx = physxComponent;

        this._myIsTrigger = isTrigger;

        this._myCollisions = [];

        this._myCollisionsStart = [];
        this._myCollisionsEnd = [];
        this._myUpdateActive = false;
        this._myCollisionsStartToProcess = [];
        this._myCollisionsEndToProcess = [];

        this._myCollisionCallbackID = null;

        this._myIsActive = false;
        this.setActive(true);

        this._myDebugActive = false;

        this._myTriggerDesyncFixDelay = new PP.Timer(0.1);
    }

    getPhysX() {
        return this._myPhysx;
    }

    getCollisions() {
        return this._myCollisions.pp_clone();
    }

    getCollisionsStart() {
        return this._myCollisionsStart.pp_clone();
    }

    getCollisionsEnd() {
        return this._myCollisionsEnd.pp_clone();
    }

    setActive(active) {
        if (this._myIsActive != active) {
            this._myIsActive = active;

            this._myCollisions = [];

            this._myCollisionsStart = [];
            this._myCollisionsEnd = [];
            this._myUpdateActive = false;
            this._myCollisionsStartToProcess = [];
            this._myCollisionsEndToProcess = [];

            if (this._myIsActive) {
                this._myCollisionCallbackID = this._myPhysx.onCollision(this._onCollision.bind(this));
            } else if (this._myCollisionCallbackID != null) {
                this._myPhysx.removeCollisionCallback(this._myCollisionCallbackID);
                this._myCollisionCallbackID = null;
            }
        }
    }

    //Set to true only if u are going to actually update this object and don't want to lose any collision start/end events prior to updating the first time after activation
    setUpdateActive(active) {
        this._myUpdateActive = active;
    }

    //Update is not mandatory, use it only if u want to access collisions start and end
    update(dt) {
        if (!this._myIsActive) {
            return;
        }

        this._myUpdateActive = true;

        this._myCollisionsStart = this._myCollisionsStartToProcess;
        this._myCollisionsStartToProcess = [];

        this._myCollisionsEnd = this._myCollisionsEndToProcess;
        this._myCollisionsEndToProcess = [];

        if (this._myIsTrigger) {
            this._triggerDesyncFix(dt);
        }
    }

    destroy() {
        if (this._myCollisionCallbackID != null) {
            this._myPhysx.removeCollisionCallback(this._myCollisionCallbackID);
            this._myCollisionCallbackID = null;
        }
    }

    setDebugActive(active) {
        this._myDebugActive = active;
    }

    _onCollision(type, physxComponent) {
        if (type == WL.CollisionEventType.Touch || type == WL.CollisionEventType.TriggerTouch) {
            this._onCollisionStart(physxComponent);
        } else if (type == WL.CollisionEventType.TouchLost || type == WL.CollisionEventType.TriggerTouchLost) {
            this._onCollisionEnd(physxComponent);
        }
    }

    _onCollisionStart(physxComponent) {
        if (this._myDebugActive) {
            let objectFound = false;
            for (let object of this._myCollisions) {
                if (object.pp_equals(physxComponent.object)) {
                    objectFound = true;
                    break;
                }
            }

            if (objectFound) {
                console.error("Collision Start on object already collected");
            }
        }

        this._myCollisions.push(physxComponent.object);

        if (this._myUpdateActive) {
            this._myCollisionsStartToProcess.push(physxComponent.object);
            this._myCollisionsEndToProcess.pp_removeAll(function (element) {
                return element.pp_equals(physxComponent.object);
            });
        }

        if (this._myDebugActive) {
            console.log("Collision Start -", this._myCollisions.length);
        }
    }

    _onCollisionEnd(physxComponent) {
        if (this._myDebugActive) {
            let objectFound = false;
            for (let object of this._myCollisions) {
                if (object.pp_equals(physxComponent.object)) {
                    objectFound = true;
                    break;
                }
            }

            if (!objectFound) {
                console.error("Collision End on object not collected");
            }
        }


        this._myCollisions.pp_removeAll(function (element) {
            return element.pp_equals(physxComponent.object);
        });

        if (this._myUpdateActive) {
            this._myCollisionsEndToProcess.push(physxComponent.object);
            this._myCollisionsStartToProcess.pp_removeAll(function (element) {
                return element.pp_equals(physxComponent.object);
            });
        }

        if (this._myDebugActive) {
            console.log("Collision End -", this._myCollisions.length);
        }
    }

    _triggerDesyncFix(dt) {
        this._myTriggerDesyncFixDelay.update(dt);
        if (this._myTriggerDesyncFixDelay.isDone()) {
            this._myTriggerDesyncFixDelay.start();

            let collisionsToEnd = this._myCollisions.pp_findAll(function (element) {
                let physx = element.pp_getComponent("physx");
                return physx == null || !physx.active;
            });

            if (collisionsToEnd.length > 0) {
                //console.error("DESYNC RESOLVED");

                for (let collision of collisionsToEnd) {
                    let physx = collision.pp_getComponent("physx");
                    if (physx) {
                        this._onCollisionEnd(physx);
                    } else {
                        console.error("NO PHYSX, HOW?");
                    }
                }
            }
        }
    }
};