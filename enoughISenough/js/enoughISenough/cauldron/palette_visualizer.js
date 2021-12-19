WL.registerComponent("palette-visualizer", {
    _myPaletteObject: { type: WL.Type.Object },
    _myPaletteObjectScaleFactor: { type: WL.Type.Float, default: 1 },
    _myOffsetX: { type: WL.Type.Float, default: 0.05 },
    _myOffsetY: { type: WL.Type.Float, default: 0.05 },
    _myCloneMaterial: { type: WL.Type.Bool, default: false },
    _my1: { type: WL.Type.Material },
    _my2: { type: WL.Type.Material },
    _my3: { type: WL.Type.Material },
    _my4: { type: WL.Type.Material },
    _my5: { type: WL.Type.Material },
    _my6: { type: WL.Type.Material },
    _my7: { type: WL.Type.Material },
    _my8: { type: WL.Type.Material },
    _my9: { type: WL.Type.Material },
    _my10: { type: WL.Type.Material },
    _my11: { type: WL.Type.Material },
    _my12: { type: WL.Type.Material },
    _my13: { type: WL.Type.Material },
    _my14: { type: WL.Type.Material },
    _my15: { type: WL.Type.Material },
    _my16: { type: WL.Type.Material }
}, {
    init: function () {
        this._myMeshes = [];

        this._myMaterials = [];
        for (let i = 1; i < 17; i++) {
            let material = "_my".concat(i);
            if (this._myCloneMaterial) {
                this._myMaterials.push(this[material].clone());
            } else {
                this._myMaterials.push(this[material]);
            }
        }

        this._myColumns = Math.ceil(Math.sqrt(this._myMaterials.length));
        this._myRows = Math.ceil(this._myMaterials.length / this._myColumns);
    },
    start: function () {
        let cloneParams = new PP.CloneParams();
        cloneParams.myComponentsToInclude.push("mesh");

        let positions = this._createPositions();
        for (let i = 0; i < this._myMaterials.length; i++) {
            let newObject = this._myPaletteObject.pp_clone(cloneParams);

            newObject.pp_setParent(this.object);
            newObject.pp_setPositionLocal(positions[i]);
            newObject.pp_scaleObject(this._myPaletteObjectScaleFactor);
            newObject.pp_resetRotationLocal();
            newObject.pp_setActive(true);

            PP.MeshUtils.setMaterial(newObject, this._myMaterials[i], false);
        }
    },
    update: function (dt) {
    },
    _createPositions() {
        let positions = [];
        let startingRowPosition = vec3_create();
        let startingColumnPosition = vec3_create();

        let halfColumn = Math.floor(this._myColumns / 2);
        startingColumnPosition[0] = -(this._myOffsetX * halfColumn);
        if (this._myColumns % 2 == 0) {
            startingColumnPosition[0] += this._myOffsetX / 2;
        }

        let halfRow = Math.floor(this._myRows / 2);
        startingRowPosition[1] = +(this._myOffsetX * halfRow);
        if (this._myRows % 2 == 0) {
            startingRowPosition[1] -= this._myOffsetX / 2;
        }

        for (let i = 0; i < this._myRows; i++) {
            let rowPosition = startingRowPosition.pp_clone();
            rowPosition[1] -= this._myOffsetY * i;
            for (let j = 0; j < this._myColumns; j++) {
                let position = rowPosition.pp_clone();
                position.vec3_add(startingColumnPosition, position);
                position[0] += this._myOffsetX * j;

                positions.push(position);
            }
        }

        return positions;
    }
});