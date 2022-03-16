WL.registerComponent('evidence-component', {
    _myHeightDisplacement: { type: WL.Type.Float, default: 0.0 }
}, {
    init: function () {
        this._myCallbackOnHit = null;
        this._myCallbackOnBigHit = null;
        this._myEvidence = null;
    },
    start: function () {
        this._myTimeActive = 0;
    },
    update: function (dt) {
        this._myTimeActive += dt;
    },
    setCallbackOnHit: function (callback) {
        this._myCallbackOnHit = callback;
    },
    setCallbackOnBigHit: function (callback) {
        this._myCallbackOnBigHit = callback;
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
    },
    bigHit: function (objectHit) {
        if (this._myCallbackOnBigHit) {
            this._myCallbackOnBigHit(objectHit, this);
        }
    },
    getTimeActive() {
        return this._myTimeActive;
    },
    onActivate() {
        this._myTimeActive = 0;
    },
    onDeactivate() {
        this._myTimeActive = 0;
    }
});

