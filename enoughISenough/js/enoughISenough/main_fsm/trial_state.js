class TrialState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "    Trial");
        this._myFSM.addState("init");
        this._myFSM.addState("first_blather", new BlatherState(this._firstBlatherSentences(), false));
        this._myFSM.addState("first_blather_hint", new BlatherState(this._firstBlatherHintSentences(), false));
        this._myFSM.addState("first_vent", new VentState(this._firstVentSetup(), this._firstEvidenceSetupList()));
        this._myFSM.addState("first_defeat_blather", new BlatherState(this._firstDefeatBlatherSentences(), true));
        this._myFSM.addState("second_blather", new BlatherState(this._secondBlatherSentences(), false));
        this._myFSM.addState("second_vent", new VentState(this._secondVentSetup(), this._secondEvidenceSetupList()));
        this._myFSM.addState("second_defeat_blather", new BlatherState(this._secondDefeatBlatherSentences(), true));
        this._myFSM.addState("third_blather", new BlatherState(this._thirdBlatherSentences(), false));
        this._myFSM.addState("third_vent", new VentState(this._thirdVentSetup(), this._thirdEvidenceSetupList()));
        this._myFSM.addState("third_defeat_blather", new BlatherState(this._thirdDefeatBlatherSentences(), true));
        this._myFSM.addState("MrNOT_blather", new BlatherState(this._mrNOTBlatherSentences(), true));
        this._myFSM.addState("MrNOT_vent", new MrNOTVentState());
        this._myFSM.addState("MrNOT_defeat_blather", new BlatherState(this._mrNOTDefeatBlatherSentences(), true));
        this._myFSM.addState("it_will_always_be_not_enough", new BlatherState(this._NOTENOUGHBlatherSentences(), true));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_blather", "start_1");
        this._myFSM.addTransition("init", "first_blather_hint", "start_1_hint");
        this._myFSM.addTransition("init", "second_blather", "start_2");
        this._myFSM.addTransition("init", "third_blather", "start_3");
        this._myFSM.addTransition("init", "MrNOT_blather", "start_4");

        this._myFSM.addTransition("first_blather", "first_vent", "end");
        this._myFSM.addTransition("first_blather_hint", "first_vent", "end");
        this._myFSM.addTransition("first_vent", "first_defeat_blather", "lost", this._trialPhaseLost.bind(this, 1));
        this._myFSM.addTransition("first_vent", "second_blather", "completed", this._trialPhaseCompleted.bind(this, 1));

        this._myFSM.addTransition("second_blather", "second_vent", "end");
        this._myFSM.addTransition("second_vent", "second_defeat_blather", "lost", this._trialPhaseLost.bind(this, 2));
        this._myFSM.addTransition("second_vent", "third_blather", "completed", this._trialPhaseCompleted.bind(this, 2));

        this._myFSM.addTransition("third_blather", "third_vent", "end");
        this._myFSM.addTransition("third_vent", "third_defeat_blather", "lost", this._trialPhaseLost.bind(this, 3));
        this._myFSM.addTransition("third_vent", "MrNOT_blather", "completed", this._trialPhaseCompleted.bind(this, 3));

        this._myFSM.addTransition("MrNOT_blather", "MrNOT_vent", "end");
        this._myFSM.addTransition("MrNOT_vent", "MrNOT_defeat_blather", "lost", this._trialPhaseLost.bind(this, 4));
        this._myFSM.addTransition("MrNOT_vent", "it_will_always_be_not_enough", "completed", this._trialPhaseCompleted.bind(this, 4));

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end", this._gameCompleted.bind(this));

        this._myFSM.addTransition("first_defeat_blather", "done", "end", this._backToMenu.bind(this, 1));
        this._myFSM.addTransition("second_defeat_blather", "done", "end", this._backToMenu.bind(this, 2));
        this._myFSM.addTransition("third_defeat_blather", "done", "end", this._backToMenu.bind(this, 3));
        this._myFSM.addTransition("MrNOT_defeat_blather", "done", "end", this._backToMenu.bind(this, 4));

        this._myFSM.addTransition("done", "first_blather", "start_1");
        this._myFSM.addTransition("done", "first_blather_hint", "start_1_hint");
        this._myFSM.addTransition("done", "second_blather", "start_2");
        this._myFSM.addTransition("done", "third_blather", "start_3");
        this._myFSM.addTransition("done", "MrNOT_blather", "start_4");

        let states = this._myFSM.getStates();
        for (let state of states) {
            this._myFSM.addTransition(state.myID, "done", "skip", this._backToMenu.bind(this, 1));
        }

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        Global.myTrialDuration += dt;
        Global.myStatistics.myTrialPlayTime += dt;

        this._myFSM.update(dt);
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;
        Global.myTrialDuration = 0;
        this._myTrialStartedFromBegin = false;
        Global.myStatistics.myTrialPlayCount += 1;
        Global.myStatistics.myTrialPlayCountResettable += 1;

        let trialPhase = Global.mySaveManager.loadNumber("trial_phase", 1);

        if (trialPhase == 1) {
            this._myTrialStartedFromBegin = true;
        }

        let transition = "start_".concat(trialPhase);

        let giveHint = false;
        giveHint = trialPhase == 1 && Global.myStatistics.myTrialPlayCountResettable >= 7 && Global.myStatistics.myMrNOTClonesDismissedResettable <= 0;
        if (giveHint) {
            transition = transition.concat("_hint");

            if (Global.myGoogleAnalytics) {
                gtag("event", "trial_hint_viewed_phase_".concat(trialPhase), {
                    "value": 1
                });
            }
        }

        if (Global.myGoogleAnalytics) {
            gtag("event", "trial_started", {
                "value": 1
            });

            gtag("event", "trial_started_phase_".concat(trialPhase), {
                "value": 1
            });
        }

        this._myFSM.perform(transition);
    }

    end(fsm, transitionID) {
        Global.mySaveManager.save("trial_started_once", true);
    }

    _trialPhaseCompleted(trialPhase, fsm) {
        if (Global.myGoogleAnalytics) {
            gtag("event", "trial_completed_phase_".concat(trialPhase), {
                "value": 1
            });
        }

        if (trialPhase == 4) {
            if (Global.myGoogleAnalytics) {
                gtag("event", "trial_time", {
                    "value": Global.myTrialDuration.toFixed(2)
                });
            }
        }
    }

    _trialPhaseLost(trialPhase, fsm) {
        if (Global.myGoogleAnalytics) {
            gtag("event", "trial_lost_phase_".concat(trialPhase), {
                "value": 1
            });

            gtag("event", "trial_lost_time_phase_".concat(trialPhase), {
                "value": Global.myVentDuration.toFixed(2)
            });

            gtag("event", "trial_time", {
                "value": Global.myTrialDuration.toFixed(2)
            });

            if (Global.myStatistics.myTrialCompletedCount <= 0) {
                gtag("event", "trial_lost_time_before_completed_phase_".concat(trialPhase), {
                    "value": Global.myVentDuration.toFixed(2)
                });
            }

            if (trialPhase == 1 && Global.myStatistics.myTrialCompletedCount <= 0) {
                let clonesOnlyPunched = Global.myStatistics.myMrNOTClonesDismissed > 0 && Global.myStatistics.myMrNOTClonesDismissed == Global.myStatistics.myEvidencesPunched;
                if (Global.myStatistics.myMrNOTClonesDismissed <= 0 || clonesOnlyPunched) {
                    gtag("event", "trial_lost_before_first_throw", {
                        "value": 1
                    });

                    if (clonesOnlyPunched) {
                        gtag("event", "trial_lost_only_punched", {
                            "value": 1
                        });
                    }
                }
            }
        }
    }

    _backToMenu(trialPhase, fsm) {
        Global.mySaveManager.save("trial_phase", trialPhase);
        this._myParentFSM.perform(MainTransitions.End);
    }

    _gameCompleted(fsm) {
        if (this._myTrialStartedFromBegin) {
            if (Global.myStatistics.myTrialBestTime < 0 || Global.myTrialDuration < Global.myStatistics.myTrialBestTime) {
                Global.myStatistics.myTrialBestTime = Global.myTrialDuration;
            }

            if (Global.myGoogleAnalytics) {
                gtag("event", "trial_completed_from_start", {
                    "value": 1
                });

                gtag("event", "trial_completed_from_start_time", {
                    "value": Global.myTrialDuration.toFixed(2)
                });
            }
        }

        Global.mySaveManager.save("trial_phase", 1);
        Global.mySaveManager.save("trial_completed", true);
        Global.myStatistics.myTrialCompletedCount += 1;
        this._myParentFSM.perform(MainTransitions.End);
    }

    _firstBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("Glad to see you again"));
        sentences.push(new Sentence("Maybe we could have a little conversation"));
        sentences.push(new Sentence("Why don't you show me what you have learned so far?", 2.5, 1.5));

        return sentences;
    }

    _firstBlatherHintSentences() {
        let sentences = [];

        sentences.push(new Sentence("Glad to see you again"));
        sentences.push(new Sentence("Maybe we could have a little conversation"));
        sentences.push(new Sentence("Why don't you THROW me what you have learned so far?", 2.5, 1.5));

        return sentences;
    }

    _firstDefeatBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("Don't even bother", 2.5, 2));

        return sentences;
    }

    _secondBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("After our last time together", 1, 0));
        sentences.push(new Sentence("I see you have tried many things"));
        sentences.push(new Sentence("Were they worth your time?", 2.5, 1.5));

        return sentences;
    }

    _secondDefeatBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("Stop wasting my time too", 2.5, 2));

        return sentences;
    }

    _thirdBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("I've watched you jump from one thing to another", 1, 0));
        sentences.push(new Sentence("hoping to find what's yours"));
        sentences.push(new Sentence("Don't you realize how meaningless this is?", 2.5, 1.5));

        return sentences;
    }

    _thirdDefeatBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("There is no purpose left for you", 2.5, 2));

        return sentences;
    }

    _mrNOTBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("enough IS enough", 0.1, 0));

        return sentences;
    }

    _mrNOTDefeatBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("", 2, 1.5));

        return sentences;
    }

    _NOTENOUGHBlatherSentences() {
        let sentences = [];

        sentences.push(new Sentence("You may think you are stronger now"));
        sentences.push(new Sentence("You may feel free from others' judgment", 2, 0));
        sentences.push(new Sentence("and from your own"));
        sentences.push(new Sentence("You may fool yourself into believing this...", 1.75, 0.75));
        sentences.push(new Sentence("But after all has been said and done", 0.75, 0));
        sentences.push(new Sentence("you KNOW", 0.75, 0));
        sentences.push(new Sentence("it will always be...", 1.75, 0.75));
        sentences.push(new Sentence("NOT ENOUGH", 4, 4, true));

        return sentences;
    }

    _invitationSentences() {
        let sentences = [];

        sentences.push(new Sentence("My dearest puppet", 1.75, 0.75));
        sentences.push(new Sentence("did you miss me?"));
        sentences.push(new Sentence("I did", 2.5, 1.5));

        sentences.push(new Sentence("Why don’t you STAND UP", 1, 0));
        sentences.push(new Sentence("SQUEEZE those buttons", 1, 0));
        sentences.push(new Sentence("and get ready to THROW?"));

        sentences.push(new Sentence("I am here for you", 1.75, 0.75));
        sentences.push(new Sentence("don’t make me wait", 2.5, 1.5));

        return sentences;
    }

    _firstEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 3));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 1));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        return evidenceSetupList;
    }

    _secondEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 4));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 2));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, 10));

        return evidenceSetupList;
    }

    _thirdEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 4));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 3));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, 5));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.SHATTERED_COIN, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MR_NOT_EVIDENCE, 10));

        return evidenceSetupList;
    }
}