WL.registerComponent('pp-grabber-hand', {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
    _myThrowLinearVelocityMultiplier: { type: WL.Type.Float, default: 1 }, // multiply the overall throw speed, so slow throws will be multiplied too
    _myThrowMaxLinearSpeed: { type: WL.Type.Float, default: 15 },
    _myThrowAngularVelocityMultiplier: { type: WL.Type.Float, default: 0.5 },
    _myThrowMaxAngularSpeed: { type: WL.Type.Float, default: 1080 }, // degrees
    _mySnapOnPivot: { type: WL.Type.Bool, default: false },
    _myGrabButton: { type: WL.Type.Enum, values: ['select', 'squeeze', 'both'], default: 'squeeze' },
    _myThrowVelocitySource: { type: WL.Type.Enum, values: ['hand', 'grabbable'], default: 'hand' },
    _myThrowLinearVelocityBoost: { type: WL.Type.Float, default: 1.75 },   // this boost is applied from 0% to 100% based on how fast you throw, so slow throws are not affected
    _myThrowLinearVelocityBoostMinSpeedThreshold: { type: WL.Type.Float, default: 0.6 },   // 0% boost is applied if plain throw speed is under this value
    _myThrowLinearVelocityBoostMaxSpeedThreshold: { type: WL.Type.Float, default: 2.5 },   // 100% boost is applied if plain throw speed is over this value
}, {
    init: function () {
        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness));

        this._myGrabbable = null;

        this._myGamepad = null;

        this._myHistorySize = 5;
        this._myHistorySpeedAverageSamplesFromStart = 1;
        this._myHistoryDirectionAverageSamplesFromStart = 3;
        this._myHistoryDirectionAverageSkipFromStart = 0;
        this._myHistoryCurrentCount = 0;

        this._myGrabbableLinearVelocityHistory = new Array(this._myHistorySize);
        this._myGrabbableLinearVelocityHistory.fill([0, 0, 0]);

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

        this._myCollision = this.object.pp_getComponent('collision');
        this._myHandPose.start();

        if (this._myDebugActive) {
            this._myDebugLines = [];
            for (let i = 0; i < this._myHistorySize; i++) {
                let line = new PP.DebugLine();
                line.setVisible(false);
                this._myDebugLines.push(line);
            }
        }
    },
    update: function (dt) {
        this._myHandPose.update(dt);

        if (this._myGrabbable) {
            this._updateVelocityHistory();
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
    _grab: function () {
        if (!this._myGrabbable) {
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
        }
    },
    _throw: function () {
        if (this._myGrabbable) {
            this._myGrabbable.unregisterReleaseEventListener(this);

            let linearVelocity = this._computeReleaseLinearVelocity();
            let angularVelocity = this._computeReleaseAngularVelocity();

            this._myGrabbable.throw(linearVelocity, angularVelocity);

            this._myThrowCallbacks.forEach(function (value) { value(this, this._myGrabbable, linearVelocity, angularVelocity); }.bind(this));

            this._myGrabbable = null;
        }
    },
    _onRelease() {
        this._myGrabbable.unregisterReleaseEventListener(this);
        this._myGrabbable = null;
    },
    _updateVelocityHistory() {
        this._myGrabbableLinearVelocityHistory.unshift(this._retrieveLinearVelocity());
        this._myGrabbableLinearVelocityHistory.pop();
    },
    _computeReleaseLinearVelocity() {
        //speed
        let speed = glMatrix.vec3.length(this._myGrabbableLinearVelocityHistory[0]);
        for (let i = 1; i < this._myHistorySpeedAverageSamplesFromStart; i++) {
            speed += glMatrix.vec3.length(this._myGrabbableLinearVelocityHistory[i]);
        }
        speed /= this._myHistorySpeedAverageSamplesFromStart;

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
            this._debugDirectionLines();
        }

        //direction
        let directionCurrentWeight = this._myHistoryDirectionAverageSamplesFromStart;
        let lastDirectionIndex = this._myHistoryDirectionAverageSkipFromStart + this._myHistoryDirectionAverageSamplesFromStart;
        let direction = [0, 0, 0];
        for (let i = this._myHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
            let currentDirection = this._myGrabbableLinearVelocityHistory[i];
            glMatrix.vec3.scale(currentDirection, currentDirection, directionCurrentWeight);
            glMatrix.vec3.add(direction, direction, currentDirection);

            directionCurrentWeight--;
        }
        glMatrix.vec3.normalize(direction, direction);

        glMatrix.vec3.scale(direction, direction, speed);

        return direction;
    },
    _computeReleaseAngularVelocity() {
        let angularVelocity = this._retrieveAngularVelocity();

        //speed
        let speed = glMatrix.vec3.length(angularVelocity);

        speed = Math.pp_clamp(speed * this._myThrowAngularVelocityMultiplier, 0, this._myThrowMaxAngularSpeedRadians);

        //direction
        let direction = angularVelocity;
        glMatrix.vec3.normalize(direction, direction);

        glMatrix.vec3.scale(direction, direction, speed);

        return direction;
    },
    _retrieveLinearVelocity() {
        let velocity = null;

        if (this._myThrowVelocitySource == 0) {
            velocity = this._myHandPose.getLinearVelocity();
        } else {
            velocity = this._myGrabbable.getLinearVelocity();
        }

        return velocity;
    },
    _retrieveAngularVelocity() {
        let velocity = null;

        if (this._myThrowVelocitySource == 0) {
            velocity = this._myHandPose.getAngularVelocityRadians();
        } else {
            velocity = this._myGrabbable.getAngularVelocityRadians();
        }

        return velocity;
    },
    _debugDirectionLines() {
        for (let j = this._myHistoryDirectionAverageSkipFromStart + this._myHistoryDirectionAverageSamplesFromStart; j > this._myHistoryDirectionAverageSkipFromStart; j--) {

            let directionCurrentWeight = j - this._myHistoryDirectionAverageSkipFromStart;
            let lastDirectionIndex = j - this._myHistoryDirectionAverageSkipFromStart;
            let direction = [0, 0, 0];
            for (let i = this._myHistoryDirectionAverageSkipFromStart; i < lastDirectionIndex; i++) {
                let currentDirection = this._myGrabbableLinearVelocityHistory[i].pp_clone();
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
    }
});