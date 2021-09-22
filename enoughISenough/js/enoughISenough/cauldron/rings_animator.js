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

        Global.myRingHeight = this._myRingsHeight;
        Global.myRingRadius = 0.65;
    },
    start: function () {
        this._myRing.pp_setPosition([0, -1, 0]);
        this._mySmallerRing.pp_setPosition([0, -1, 0]);

        this._myRingAudio = PP.AudioManager.createAudioPlayer(SfxID.RING_RISE);
    },
    update: function (dt) {
        this._myFSM.update(dt);
    },
    begin: function () {
        this._myFSM.init("move up", this.initMoveUp.bind(this));
    },
    initMoveUp: function () {
        this._myRing.pp_setPosition([0, -this._myRing.pp_getScale()[1] - 0.001, 0]);
        this._mySmallerRing.pp_setPosition([0, -this._mySmallerRing.pp_getScale()[1] - 0.001, 0]);

        this._myTimer = new PP.Timer(5);

        this._myRingAudio.play();
    },
    moveUp: function (dt, fsm) {
        this._myTimer.update(dt);

        let startPositionRing = -0.2;
        let startPositionSmallerRing = -0.6;

        this._myRing.pp_setPosition([0, Math.pp_interpolate(startPositionRing, this._myRingsHeight, this._myTimer.getPercentage(), PP.EasingFunction.easeOut), 0]);
        this._mySmallerRing.pp_setPosition([0, Math.pp_interpolate(startPositionSmallerRing, this._myRingsHeight, this._myTimer.getPercentage(), PP.EasingFunction.easeOut), 0]);

        this._myRingAudio.updatePosition(this._myRing.pp_getPosition());

        if (this._myTimer.isDone()) {
            this._myTimer.reset();

            this._myRing.pp_setPosition([0, this._myRingsHeight, 0]);
            this._mySmallerRing.pp_setPosition([0, this._myRingsHeight, 0]);

            fsm.perform("end");
        }
    },
    isDone: function () {
        return this._myFSM.isInState("done");
    },
    skip: function () {
        this._myRing.pp_setPosition([0, this._myRingsHeight, 0]);
        this._mySmallerRing.pp_setPosition([0, this._myRingsHeight, 0]);
        this._myRingAudio.stop();

        this._myFSM.perform("end");
    }
});