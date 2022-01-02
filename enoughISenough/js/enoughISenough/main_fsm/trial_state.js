class TrialState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "    Trial");
        this._myFSM.addState("init");
        this._myFSM.addState("first_talk", new TalkState(this._firstTalkSentences(), false));
        this._myFSM.addState("first_vent", new VentState(this._firstVentSetup(), this._firstEvidenceSetupList()));
        this._myFSM.addState("first_defeat", new TalkState(this._firstDefeatSentences(), true));
        this._myFSM.addState("second_talk", new TalkState(this._secondTalkSentences(), false));
        this._myFSM.addState("second_vent", new VentState(this._secondVentSetup(), this._secondEvidenceSetupList()));
        this._myFSM.addState("second_defeat", new TalkState(this._secondDefeatSentences(), true));
        this._myFSM.addState("third_talk", new TalkState(this._thirdTalkSentences(), false));
        this._myFSM.addState("third_vent", new VentState(this._thirdVentSetup(), this._thirdEvidenceSetupList()));
        this._myFSM.addState("third_defeat", new TalkState(this._thirdDefeatSentences(), true));
        this._myFSM.addState("MrNOT_talk", new TalkState(this._mrNOTTalkSentences(), true));
        this._myFSM.addState("MrNOT_vent", new MrNOTVentState());
        this._myFSM.addState("MrNOT_defeat", new TalkState(this._mrNOTDefeatSentences(), true));
        this._myFSM.addState("it_will_always_be_not_enough", new TalkState(this._NOTENOUGHTalkSentences(), true));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_talk", "start_1");
        this._myFSM.addTransition("init", "second_talk", "start_2");
        this._myFSM.addTransition("init", "third_talk", "start_3");

        this._myFSM.addTransition("first_talk", "first_vent", "end");
        this._myFSM.addTransition("first_vent", "first_defeat", "defeat");
        this._myFSM.addTransition("first_vent", "second_talk", "end");

        this._myFSM.addTransition("second_talk", "second_vent", "end");
        this._myFSM.addTransition("second_vent", "second_defeat", "defeat");
        this._myFSM.addTransition("second_vent", "third_talk", "end");

        this._myFSM.addTransition("third_talk", "third_vent", "end");
        this._myFSM.addTransition("third_vent", "third_defeat", "defeat");
        this._myFSM.addTransition("third_vent", "MrNOT_talk", "end");

        this._myFSM.addTransition("MrNOT_talk", "MrNOT_vent", "end");
        this._myFSM.addTransition("MrNOT_vent", "MrNOT_defeat", "defeat");
        this._myFSM.addTransition("MrNOT_vent", "it_will_always_be_not_enough", "end");

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end", this._gameCompleted.bind(this));

        this._myFSM.addTransition("first_defeat", "done", "end", this._backToMenu.bind(this, 1));
        this._myFSM.addTransition("second_defeat", "done", "end", this._backToMenu.bind(this, 2));
        this._myFSM.addTransition("third_defeat", "done", "end", this._backToMenu.bind(this, 3));
        this._myFSM.addTransition("MrNOT_defeat", "done", "end", this._backToMenu.bind(this, 3));

        this._myFSM.addTransition("done", "first_talk", "start_1");
        this._myFSM.addTransition("done", "second_talk", "start_2");
        this._myFSM.addTransition("done", "third_talk", "start_3");

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
        this._myTrialStartedFromBegin = true;
        Global.myStatistics.myTrialPlayCount += 1;

        let trialLevel = PP.SaveUtils.loadNumber("trial_level", 1);
        let transition = "start_".concat(trialLevel);
        console.error(transition);

        this._myFSM.perform(transition);

    }

    end(fsm, transitionID) {
        PP.SaveUtils.save("trial_started_once", true);
    }

    _backToMenu(trialLevel, fsm) {
        this._myParentFSM.perform(MainTransitions.End);
        PP.SaveUtils.save("trial_level", trialLevel);
    }

    _gameCompleted(fsm) {
        if (this._myTrialStartedFromBegin) {
            if (Global.myStatistics.myTrialBestTime < 0 || Global.myTrialDuration < Global.myStatistics.myTrialBestTime) {
                Global.myStatistics.myTrialBestTime = Global.myTrialDuration;
            }
        }

        PP.SaveUtils.save("trial_level", 1);
        PP.SaveUtils.save("trial_completed", true);
        this._myParentFSM.perform(MainTransitions.End);
        Global.myStatistics.myTrialCompletedCount += 1;
    }

    _firstTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("Glad to see you again"));
        sentences.push(new Sentence("Maybe we can have a little conversation"));
        sentences.push(new Sentence("Why don't you show me what you have learned so far?", 2, 1.5));

        return sentences;
    }

    _firstDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("Don't even bother", 2, 1.5));

        return sentences;
    }

    _secondTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("After our last time together", 1, 0));
        sentences.push(new Sentence("I see you have tried many things"));
        sentences.push(new Sentence("Were they worth your time?", 2, 1.5));

        return sentences;
    }

    _secondDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("Stop wasting my time too", 2, 1.5));

        return sentences;
    }

    _thirdTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("I've watched you jump from one thing to another", 1, 0));
        sentences.push(new Sentence("hoping to find what's yours"));
        sentences.push(new Sentence("Don't you realize how meaningless this is?", 2, 1.5));

        return sentences;
    }

    _thirdDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("There is no purpose left for you", 2, 1.5));

        return sentences;
    }

    _mrNOTTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("enough is enough", 1, 0));

        return sentences;
    }

    _mrNOTDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("", 2, 1.5));

        return sentences;
    }

    _NOTENOUGHTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("You may think you are stronger now"));
        sentences.push(new Sentence("You may feel free from judgment itself"));
        sentences.push(new Sentence("You may fool yourself into believing this..."));
        sentences.push(new Sentence("But after all has been said and done", 0.75, 0));
        sentences.push(new Sentence("you KNOW", 0.75, 0));
        sentences.push(new Sentence("it will always be..."));
        sentences.push(new Sentence("NOT ENOUGH", 4, 4, true));

        return sentences;
    }

    _firstVentSetup() {
        return 0;
    }

    _firstEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 2));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.COIN, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FLOPPY_DISK, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MR_NOT_EVIDENCE, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.SHATTERED_COIN, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WAYFINDER, 5));

        return evidenceSetupList;
    }

    _secondVentSetup() {
        return 1;
    }

    _secondEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 2));

        return evidenceSetupList;
    }

    _thirdVentSetup() {
        return 2;
    }

    _thirdEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 2));

        return evidenceSetupList;
    }
}