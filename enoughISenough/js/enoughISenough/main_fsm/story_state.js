class StoryState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Story");
        this._myFSM.addState("init");
        this._myFSM.addState("first_talk");
        this._myFSM.addState("first_fight");
        this._myFSM.addState("first_defeat");
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

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end");

        this._myFSM.addTransition("first_defeat", "done", "end");
        this._myFSM.addTransition("second_defeat", "done", "end");
        this._myFSM.addTransition("third_defeat", "done", "end");

        this._myFSM.addTransition("done", "first_talk", "start");

        this._myFSM.init("init");
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

        //TEMP REMOVE THIS
        if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(1)) {
            this._myFSM.init("init");
            fsm.perform(MainTransitions.End);
        }
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
        PP.SaveUtils.save("story_started_once", true);
    }
}