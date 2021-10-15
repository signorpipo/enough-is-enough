class FirstFightState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "   Fight");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("fight", this._updateFight.bind(this));
        this._myFSM.addState("clean", this._updateClean.bind(this));
        this._myFSM.addState("defeat", this._updateDefeat.bind(this));
        this._myFSM.addState("second_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "fight", "end", this._prepareFight.bind(this));
        this._myFSM.addTransition("fight", "clean", "end", this._prepareClean.bind(this));
        this._myFSM.addTransition("fight", "defeat", "defeat", this._prepareDefeat.bind(this));
        this._myFSM.addTransition("clean", "done", "end", this._fightCompleted.bind(this));
        this._myFSM.addTransition("defeat", "done", "end", this._fightLost.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
    }

    _prepareState(fsm, transition) {
        transition.myToState.myObject.start(fsm, transition);
    }

    _prepareFight() {

    }

    _updateFight(dt, fsm) {

    }

    _prepareClean() {

    }

    _updateClean(dt, fsm) {

    }

    _prepareDefeat() {

    }

    _updateDefeat(dt, fsm) {

    }

    _fightCompleted() {
        this._myParentFSM.perform("end");
    }

    _fightLost(dt, fsm) {
        this._myParentFSM.perform("defeat");
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