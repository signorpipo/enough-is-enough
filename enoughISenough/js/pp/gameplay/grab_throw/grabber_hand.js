WL.registerComponent('pp-grabber-hand', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myGrabButton: { type: WL.Type.Enum, values: ['select', 'squeeze', 'both'], default: 'squeeze' },
    _mySnapOnPivot: { type: WL.Type.Bool, default: false },
    _myGrabMultipleObjects: { type: WL.Type.Bool, default: false },
    _myThrowLinearVelocityMultiplier: { type: WL.Type.Float, default: 1 }, // multiply the overall throw speed, so slow throws will be multiplied too
    _myThrowMaxLinearSpeed: { type: WL.Type.Float, default: 15 },
    _myThrowAngularVelocityMultiplier: { type: WL.Type.Float, default: 0.5 },
    _myThrowMaxAngularSpeed: { type: WL.Type.Float, default: 1080 }, // degrees
    _myThrowVelocitySource: { type: WL.Type.Enum, values: ['hand', 'grabbable'], default: 'hand' },
    _myThrowLinearVelocityBoost: { type: WL.Type.Float, default: 1.75 },   // this boost is applied from 0% to 100% based on how fast you throw, so slow throws are not affected
    _myThrowLinearVelocityBoostMinSpeedThreshold: { type: WL.Type.Float, default: 0.6 },   // 0% boost is applied if plain throw speed is under this value
    _myThrowLinearVelocityBoostMaxSpeedThreshold: { type: WL.Type.Float, default: 2.5 },   // 100% boost is applied if plain throw speed is over this value
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness));

        this._myGrabbables = [];

        this._myGamepad = null;

        this._myLinearVelocityHistorySize = 5;
        this._myLinearVelocityHistorySpeedAverageSamplesFromStart = 1;
        this._myLinearVelocityHistoryDirectionAverageSamplesFromStart = 3;
        this._myLinearVelocityHistoryDirectionAverageSkipFromStart = 0;

        this._myHandLinearVelocityHistory = new Array(this._myLinearVelocityHistorySize);
        this._myHandLinearVelocityHistory.fill([0, 0, 0]);

        this._myAngularVelocityHistorySize = 1;
        this._myHandAngularVelocityHistory = new Array(this._myAngularVelocityHistorySize);
        this._myHandAngularVelocityHistory.fill([0, 0, 0]);

        this._myThrowMaxAngularSpeedRadians = Math.pp_toRadians(this._myThrowMaxAngularSpeed);

        this._myGrabCallbacks = new Map();
        this._myThrowCallbacks = new Map();

        this._myDebugActive = false;
    },
    start: function () {
        if (this._myHandedness == PP.HandednessIndex.LEFT) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        this._myCollision = this.object.pp_getComponent('collision');
        this._myPhysx = this.object.pp_getComponent('physx');
        this._myCollisionsCollector = new PP.PhysXCollisionCollector(this._myPhysx, true);

        this._myHandPose.start();

        if (this._myDebugActive) {
            this._myDebugLines = [];
            for (let i = 0; i < this._myLinearVelocityHistorySize; i++) {
                let line = new PP.DebugLine();
                line.setVisible(false);
                this._myDebugLines.push(line);
            }
        }
    },
    update: function (dt) {
        this._myCollisionsCollector.update(dt);
        this._myHandPose.update(dt);

        if (this._myGrabbables.length > 0) {
            this._updateLinearVelocityHistory();
            this._updateAngularVelocityHistory();
        }
    },
    grab: function () {
        this._grab();
    },
    throw: function () {
        this._throw();
    },
    registerGrabEventListener(id, callback) {
        this._myGrabCallbacks.set(id, callback);
    },
    unregisterGrabEventListener(id) {
        this._myGrabCallbacks.delete(id);
    },
    registerThrowEventListener(id, callback) {
        this._myThrowCallbacks.set(id, callback);
    },
    unregisterThrowEventListener(id) {
        this._myThrowCallbacks.delete(id);
    },
    onActivate() {
        if (this._myGrabButton == 0) {
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this, this._grab.bind(this));
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this, this._throw.bind(this));
        } else if (this._myGrabButton == 1) {
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_START, this, this._grab.bind(this));
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_END, this, this._throw.bind(this));
        } else {
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_START, this, this._grab.bind(this));
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_END, this, this._throw.bind(this));

            this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this, this._grab.bind(this));
            this._myGamepad.registerButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this, this._throw.bind(this));
        }
    },
    onDeactivate() {
        if (this._myGrabButton == 0) {
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this);
        } else if (this._myGrabButton == 1) {
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_END, this);
        } else {
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SQUEEZE, PP.ButtonEvent.PRESS_END, this);

            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_START, this);
            this._myGamepad.unregisterButtonEventListener(PP.ButtonType.SELECT, PP.ButtonEvent.PRESS_END, this);
        }
    },
    _grab: function () {
        if (!this._myGrabMultipleObjects && this._myGrabbables.length > 0) {
            return;
        }

        let grabbablesToGrab = [];

        /*
        let collidingComps = this._myCollision.queryOverlaps();
        for (let i = 0; i < collidingComps.length; i++) {
            let grabbable = collidingComps[i].object.getComponent("pp-grabbable");
            if (grabbable && grabbable.active) {
                this._myGrabbable = grabbable;
                this._myGrabbable.grab(this.object);
                this._myGrabbable.registerReleaseEventListener(this, this._onRelease.bind(this));

                if (this._mySnapOnPivot) {
                    this._myGrabbable.object.resetTranslation();
                }

                this._myGrabCallbacks.forEach(function (value) { value(this, this._myGrabbable); }.bind(this));

                break;
            }
        }
        */

        let collisions = this._myCollisionsCollector.getCollisions();
        for (let i = 0; i < collisions.length; i++) {
            let grabbable = collisions[i].getComponent("pp-grabbable");
            if (grabbable && grabbable.active) {
                grabbablesToGrab.push(grabbable);
            }
        }

        for (let grabbableToGrab of grabbablesToGrab) {
            if (!this._isAlreadyGrabbed(grabbableToGrab)) {
                let grabbableData = new PP.GrabberHandGrabbableData(grabbableToGrab, this._myThrowVelocitySource == 1, this._myLinearVelocityHistorySize, this._myAngularVelocityHistorySize);
                this._myGrabbables.push(grabbableData);
                grabbableToGrab.grab(this.object);
                grabbableToGrab.registerReleaseEventListener(this, this._onRelease.bind(this));

                if (this._mySnapOnPivot) {
                    grabbableToGrab.object.resetTranslation();
                }

                this._myGrabCallbacks.forEach(function (value) { value(this, grabbableToGrab); }.bind(this));
            }

            if (!this._myGrabMultipleObjects && this._myGrabbables.length > 0) {
                break;
            }
        }
    },
    _throw: function () {
        if (this._myGrabbables.length > 0) {
            let linearVelocity = null;
            let angularVelocity = null;

            if (this._myThrowVelocitySource == 0) {
                linearVelocity = this._computeReleaseLinearVelocity(this._myHandLinearVelocityHistory);
                angularVelocity = this._computeReleaseAngularVelocity(this._myHandAngularVelocityHistory);
            }

            for (let grabbableData of this._myGrabbables) {
                let grabbable = grabbableData.getGrabbable();

                grabbable.unregisterReleaseEventListener(this);

                if (this._myThrowVelocitySource == 1) {
                    linearVelocity = this._computeReleaseLinearVelocity(grabbableData.getLinearVelocityHistory());
                    angularVelocity = this._computeReleaseAngularVelocity(grabbableData.getAngularVelocityHistory());
                }

                grabbable.throw(linearVelocity, angularVelocity);

                this._myThrowCallbacks.forEach(function (value) { value(this, grabbable, linearVelocity, angularVelocity); }.bind(this));
            }

            this._myGrabbables = [];
        }
    },
    _onRelease(grabbable) {
        grabbable.unregisterReleaseEventListener(this);
        this._myGrabbables.pp_remove(element => element.getGrabbable() == grabbable);
    },
    _updateLinearVelocityHistory() {
        this._myHandLinearVelocityHistory.unshift(this._myHandPose.getLinearVelocity());
        this._myHandLinearVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateLinearVelocityHistory();
        }
    },
    _updateAngularVelocityHistory() {
        this._myHandAngularVelocityHistory.unshift(this._myHandPose.getAngularVelocityRadians());
        this._myHandAngularVelocityHistory.pop();

        for (let grabbable of this._myGrabbables) {
            grabbable.updateAngularVelocityHistory();
        }
    },
    _computeReleaseLinearVelocity(linearVelocityHistory) {
        //speed
        let speed = glMatrix.vec3.length(linearVelocityHistory[0]);
        for (let i = 1; i < this._myLinearVelocityHistorySpeedAverageSamplesFromStart; i++) {
            speed += glMatrix.vec3.length(linearVelocityHistory[i]);
        }
        speed /= this._myLinearVelocityHistorySpeedAverageSamplesFromStart;

        // This way I give an increasing and smooth boost to the throw so that when u want to perform a weak throw, the value is not changed, but if u put more speed
        // it will be boosted to make it easier and still feel good and natural (value does not increase suddenly)
        let speedEaseMultiplier = Math.pp_mapToRange(speed, this._myThrowLinearVelocityBoostMinSpeedThreshold, this._myThrowLinearVelocityBoostMaxSpeedThreshold, 0, 1);
        speedEaseMultiplier = PP.EasingFunction.easeIn(speedEaseMultiplier);

        // Add the boost to the speed
        let extraSpeed = speed * (speedEaseMultiplier * this._myThrowLinearVelocityBoost);
        speed += extraSpeed;
        speed *= this._myThrowLinearVelocityMultiplier;
        speed = Math.pp_clamp(speed, 0, this._myThrowMaxLinearSpeed);

        if (this._myDebugActive) {
            this._debugDirectionLines(linearVelocityHistory);
        }

        //direction
        let directionCurrentWeight = this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let lastDirectionIndex = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart;
        let direction = [0, 0, 0];
        for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
            let currentDirection = linearVelocityHistory[i];
            glMatrix.vec3.scale(currentDirection, currentDirection, directionCurrentWeight);
            glMatrix.vec3.add(direction, direction, currentDirection);

            directionCurrentWeight--;
        }
        glMatrix.vec3.normalize(direction, direction);

        glMatrix.vec3.scale(direction, direction, speed);

        return direction;
    },
    _computeReleaseAngularVelocity(angularVelocityHistory) {
        let angularVelocity = angularVelocityHistory[0];

        //speed
        let speed = glMatrix.vec3.length(angularVelocity);

        speed = Math.pp_clamp(speed * this._myThrowAngularVelocityMultiplier, 0, this._myThrowMaxAngularSpeedRadians);

        //direction
        let direction = angularVelocity;
        glMatrix.vec3.normalize(direction, direction);

        glMatrix.vec3.scale(direction, direction, speed);

        return direction;
    },
    _debugDirectionLines(linearVelocityHistory) {
        for (let j = this._myLinearVelocityHistoryDirectionAverageSkipFromStart + this._myLinearVelocityHistoryDirectionAverageSamplesFromStart; j > this._myLinearVelocityHistoryDirectionAverageSkipFromStart; j--) {

            let directionCurrentWeight = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let lastDirectionIndex = j - this._myLinearVelocityHistoryDirectionAverageSkipFromStart;
            let direction = [0, 0, 0];
            for (let i = this._myLinearVelocityHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
                let currentDirection = linearVelocityHistory[i].pp_clone();
                glMatrix.vec3.scale(currentDirection, currentDirection, directionCurrentWeight);
                glMatrix.vec3.add(direction, direction, currentDirection);

                directionCurrentWeight--;
            }
            glMatrix.vec3.normalize(direction, direction);

            this._myDebugLines[j - 1].setStartDirectionLength(this.object.pp_getPosition(), direction, 0.2);
            let color = 1 / j;
            this._myDebugLines[j - 1].setColor([color, color, color, 1]);
            this._myDebugLines[j - 1].setVisible(true);
        }
    },
    _isAlreadyGrabbed(grabbable) {
        let found = this._myGrabbables.pp_find(element => element.getGrabbable() == grabbable);
        return found != null;
    }
});

