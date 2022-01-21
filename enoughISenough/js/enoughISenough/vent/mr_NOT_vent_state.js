class MrNOTVentState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "        mr NOT Vent");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(0, "end"));
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

        this._myEvidenceManager = new EvidenceManager(this._buildEvidenceSetupList());
        this._myNotEnough = new NotEnough();
        this._myMrNOT = new MrNOT(this._onPatienceOver.bind(this), this._onReach.bind(this), this._onExplosionDone.bind(this));

        this._myCleanTimer = new PP.Timer(2.75);
    }

    update(dt, fsm) {
        Global.myVentDuration += dt;

        this._myFSM.update(dt);
        this._myEvidenceManager.update(dt);
        this._myMrNOT.update(dt);

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
        Global.myLightFadeInTime = 0;
        Global.myVentDuration = 0;
    }

    _prepareVent() {
        this._myEvidenceManager.start();
        this._myMrNOT.start();
    }

    _updateVent(dt, fsm) {
    }

    _prepareClean() {
        this._myCleanTimer.start();
    }

    _updateClean(dt, fsm) {
        if (this._myCleanTimer.isRunning()) {
            this._myCleanTimer.update(dt);
            if (this._myCleanTimer.isDone()) {
                this._myEvidenceManager.clean();
            }
        }

        if (this._myMrNOT.isDone()) {
            this._myFSM.perform("end");
        }
    }

    _prepareDefeat() {
        this._myEvidenceManager.explode();
        this._myMrNOT.hide();
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
        this._myMrNOT.hide();
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

    _buildEvidenceSetupList() {
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

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, 5));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WAYFINDER, 30));

        return evidenceSetupList;
    }

    _onPatienceOver() {
        this._myFSM.perform("end");
    }

    _onReach() {
        this._myFSM.perform("defeat");
    }

    _onExplosionDone() {
    }
}