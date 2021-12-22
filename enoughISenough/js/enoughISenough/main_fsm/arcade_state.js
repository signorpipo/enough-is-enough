class ArcadeState extends PP.State {
    constructor(isHard) {
        super();

        this._myIsHard = isHard;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "    Arcade");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(1.5, "end"));
        this._myFSM.addState("vent", new VentState(this._buildVentSetup(), this._buildEvidenceSetupList()));
        this._myFSM.addState("defeat", new ArcadeResultState(isHard));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start");
        this._myFSM.addTransition("first_wait", "vent", "end");
        this._myFSM.addTransition("vent", "defeat", "defeat");
        this._myFSM.addTransition("defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start");

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        Global.myArcadeDuration += dt;

        this._myFSM.update(dt);
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
        Global.myArcadeDuration = 0;
    }

    end(fsm, transitionID) {
    }

    _backToMenu(fsm) {
        this._myParentFSM.perform(MainTransitions.End);
    }

    _buildVentSetup() {
        if (this._myIsHard) {
            return 0;
        }

        return 1;
    }

    //Evidences that appear later in the story appear later in time in the arcade
    _buildEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STORY_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.SKATE, 5));
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
}