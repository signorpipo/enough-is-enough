WL.registerComponent("hand-animator", {
    _myHandPieceObject: { type: WL.Type.Object },
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' }
}, {
    init: function () {
    },
    start: function () {
        this._myHandObject = WL.scene.addObject(this.object);
        this._myHandObject.pp_rotateObject([0, 180, 0]);

        let cloneParams = new PP.CloneParams();
        cloneParams.myIgnoreNonCloneable = true;
        let handPieceBase = this._myHandPieceObject.pp_clone(cloneParams);
        handPieceBase.pp_setParent(this._myHandObject);

        let xDistance = 0.005;
        let yDistance = 0.005;
        let zDistance = 0.01;

        let leftMultiplier = -1;
        if (this._myHandedness == PP.HandednessIndex.RIGHT) {
            leftMultiplier = 1;
        }

        let rotations = [[0, 0, 0], [0, 0, -90 * leftMultiplier], [0, 0, 180], [0, 0, 90 * leftMultiplier], [180, 0, -90],
        [180, 0, (leftMultiplier > 0) ? 180 : 0], [180, 0, 90], [180, 0, (leftMultiplier < 0) ? 180 : 0]];
        let endPositions = [[-xDistance * leftMultiplier, yDistance, -zDistance], [xDistance * -leftMultiplier, -yDistance, -zDistance], [xDistance * leftMultiplier, -yDistance, -zDistance], [xDistance * leftMultiplier, yDistance, -zDistance],
        [xDistance, -yDistance * leftMultiplier, zDistance], [xDistance, yDistance * leftMultiplier, zDistance], [-xDistance, yDistance * leftMultiplier, zDistance], [-xDistance, -yDistance * leftMultiplier, zDistance]];

        let elementsToRemove = [7, 5, 4];
        if (this._myHandedness == PP.HandednessIndex.RIGHT) {
            elementsToRemove = [7, 6, 5];
        }

        for (let index of elementsToRemove) {
            rotations.pp_removeIndex(index);
            endPositions.pp_removeIndex(index);
        }

        let startPosition = [0, 0, 0];

        this._myHandPieces = [];

        for (let i = 0; i < rotations.length; i++) {
            let piece = null;
            if (i == rotations.length - 1) {
                piece = handPieceBase;
            } else {
                piece = handPieceBase.pp_clone(cloneParams);
            }

            piece.pp_rotateObject(rotations[i]);
            this._myHandPieces[i] = new HandPiece(piece, startPosition, endPositions[i]);
        }

        this._myGamepad = PP.myGamepads[PP.InputUtils.getHandednessByIndex(this._myHandedness)];

        this._myAppearList = [];
        this._myStarted = false;

        this._myPulseTimer = new PP.Timer(0.25);

        this._myHandPose = new PP.HandPose(PP.InputUtils.getHandednessByIndex(this._myHandedness));
        this._myHandPose.start();
    },
    update: function (dt) {
        this._myHandPose.update(dt);

        for (let piece of this._myHandPieces) {
            if (PP.InputUtils.getInputSourceType(this._myHandPose._myHandedness) == PP.InputSourceType.GAMEPAD) {
                piece.update(dt, this._myGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myValue);
            } else {
                let pressValue = 0;
                if (this._myGamepad.getButtonInfo(PP.ButtonType.SELECT).myIsPressed || this._myGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myIsPressed) {
                    pressValue = 1;
                }

                piece.update(dt, pressValue);
            }

            piece.setVisible(this._myHandPose.isValid());
        }

        if (this._myAppearList.length > 0) {
            let first = this._myAppearList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                this._myHandPieces[first[0]].start();
                this._myAppearList.shift();
            }
        }

        if (this._myStarted && !this.isDone()) {
            this._myPulseTimer.update(dt);
            if (this._myPulseTimer.isDone()) {
                this._myGamepad.pulse(0.5);
            }
        }
    },
    begin: function () {
        this._myStarted = true;
        this._myAppearList = [];

        let indexList = [];
        for (let i = 0; i < this._myHandPieces.length; i++) {
            indexList[i] = i;
        }

        let firstTime = true;
        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_removeIndex(randomIndex);

            let randomTimer = Math.pp_random(0.15, 0.45);
            if (firstTime) {
                randomTimer = 0.1;
                firstTime = false;
            }

            this._myAppearList.push([index, new PP.Timer(randomTimer)]);
        }
    },
    isDone: function () {
        let done = true;

        for (let piece of this._myHandPieces) {
            done = done && piece.isDone();
        }

        return done;
    },
    skip: function () {
        for (let piece of this._myHandPieces) {
            piece.skip();
        }

        this._myAppearList = [];
    }
});

class HandPiece {
    constructor(object, startPosition, endPosition) {
        this._myObject = object;
        this._myStartPosition = startPosition;
        this._myEndPosition = endPosition;

        this._myCurrentPosition = startPosition.slice(0);

        this._myIsVisible = false;
        this._myIsActive = false;
        this._myObject.pp_setActive(this._myIsVisible);

        this._myScale = 0;
        this._myObject.pp_setScale(this._myScale);

        this._myTimer = new PP.Timer(1);

        this._myAudio = Global.myAudioManager.createAudioPlayer(SfxID.HAND_PIECE_APPEAR);
        this._myAudio.setPitch(Math.pp_random(0.7, 1));
    }

    start() {
        this._myIsActive = true;

        this._myAudio.play();
    }

    update(dt, interpolateValue) {
        if (this._myIsActive) {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);

                this._myScale = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._myObject.pp_setScale(this._myScale);

                this._myAudio.updatePosition(this._myObject.pp_getPosition());
            }

            glMatrix.vec3.lerp(this._myCurrentPosition, this._myEndPosition, this._myStartPosition, interpolateValue);
            this._myObject.pp_setPositionLocal(this._myCurrentPosition);
        }
    }

    isDone() {
        return this._myScale == 1;
    }

    skip() {
        this._myIsActive = true;

        this._myTimer.reset();

        this._myAudio.stop();

        this._myScale = 1;
        this._myObject.pp_setScale(this._myScale);
    }

    setVisible(visible) {
        if (this._myIsVisible != (this._myIsActive && visible)) {
            this._myIsVisible = this._myIsActive && visible;
            this._myObject.pp_setActive(this._myIsVisible);
        }
    }
}