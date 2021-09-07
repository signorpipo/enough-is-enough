class IntroState extends PP.State {
    constructor() {
        super();
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true);
        this._myFSM.addState("wait_session", this.waitSession.bind(this));
        this._myFSM.addState("move_rings", this.checkRingsCompleted.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("wait_session", "move_rings", "end", this.startRings.bind(this));
        this._myFSM.addTransition("move_rings", "done", "end");
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    init(fsm) {
        this._myFSM.start("wait_session");
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
}