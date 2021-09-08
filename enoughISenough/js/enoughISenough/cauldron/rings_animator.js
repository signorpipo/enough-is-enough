WL.registerComponent("rings-animator", {
    _myRingsHeight: { type: WL.Type.Float, default: 1.0 },
    _myRing: { type: WL.Type.Object },
    _mySmallerRing: { type: WL.Type.Object }
}, {
    init: function () {
        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true);
        this._myFSM.addState("move up", this.moveUp.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("move up", "done", "end");
    },
    start: function () {
        this._myRing.pp_setPosition([0, -1, 0]);
        this._mySmallerRing.pp_setPosition([0, -1, 0]);
    },
    update: function (dt) {
        this._myFSM.update(dt);
    },
    begin: function () {
        this._myFSM.start("move up", this.initMoveUp.bind(this));
    },
    initMoveUp: function () {
        this._myRing.pp_setPosition([0, -this._myRing.pp_getScale()[1] - 0.001, 0]);
        this._mySmallerRing.pp_setPosition([0, -this._mySmallerRing.pp_getScale()[1] - 0.001, 0]);

        this._myTimer = new PP.Timer(4);
    },
    moveUp: function (dt, fsm) {
        this._myTimer.update(dt);

        let startPositionRing = -this._myRing.pp_getScale()[1] - 0.001;
        let startPositionSmallerRing = -this._mySmallerRing.pp_getScale()[1] - 0.001;

        this._myRing.pp_setPosition([0, Math.pp_lerp(startPositionRing, this._myRingsHeight, this._myTimer.getPercentage()), 0]);
        this._mySmallerRing.pp_setPosition([0, Math.pp_lerp(startPositionSmallerRing, this._myRingsHeight, this._myTimer.getPercentage()), 0]);

        if (this._myTimer.isDone()) {
            this._myTimer.reset();

            this._myRing.pp_setPosition([0, this._myRingsHeight, 0]);
            this._mySmallerRing.pp_setPosition([0, this._myRingsHeight, 0]);

            fsm.perform("end");
        }
    },
    isDone() {
        return this._myFSM.isInState("done");
    }
});