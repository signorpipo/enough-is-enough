class FirstTalkState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "   Talk");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("mr_not_appear", this._updateMrNOTAppear.bind(this));
        this._myFSM.addState("talk", this._updateTalk.bind(this));
        this._myFSM.addState("mr_not_disappear", this._updateMrNOTDisappear.bind(this));
        this._myFSM.addState("second_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "mr_not_appear", "end", this._prepareMrNOTAppear.bind(this));
        this._myFSM.addTransition("mr_not_appear", "talk", "end", this._prepareTalk.bind(this));
        this._myFSM.addTransition("talk", "mr_not_disappear", "end", this._prepareMrNOTDisappear.bind(this));
        this._myFSM.addTransition("mr_not_disappear", "second_wait", "end");
        this._myFSM.addTransition("second_wait", "done", "end", this._startFight.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
    }

    _prepareState() {

    }

    _prepareMrNOTAppear() {

    }

    _updateMrNOTAppear(dt, fsm) {

    }

    _prepareTalk() {

    }

    _updateTalk(dt, fsm) {

    }

    _prepareMrNOTDisappear() {

    }

    _updateMrNOTDisappear(dt, fsm) {

    }

    _startFight() {
        this._myParentFSM.perform("end");
    }

    start(fsm, transition) {
        this._myParentFSM = fsm;
        this._myFSM.init("start");
    }

    end(fsm, transitionID) {
    }
}