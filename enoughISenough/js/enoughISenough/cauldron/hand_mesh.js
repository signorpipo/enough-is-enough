WL.registerComponent("hand-mesh", {
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
            console.error(rotations.length, endPositions.length);
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
    },
    update: function (dt) {
        for (let piece of this._myHandPieces) {
            piece.update(dt, this._myGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).myValue);
        }
    }
});

class HandPiece {
    constructor(object, startPosition, endPosition) {
        this._myObject = object;
        this._myStartPosition = startPosition;
        this._myEndPosition = endPosition;

        this._myCurrentPosition = startPosition.slice(0);
    }

    update(dt, interpolateValue) {
        glMatrix.vec3.lerp(this._myCurrentPosition, this._myEndPosition, this._myStartPosition, interpolateValue);
        this._myObject.pp_setPositionLocal(this._myCurrentPosition);
    }
}