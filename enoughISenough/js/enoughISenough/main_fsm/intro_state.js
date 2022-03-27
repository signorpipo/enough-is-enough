class IntroState extends PP.State {
    constructor() {
        super();
        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "    Intro");
        this._myFSM.addState("wait_session", this.waitSession.bind(this));
        this._myFSM.addState("wait_start", this.waitStart.bind(this));
        this._myFSM.addState("move_ring", this.checkRingCompleted.bind(this));
        this._myFSM.addState("spawn_hands", this.handsUpdate.bind(this));
        this._myFSM.addState("show_title", new ShowTitleState());
        this._myFSM.addState("done");
        //this._myFSM.addState("test");

        this._myFSM.addTransition("wait_session", "wait_start", "end");
        this._myFSM.addTransition("wait_start", "move_ring", "end", this.startRing.bind(this));
        this._myFSM.addTransition("move_ring", "spawn_hands", "end", this.startHands.bind(this));
        this._myFSM.addTransition("spawn_hands", "show_title", "end");
        this._myFSM.addTransition("show_title", "done", "end", this.endIntro.bind(this));

        //skip
        this._myFSM.addTransition("wait_start", "move_ring", "skip");
        this._myFSM.addTransition("move_ring", "spawn_hands", "skip", this.skipRing.bind(this));
        this._myFSM.addTransition("spawn_hands", "show_title", "skip", this.skipHands.bind(this));
        this._myFSM.addTransition("show_title", "done", "skip", this.skipIntro.bind(this));
        //this._myFSM.addTransition("move_ring", "test", "skip", this.skipRing.bind(this));

        this._myTimer = new PP.Timer(2.5);

        this._myIntroDuration = 0;
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

        if (!this._myFSM.isInState("wait_session")) {
            this._myIntroDuration += dt;
        }

        let trialStartedOnce = Global.mySaveManager.loadBool("trial_started_once", false);
        let introViewed = Global.mySaveManager.loadNumber("intro_viewed", 0);

        if ((trialStartedOnce && introViewed >= 3) || Global.myDebugShortcutsEnabled) {
            if (!this._myFSM.isInState("wait_session") && PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd((PP.XRUtils.isDeviceEmulated()) ? 1 : 3)) {
                while (!this._myFSM.isInState("done") && !this._myFSM.isInState("test")) {
                    this._myFSM.perform("skip");
                }

                if (Global.myGoogleAnalytics) {
                    gtag("event", "intro_skipped", {
                        "value": 1
                    });

                    gtag("event", "intro_skipped_time", {
                        "value": this._myIntroDuration.toFixed(2)
                    });
                }
            }
        }
    }

    init(fsm) {
        this._myParentFSM = fsm;
        this._myFSM.init("wait_session");
    }

    waitSession(dt, fsm) {
        if (WL.xrSession && Global.myFirstUpdateDone) {
            let currentVersion = Global.mySaveManager.loadNumber("game_version", 0);
            console.log("Game Version:", currentVersion);

            if (Global.myGoogleAnalytics) {
                gtag("event", "xr_enter_session", {
                    "value": 1
                });

                PP.CAUtils.getUser(function () {
                    if (Global.myGoogleAnalytics) {
                        gtag("event", "xr_enter_session_logged_in", {
                            "value": 1
                        });
                    }
                }, null, true);
            }

            fsm.perform("end");
        }
    }

    waitStart(dt, fsm) {
        this._myTimer.update(dt);

        if (this._myTimer.isDone()) {
            fsm.perform("end");
        }
    }

    startRing(fsm) {
        Global.myRingAnimator.begin();
        this._myTimer.start(0.75);
    }

    checkRingCompleted(dt, fsm) {
        if (Global.myRingAnimator.isDone()) {
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

    skipRing() {
        Global.myRingAnimator.skip();
    }

    skipHands() {
        Global.myLeftHandAnimator.skip();
        Global.myRightHandAnimator.skip();
    }

    endIntro(fsm) {
        this._myParentFSM.perform(MainTransitions.End);

        let introViewed = Global.mySaveManager.loadNumber("intro_viewed", 0);
        introViewed += 1;
        Global.mySaveManager.save("intro_viewed", introViewed);

        gtag("event", "intro_viewed", {
            "value": 1
        });
    }

    skipIntro(fsm, transition) {
        transition.myFromState.myObject.end(fsm, transition);
        this._myParentFSM.perform(MainTransitions.Skip);
    }
}