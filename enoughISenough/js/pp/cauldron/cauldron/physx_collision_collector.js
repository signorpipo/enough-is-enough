PP.PhysXCollisionCollector = class PhysXCollisionCollector {
    constructor(physxComponent) {
        this._myPhysx = physxComponent;

        this._myPhysx.onCollision(this._onCollision.bind(this));

        this._myCollisions = [];

        this._myDebugActive = false;
    }

    getCollisions() {
        return this._myCollisions.pp_clone();
    }

    reset() {
        this._myCollisions = [];
    }

    setDebugActive(active) {
        this._myDebugActive = active;
    }

    _onCollision(type, physxComponent) {
        if (type == WL.CollisionEventType.Touch) {
            this._onCollisionStart(physxComponent);
        } else if (type == WL.CollisionEventType.TouchLost) {
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

        if (this._myDebugActive) {
            console.log("Collision End -", this._myCollisions.length);
        }
    }
};