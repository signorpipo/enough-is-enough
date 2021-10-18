class StoryState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Story");
        this._myFSM.addState("init");
        this._myFSM.addState("first_talk", new TalkState(this._firstTalkSentences(), false));
        this._myFSM.addState("first_vent", new StoryVentState(0));
        this._myFSM.addState("first_defeat", new TalkState(this._firstDefeatSentences(), true));
        this._myFSM.addState("second_talk", new TalkState(this._secondTalkSentences(), false));
        this._myFSM.addState("second_vent", new StoryVentState(0));
        this._myFSM.addState("second_defeat", new TalkState(this._secondDefeatSentences(), true));
        this._myFSM.addState("MrNOT_talk", new TalkState(this._mrNOTTalkSentences(), false));
        this._myFSM.addState("MrNOT_vent", new MrNOTVentState());
        this._myFSM.addState("MrNOT_defeat", new TalkState(this._mrNOTDefeatSentences(), true));
        this._myFSM.addState("it_will_always_be_not_enough", new TalkState(this._NOTENOUGHTalkSentences(), true));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "it_will_always_be_not_enough", "start");

        this._myFSM.addTransition("first_talk", "first_vent", "end");
        this._myFSM.addTransition("first_vent", "first_defeat", "defeat");
        this._myFSM.addTransition("first_vent", "second_talk", "end");

        this._myFSM.addTransition("second_talk", "second_vent", "end");
        this._myFSM.addTransition("second_vent", "second_defeat", "defeat");
        this._myFSM.addTransition("second_vent", "MrNOT_talk", "end");

        this._myFSM.addTransition("MrNOT_talk", "MrNOT_vent", "end");
        this._myFSM.addTransition("MrNOT_vent", "MrNOT_defeat", "defeat");
        this._myFSM.addTransition("MrNOT_vent", "it_will_always_be_not_enough", "end");

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end", this._backToMenu.bind(this));

        this._myFSM.addTransition("first_defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("second_defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("MrNOT_defeat", "done", "end", this._backToMenu.bind(this));

        this._myFSM.addTransition("done", "first_talk", "start");

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        if (Global.myDebugShortcutsEnabled && !(this._myFSM.isInState("first_vent") || this._myFSM.isInState("second_vent") || this._myFSM.isInState("MrNOT_vent"))) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(1)) {
                this._myFSM.init("init");
                fsm.perform(MainTransitions.End);
            }

            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(1)) {
                this._myFSM.perform("defeat");
            }
        }

        this._myFSM.update(dt);
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
        PP.SaveUtils.save("story_started_once", true);
    }

    _backToMenu(fsm) {
        this._myParentFSM.perform(MainTransitions.End);
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

    _mrNOTTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("I've watched you jump from one thing to another", 1, 0));
        sentences.push(new Sentence("hoping to find what's yours"));
        sentences.push(new Sentence("Don't you realize how meaningless this is?", 2, 1.5));

        return sentences;
    }

    _mrNOTDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("There is no purpose left for you", 2, 1.5));

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
}