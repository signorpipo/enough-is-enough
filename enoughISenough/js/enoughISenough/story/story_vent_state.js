class StoryVentState extends PP.State {
    constructor(storyIndex, evidenceSetupList) {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "   Vent");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(0.5, "end"));
        this._myFSM.addState("vent", this._updateVent.bind(this));
        this._myFSM.addState("clean", this._updateClean.bind(this));
        this._myFSM.addState("defeat", this._updateDefeat.bind(this));
        this._myFSM.addState("second_wait", new PP.TimerState(0.5, "end"));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "vent", "end", this._prepareVent.bind(this));
        this._myFSM.addTransition("vent", "clean", "end", this._prepareClean.bind(this));
        this._myFSM.addTransition("vent", "defeat", "defeat", this._prepareDefeat.bind(this));
        this._myFSM.addTransition("clean", "done", "end", this._ventCompleted.bind(this));
        this._myFSM.addTransition("defeat", "done", "end", this._ventLost.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myFSM.init("init");

        this._myParentFSM = null;

        this._myEvidenceManager = new EvidenceManager(evidenceSetupList);
    }

    update(dt, fsm) {
        Global.myVentDuration += dt;

        this._myFSM.update(dt);
        this._myEvidenceManager.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(1)) {
                this._myFSM.init("init");
                this._myParentFSM.perform("end");
            }

            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(1)) {
                this._myFSM.init("init");
                this._myParentFSM.perform("defeat");
            }
        }
    }

    _prepareState(fsm, transition) {
        transition.myToState.myObject.start(fsm, transition);
        Global.myVentDuration = 0;
    }

    _prepareVent() {
        this._myEvidenceManager.start();
    }

    _updateVent(dt, fsm) {

    }

    _prepareClean() {
        this._myEvidenceManager.clean();
    }

    _updateClean(dt, fsm) {

    }

    _prepareDefeat() {
        this._myEvidenceManager.explode();
    }

    _updateDefeat(dt, fsm) {

    }

    _ventCompleted() {
        this._myParentFSM.perform("end");
    }

    _ventLost(dt, fsm) {
        this._myParentFSM.perform("defeat");
    }

    _startFight() {
        this._myParentFSM.perform("end");
    }

    start(fsm, transition) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
    }
}