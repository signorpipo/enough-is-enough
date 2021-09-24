class IntroState extends PP.State {
    constructor() {
        super();
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Intro");
        this._myFSM.addState("wait_session", this.waitSession.bind(this));
        this._myFSM.addState("wait_start", this.waitStart.bind(this));
        this._myFSM.addState("move_rings", this.checkRingsCompleted.bind(this));
        this._myFSM.addState("spawn_hands", this.handsUpdate.bind(this));
        this._myFSM.addState("show_title", new ShowTitleState());
        this._myFSM.addState("done");

        this._myFSM.addTransition("wait_session", "wait_start", "end");
        this._myFSM.addTransition("wait_start", "move_rings", "end", this.startRings.bind(this));
        this._myFSM.addTransition("move_rings", "spawn_hands", "end", this.startHands.bind(this));
        this._myFSM.addTransition("spawn_hands", "show_title", "end");
        this._myFSM.addTransition("show_title", "done", "end", this.endIntro.bind(this));

        //skip
        this._myFSM.addTransition("wait_start", "move_rings", "skip");
        this._myFSM.addTransition("move_rings", "spawn_hands", "skip", this.skipRings.bind(this));
        this._myFSM.addTransition("spawn_hands", "show_title", "skip", this.skipHands.bind(this));
        this._myFSM.addTransition("show_title", "done", "skip", this.skipIntro.bind(this));

        this._myTimer = new PP.Timer(2);
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

        //TEMP MORE PRESS
        if (!this._myFSM.isInState("wait_session") && PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(1)) {
            while (!this._myFSM.isInState("done")) {
                this._myFSM.perform("skip");
            }
        }
    }

    init(fsm) {
        this._myParentFSM = fsm;
        this._myFSM.init("wait_session");
    }

    waitSession(dt, fsm) {
        if (WL.xrSession) {
            fsm.perform("end");
        }
    }

    waitStart(dt, fsm) {
        this._myTimer.update(dt);

        if (this._myTimer.isDone()) {
            fsm.perform("end");
        }
    }

    startRings(fsm) {
        Global.myRingsAnimator.begin();
        this._myTimer.start(0.75);
    }

    checkRingsCompleted(dt, fsm) {
        if (Global.myRingsAnimator.isDone()) {
            this._myTimer.update(dt);
        }

        if (this._myTimer.isDone()) {
            fsm.perform("end");
        }
    }

    startHands(fsm) {
        let timer = Math.pp_random(0.4, 0.8);
        let startFirst = Math.pp_randomInt(0, 1);
        if (startFirst == 0) {
            this._myLeftHandTimer = new PP.Timer(0);
            this._myRightHandTimer = new PP.Timer(timer);
        } else {
            this._myLeftHandTimer = new PP.Timer(timer);
            this._myRightHandTimer = new PP.Timer(0);
        }

        this._myTimer.start(1.25);
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
            this._myTimer.update(dt);
        }

        if (this._myTimer.isDone()) {
            fsm.perform("end");
        }
    }

    skipRings() {
        Global.myRingsAnimator.skip();
    }

    skipHands() {
        Global.myLeftHandAnimator.skip();
        Global.myRightHandAnimator.skip();
    }

    endIntro(fsm) {
        this._myParentFSM.perform(MainTransitions.End);
    }

    skipIntro(fsm, transition) {
        transition.myFromState.myObject.end(fsm, transition);
        this._myParentFSM.perform(MainTransitions.Skip);
    }
}