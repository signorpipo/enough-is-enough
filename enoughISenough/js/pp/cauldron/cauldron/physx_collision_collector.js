PP.PhysXCollisionCollector = class PhysXCollisionCollector {
    constructor(physxComponent) {
        this._myPhysx = physxComponent;

        this._myPhysx.onCollision(this._onCollision.bind(this));

        this._myCollisions = [];

        this._myCollisionsStart = [];
        this._myCollisionsEnd = [];
        this._myUpdateActive = false;
        this._myCollisionsStartToProcess = [];
        this._myCollisionsEndToProcess = [];

        this._myDebugActive = false;

        this._myTriggerDesyncFixDelay = new PP.Timer(0.1);
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

    setDebugActive(active) {
        this._myDebugActive = active;
    }

    //Update is not mandatory, use it only if u want to access collisions start and end
    update(dt) {
        this._myUpdateActive = true;

        this._myCollisionsStart = this._myCollisionsStartToProcess;
        this._myCollisionsStartToProcess = [];

        this._myCollisionsEnd = this._myCollisionsEndToProcess;
        this._myCollisionsEndToProcess = [];

        this._triggerDesyncFix(dt);
    }

    _onCollision(type, physxComponent) {
        if (type == WL.CollisionEventType.Touch) {
            this._onCollisionStart(physxComponent);
        } else if (type == WL.CollisionEventType.TouchLost) {
            this._onCollisionEnd(physxComponent);
        } else {
            this._onTrigger(physxComponent);
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

    _onTrigger(physxComponent) {
        let hasCollision = null != this._myCollisions.pp_find(function (element) {
            return element.pp_equals(physxComponent.object);
        });

        if (!hasCollision) {
            this._onCollisionStart(physxComponent);
        } else {
            this._onCollisionEnd(physxComponent);
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
                console.error("DESYNC RESOLVED");

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