WL.registerComponent("hand-animator", {
    _myHandPieceMesh: { type: WL.Type.Mesh },
    _myHandPieceMaterial: { type: WL.Type.Material },
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' }
}, {
    init: function () {
    },
    start: function () {
        let handPieceBase = WL.scene.addObject(this.object);
        let mesh = handPieceBase.pp_addComponent("mesh");
        mesh.mesh = this._myHandPieceMesh;
        mesh.material = this._myHandPieceMaterial.clone();

        let xDistance = 0.005;
        let yDistance = 0.005;
        let zDistance = 0.01;

        let leftMultiplier = 1;
        if (this._myHandedness == PP.HandednessIndex.LEFT) {
            leftMultiplier = -1;
            handPieceBase.pp_rotateObject([0, 0, -90]);
        }

        let rotations = [[0, 0, 0], [0, 0, -90 * leftMultiplier], [0, 0, 180], [0, 0, 90 * leftMultiplier], [180, 0, -90],
        [180, 0, (leftMultiplier > 0) ? 180 : 0], [180, 0, 90], [180, 0, (leftMultiplier < 0) ? 180 : 0]];
        let endPositions = [[-xDistance * leftMultiplier, yDistance, -zDistance], [xDistance * leftMultiplier, yDistance, -zDistance], [xDistance * leftMultiplier, -yDistance, -zDistance], [-xDistance * leftMultiplier, -yDistance, -zDistance],
        [-xDistance * leftMultiplier, yDistance, zDistance], [xDistance * leftMultiplier, yDistance, zDistance], [xDistance * leftMultiplier, -yDistance, zDistance], [-xDistance * leftMultiplier, -yDistance, zDistance]];

        let elementsToRemove = [7, 5, 4];
        for (let index of elementsToRemove) {
            rotations.pp_remove(index);
            endPositions.pp_remove(index);
        }

        let startPosition = [0, 0, 0];

        this._myHandPieces = [];

        for (let i = 0; i < rotations.length; i++) {
            let piece = null;
            if (i == rotations.length - 1) {
                piece = handPieceBase;
            } else {
                piece = handPieceBase.pp_clone();
            }

            piece.pp_rotateObject(rotations[i]);
            this._myHandPieces[i] = new HandPiece(piece, startPosition, endPositions[i]);
        }

        this._myGamepad = PP.Gamepads[PP.InputUtils.getHandednessByIndex(this._myHandedness)];

        this._myAppearList = [];
    },
    update: function (dt) {
        for (let piece of this._myHandPieces) {
            piece.update(dt, this._myGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myValue);
        }

        if (this._myAppearList.length > 0) {
            let first = this._myAppearList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                this._myHandPieces[first[0]].start();
                this._myAppearList.shift();
            }
        }
    },
    begin: function () {
        this._myAppearList = [];

        let indexList = [];
        for (let i = 0; i < this._myHandPieces.length; i++) {
            indexList[i] = i;
        }

        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_remove(randomIndex);

            let randomTimer = Math.pp_random(0.15, 0.45);
            this._myAppearList.push([index, new PP.Timer(randomTimer)]);
        }
    },
    isDone: function () {
        let done = true;

        for (let piece of this._myHandPieces) {
            done &= piece.isDone();
        }

        return done;
    }
});

class HandPiece {
    constructor(object, startPosition, endPosition) {
        this._myObject = object;
        this._myStartPosition = startPosition;
        this._myEndPosition = endPosition;

        this._myCurrentPosition = startPosition.slice(0);

        this._myIsActive = false;
        this._myObject.pp_setActive(this._myIsActive);

        this._myScale = 0;
        this._myObject.pp_setScale(this._myScale);

        this._myTimer = new PP.Timer(0.5);
    }

    start() {
        this._myIsActive = true;
        this._myObject.pp_setActive(this._myIsActive);
    }

    update(dt, interpolateValue) {
        if (this._myIsActive && this._myScale != 1) {
            this._myTimer.update(dt);

            this._myScale = this._myTimer.getPercentage();
            this._myObject.pp_setScale(this._myScale);
        }

        glMatrix.vec3.lerp(this._myCurrentPosition, this._myEndPosition, this._myStartPosition, interpolateValue);
        this._myObject.pp_setPositionLocal(this._myCurrentPosition);
    }

    isDone() {
        return this._myScale == 1;
    }
}