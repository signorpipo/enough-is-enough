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

        this._mySendFarEventCounter = 3;

        this._myXRSessionManuallyStarted = false;

        if (WL.xrSession) {
            this._myXRSessionManuallyStarted = true;
        }
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

        if (!this._myFSM.isInState("wait_session")) {
            this._myIntroDuration += dt;
        }

        let trialEndedOnce = Global.mySaveManager.load("trial_ended_once", false);
        let introViewed = Global.mySaveManager.load("intro_viewed", 0);

        if ((trialEndedOnce && introViewed >= 3) || Global.myDebugShortcutsEnabled) {
            let buttonPressToSkip = (PP.XRUtils.isDeviceEmulated() && Global.myIsLocalhost && Global.myDebugShortcutsEnabled) ? 1 : 3;
            if (!this._myFSM.isInState("wait_session") && PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(buttonPressToSkip)) {
                while (!this._myFSM.isInState("done") && !this._myFSM.isInState("test")) {
                    this._myFSM.perform("skip");
                }

                Global.sendAnalytics("event", "intro_skipped", {
                    "value": 1
                });

                Global.sendAnalytics("event", "intro_done", {
                    "value": 1
                });

                Global.sendAnalytics("event", "intro_skipped_seconds", {
                    "value": this._myIntroDuration.toFixed(2)
                });
            }
        }
    }

    init(fsm) {
        this._myParentFSM = fsm;
        this._myFSM.init("wait_session");
    }

    waitSession(dt, fsm) {
        if (WL.xrSession && Global.myUpdateReady) {
            let currentVersion = Global.mySaveManager.load("game_version", 0);
            console.log("Game Version:", currentVersion);

            Global.sendAnalytics("event", "xr_enter_session", {
                "value": 1
            });

            PP.CAUtils.getUser(function () {
                Global.sendAnalytics("event", "xr_enter_session_logged_in", {
                    "value": 1
                });
            }, null, false);

            if (this._myXRSessionManuallyStarted) {
                Global.sendAnalytics("event", "xr_session_manually_started", {
                    "value": 1
                });
            }

            fsm.perform("end");
        }
    }

    waitStart(dt, fsm) {
        if (this._mySendFarEventCounter > 0) {
            this._mySendFarEventCounter--;
            if (this._mySendFarEventCounter == 0) {
                if (PP.XRUtils.isXRSessionActive()) {
                    this._sendFarEvents();
                }
            }
        }

        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            if (this._mySendFarEventCounter > 0) {
                this._mySendFarEventCounter = 0;
                if (PP.XRUtils.isXRSessionActive()) {
                    this._sendFarEvents();
                }
            }

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

        let introViewed = Global.mySaveManager.load("intro_viewed", 0);

        if (introViewed == 0) {
            Global.sendAnalytics("event", "intro_done_first", {
                "value": 1
            });
        }

        introViewed += 1;
        Global.mySaveManager.save("intro_viewed", introViewed);

        Global.sendAnalytics("event", "intro_viewed", {
            "value": 1
        });

        Global.sendAnalytics("event", "intro_done", {
            "value": 1
        });

        Global.myIntroDone = true;
    }

    skipIntro(fsm, transition) {
        transition.myFromState.myObject.end(fsm, transition);
        this._myParentFSM.perform(MainTransitions.Skip);

        Global.myIntroDone = true;
    }

    _sendFarEvents() {
        try {
            let flatPlayerPosition = Global.myPlayerPosition.vec3_removeComponentAlongAxis([0, 1, 0]);
            let distanceFromCenter = flatPlayerPosition.vec3_length();

            if (distanceFromCenter > 0.55) {
                Global.sendAnalytics("event", "xr_enter_session_very_far", {
                    "value": 1
                });
            } else if (distanceFromCenter > 0.30) {
                Global.sendAnalytics("event", "xr_enter_session_far", {
                    "value": 1
                });
            }

            let flatPlayerForward = Global.myPlayerForward.vec3_removeComponentAlongAxis([0, 1, 0]);
            let angle = flatPlayerForward.vec3_angle([0, 0, -1]);

            if (angle > 50) {
                Global.sendAnalytics("event", "xr_enter_session_looking_far_away", {
                    "value": 1
                });
            } else if (angle > 35) {
                Global.sendAnalytics("event", "xr_enter_session_looking_away", {
                    "value": 1
                });
            }
        } catch (error) {
            // Do nothing
        }
    }
}