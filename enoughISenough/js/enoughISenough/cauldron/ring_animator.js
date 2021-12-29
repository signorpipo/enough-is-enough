WL.registerComponent("ring-animator", {
    _myRingHeight: { type: WL.Type.Float, default: 1.0 },
    _myRingOut: { type: WL.Type.Object },
    _myRingMiddle: { type: WL.Type.Object }
}, {
    init: function () {
        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true);
        this._myFSM.addState("move up", this.moveUp.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("move up", "done", "end");

        Global.myRingHeight = this._myRingHeight;
        Global.myRingRadius = 0.64;
    },
    start: function () {
        this._myRingOut.pp_setPosition([0, -1, 0]);
        this._myRingMiddle.pp_setPosition([0, -1, 0]);

        this._myRingOutAudio = Global.myAudioManager.createAudioPlayer(SfxID.RING_RISE);
    },
    update: function (dt) {
        if (!Global.myFirstUpdateDone) {
            this._myRingOut.pp_setActive(false);
            this._myRingMiddle.pp_setActive(false);
        }

        this._myFSM.update(dt);
    },
    begin: function () {
        this._myFSM.init("move up", this.initMoveUp.bind(this));
    },
    initMoveUp: function () {
        this._myRingOut.pp_setActive(true);
        this._myRingMiddle.pp_setActive(true);

        PP.MeshUtils.setAlpha(this._myRingOut, 0);
        PP.MeshUtils.setAlpha(this._myRingMiddle, 0);

        this._myRingOut.pp_setPosition([0, -this._myRingOut.pp_getScale()[1] - 0.001, 0]);
        this._myRingMiddle.pp_setPosition([0, -this._myRingMiddle.pp_getScale()[1] - 0.001, 0]);

        this._myTimer = new PP.Timer(5);
        this._myAudioTimer = new PP.Timer(0.05);
    },
    moveUp: function (dt, fsm) {
        this._myTimer.update(dt);
        this._myAudioTimer.update(dt);
        if (this._myAudioTimer.isDone()) {
            this._myAudioTimer.reset();

            this._myRingOutAudio.play();
        }

        let alphaInterpolationValue = Math.pp_mapToNewInterval(this._myTimer.getPercentage(), 0, 0.5, 0, 1);
        let alphaValue = PP.EasingFunction.easeOut(alphaInterpolationValue);
        PP.MeshUtils.setAlpha(this._myRingOut, alphaValue);
        PP.MeshUtils.setAlpha(this._myRingMiddle, alphaValue);

        let startPositionRingOut = -0.2;
        let startPositionRingMiddle = -0.6;

        this._myRingOut.pp_setPosition([0, Math.pp_interpolate(startPositionRingOut, this._myRingHeight, this._myTimer.getPercentage(), PP.EasingFunction.easeOut), 0]);
        this._myRingMiddle.pp_setPosition([0, Math.pp_interpolate(startPositionRingMiddle, this._myRingHeight, this._myTimer.getPercentage(), PP.EasingFunction.easeOut), 0]);

        this._myRingOutAudio.updatePosition(this._myRingOut.pp_getPosition());

        if (this._myTimer.isDone()) {
            this._myTimer.reset();

            this._myRingOut.pp_setPosition([0, this._myRingHeight, 0]);
            this._myRingMiddle.pp_setPosition([0, this._myRingHeight, 0]);

            fsm.perform("end");
        }
    },
    isDone: function () {
        return this._myFSM.isInState("done");
    },
    skip: function () {
        this._myRingOut.pp_setActive(true);
        this._myRingMiddle.pp_setActive(true);

        this._myRingOut.pp_setPosition([0, this._myRingHeight, 0]);
        this._myRingMiddle.pp_setPosition([0, this._myRingHeight, 0]);

        PP.MeshUtils.setAlpha(this._myRingOut, 1);
        PP.MeshUtils.setAlpha(this._myRingMiddle, 1);

        this._myRingOutAudio.stop();

        this._myFSM.perform("end");
    }
});