PP.GrabberHandGrabbableData = class GrabberHandGrabbableData {
    constructor(grabbable, useGrabbableAsVelocitySource, linearVelocityHistorySize, angularVelocityHistorySize) {
        this._myGrabbable = grabbable;
        this._myUseGrabbableAsVelocitySource = useGrabbableAsVelocitySource;

        if (this._myUseGrabbableAsVelocitySource) {
            this._myLinearVelocityHistory = new Array(linearVelocityHistorySize);
            this._myLinearVelocityHistory.fill([0, 0, 0]);

            this._myAngularVelocityHistory = new Array(angularVelocityHistorySize);
            this._myAngularVelocityHistory.fill([0, 0, 0]);
        }
    }

    getGrabbable() {
        return this._myGrabbable;
    }

    getLinearVelocityHistory() {
        return this._myLinearVelocityHistory;
    }

    getAngularVelocityHistory() {
        return this._myAngularVelocityHistory;
    }

    updateLinearVelocityHistory() {
        if (this._myUseGrabbableAsVelocitySource) {
            this._myLinearVelocityHistory.unshift(this._myGrabbable.getLinearVelocity());
            this._myLinearVelocityHistory.pop();
        }
    }

    updateAngularVelocityHistory() {
        if (this._myUseGrabbableAsVelocitySource) {
            this._myAngularVelocityHistory.unshift(this._myGrabbable.getAngularVelocityRadians());
            this._myAngularVelocityHistory.pop();
        }
    }
};