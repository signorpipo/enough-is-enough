class StoryState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Story");
        this._myFSM.addState("init");
        this._myFSM.addState("first_talk", new TalkState(this._firstTalkSentences(), false));
        this._myFSM.addState("first_fight");
        this._myFSM.addState("first_defeat", new TalkState(this._firstDefeatSentences(), true));
        this._myFSM.addState("second_talk");
        this._myFSM.addState("second_fight");
        this._myFSM.addState("second_defeat");
        this._myFSM.addState("third_talk");
        this._myFSM.addState("third_fight");
        this._myFSM.addState("third_defeat");
        this._myFSM.addState("MrNOT_talk");
        this._myFSM.addState("MrNOT");
        this._myFSM.addState("MrNOT_defeat");
        this._myFSM.addState("it_will_always_be_not_enough");
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_talk", "start");

        this._myFSM.addTransition("first_talk", "first_fight", "end");
        this._myFSM.addTransition("first_fight", "first_defeat", "defeat");
        this._myFSM.addTransition("first_fight", "second_talk", "end");

        this._myFSM.addTransition("second_talk", "second_fight", "end");
        this._myFSM.addTransition("second_fight", "second_defeat", "defeat");
        this._myFSM.addTransition("second_fight", "third_talk", "end");

        this._myFSM.addTransition("third_talk", "third_fight", "end");
        this._myFSM.addTransition("third_fight", "third_defeat", "defeat");
        this._myFSM.addTransition("third_fight", "MrNOT_talk", "end");

        this._myFSM.addTransition("MrNOT_talk", "MrNOT", "defeat");
        this._myFSM.addTransition("MrNOT", "it_will_always_be_not_enough", "end");
        this._myFSM.addTransition("MrNOT", "MrNOT_defeat", "defeat");

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end", this._backToMenu.bind(this));

        this._myFSM.addTransition("first_defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("second_defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("third_defeat", "done", "end", this._backToMenu.bind(this));

        this._myFSM.addTransition("done", "first_talk", "start");

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

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

        sentences.push("Glad to see you again");
        sentences.push("Maybe we can have a little conversation");
        sentences.push("Why don't you show me what you have learned so far?");

        return sentences;
    }

    _firstDefeatSentences() {
        let sentences = [];

        sentences.push("Don't even bother");

        return sentences;
    }
}