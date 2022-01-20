class VentState extends PP.State {
    constructor(ventSetup, evidenceSetupList) {
        super();

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "        Vent State");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(1.5, "end"));
        this._myFSM.addState("vent", this._updateVent.bind(this));
        this._myFSM.addState("clean", this._updateClean.bind(this));
        this._myFSM.addState("defeat", this._updateDefeat.bind(this));
        this._myFSM.addState("second_wait_clean", new PP.TimerState(0, "end"));
        this._myFSM.addState("second_wait_defeat", new PP.TimerState(0, "end"));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "vent", "end", this._prepareVent.bind(this));
        this._myFSM.addTransition("vent", "clean", "end", this._prepareClean.bind(this));
        this._myFSM.addTransition("vent", "defeat", "defeat", this._prepareDefeat.bind(this));
        this._myFSM.addTransition("clean", "second_wait_clean", "end");
        this._myFSM.addTransition("defeat", "second_wait_defeat", "end");
        this._myFSM.addTransition("second_wait_clean", "done", "end", this._ventCompleted.bind(this));
        this._myFSM.addTransition("second_wait_defeat", "done", "end", this._ventLost.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myFSM.addTransition("init", "done", "skip");
        this._myFSM.addTransition("first_wait", "done", "skip");
        this._myFSM.addTransition("second_wait_clean", "done", "skip");
        this._myFSM.addTransition("second_wait_defeat", "done", "skip");
        this._myFSM.addTransition("vent", "done", "skip", this._hideVent.bind(this));
        this._myFSM.addTransition("clean", "done", "skip", this._hideVent.bind(this));
        this._myFSM.addTransition("defeat", "done", "skip", this._hideVent.bind(this));

        this._myFSM.init("init");

        this._myParentFSM = null;

        this._myEvidenceManager = new EvidenceManager(evidenceSetupList);

        this._myVent = new Vent(ventSetup);
        this._myVent.onVentLost(this._onVentLost.bind(this));
        this._myVent.onVentCompleted(this._onVentCompleted.bind(this));

        this._myNotEnough = new NotEnough();
    }

    update(dt, fsm) {
        Global.myVentDuration += dt;

        this._myFSM.update(dt);
        this._myEvidenceManager.update(dt);
        this._myVent.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("skip");
                this._ventCompleted();
            }

            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("skip");
                this._ventLost();
            }
        }
    }

    _prepareState(fsm, transition) {
        Global.myVentDuration = 0;
    }

    _prepareVent() {
        this._myEvidenceManager.start();
        this._myVent.start();
    }

    _updateVent(dt, fsm) {
    }

    _prepareClean() {
        this._myEvidenceManager.clean();
        this._myVent.clean();
    }

    _updateClean(dt, fsm) {
        if (this._myEvidenceManager.isDone() && this._myVent.isDone()) {
            this._myFSM.perform("end");
        }
    }

    _prepareDefeat() {
        let zestyObject = Global.myGameObjects.get(GameObjectType.ZESTY_MARKET);
        let grabbable = zestyObject.pp_getComponentHierarchy("pp-grabbable");
        if (grabbable.isGrabbed()) {
            let zestyComponent = zestyObject.pp_getComponentHierarchy("zesty-banner");
            if (zestyComponent) {
                Global.myZestyToClick = zestyComponent;
            }
        }

        this._myEvidenceManager.explode();
        this._myVent.stop();
        this._myNotEnough.start();
        Global.myParticlesManager.mrNOTParticles(Global.myPlayerPosition);
    }

    _updateDefeat(dt, fsm) {
        this._myNotEnough.update(dt);

        if (this._myEvidenceManager.isDone() && !this._myNotEnough.isNotEnoughing()) {
            this._myFSM.perform("end");
        }
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

    _hideVent() {
        this._hideEvidences();
        this._myVent.stop();
    }

    _hideEvidences() {
        this._myEvidenceManager.hide();
    }

    start(fsm, transition) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
        if (!this._myFSM.isInState("done")) {
            this._myFSM.perform("skip");
        }
    }

    _onVentLost() {
        this._myFSM.perform("defeat");
    }

    _onVentCompleted() {
        this._myFSM.perform("end");
    }
}