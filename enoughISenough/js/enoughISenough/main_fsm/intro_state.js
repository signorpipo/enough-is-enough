class IntroState extends PP.State {
    constructor() {
        super();
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true);
        this._myFSM.addState("wait_session", this.waitSession.bind(this));
        this._myFSM.addState("move_rings", this.checkRingsCompleted.bind(this));
        this._myFSM.addState("spawn_hands", this.handsUpdate.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("wait_session", "move_rings", "end", this.startRings.bind(this));
        this._myFSM.addTransition("move_rings", "spawn_hands", "end", this.startHands.bind(this));
        this._myFSM.addTransition("spawn_hands", "done", "end");
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    init(fsm) {
        this._myFSM.init("wait_session");
    }

    waitSession(dt, fsm) {
        if (WL.xrSession) {
            fsm.perform("end");
        }
    }

    startRings(dt, fsm) {
        Global.myRingsAnimator.begin();
    }

    checkRingsCompleted(dt, fsm) {
        if (Global.myRingsAnimator.isDone()) {
            fsm.perform("end");
        }
    }

    startHands(dt, fsm) {
        let timer = Math.pp_random(0.4, 0.8);
        let startFirst = Math.pp_randomInt(0, 1);
        if (startFirst == 0) {
            this._myLeftHandTimer = new PP.Timer(0);
            this._myRightHandTimer = new PP.Timer(timer);
        } else {
            this._myLeftHandTimer = new PP.Timer(timer);
            this._myRightHandTimer = new PP.Timer(0);
        }
    }

    handsUpdate(dt, fsm) {
        this._myLeftHandTimer.update(dt);
        this._myRightHandTimer.update(dt);

        if (this._myLeftHandTimer.isDone()) {
            this._myLeftHandTimer.reset();
            Global.myLeftHandAnimator.begin();
        }

        if (this._myRightHandTimer.isDone()) {
            this._myRightHandTimer.reset();
            Global.myRightHandAnimator.begin();
        }

        if (Global.myLeftHandAnimator.isDone() && Global.myRightHandAnimator.isDone()) {
            fsm.perform("end");
        }
    }
}