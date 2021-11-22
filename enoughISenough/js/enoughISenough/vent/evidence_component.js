WL.registerComponent('evidence-component', {
}, {
    init: function () {
        this._myCallbackOnHit = null;
    },
    start: function () {
    },
    update: function (dt) {
    },
    setCallbackOnHit: function (callback) {
        this._myCallbackOnHit = callback;
    },
    hit: function (objectHit) {
        if (this._myCallbackOnHit) {
            this._myCallbackOnHit(objectHit, this);
        }
    }
});

