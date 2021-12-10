WL.registerComponent('evidence-component', {
    _myHeightDisplacement: { type: WL.Type.Float, default: 0.0 }
}, {
    init: function () {
        this._myCallbackOnHit = null;
        this._myEvidence = null;
    },
    start: function () {
    },
    update: function (dt) {
    },
    setCallbackOnHit: function (callback) {
        this._myCallbackOnHit = callback;
    },
    setEvidence: function (evidence) {
        this._myEvidence = evidence;
    },
    getEvidence: function () {
        return this._myEvidence;
    },
    getHeightDisplacement: function () {
        return this._myHeightDisplacement;
    },
    hit: function (objectHit) {
        if (this._myCallbackOnHit) {
            this._myCallbackOnHit(objectHit, this);
        }
    }
});

