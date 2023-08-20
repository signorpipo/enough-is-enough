class ArcadeState extends PP.State {
    constructor(isDispute) {
        super();

        this._myIsDispute = isDispute;

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "    Arcade");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(0, "end"));
        this._myFSM.addState("vent", new VentState(this._buildVentSetup(), this._buildEvidenceSetupList()));
        this._myFSM.addState("defeat", new ArcadeResultState(isDispute));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start");
        this._myFSM.addTransition("first_wait", "vent", "end");
        this._myFSM.addTransition("vent", "defeat", "lost");
        this._myFSM.addTransition("vent", "defeat", "completed");
        this._myFSM.addTransition("defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start");

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        if (!this._myFSM.isInState("defeat")) {
            Global.myArcadeDuration += dt;
            if (this._myIsDispute) {
                Global.myStatistics.myDisputePlayTime += dt;
            } else {
                Global.myStatistics.myChatPlayTime += dt;
            }
        }

        this._myFSM.update(dt);
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
        Global.myArcadeDuration = 0;

        if (this._myIsDispute) {
            Global.sendAnalytics("event", "arcade_dispute_started", {
                "value": 1
            });

            Global.myStatistics.myDisputePlayCount += 1;
        } else {
            Global.sendAnalytics("event", "arcade_chat_started", {
                "value": 1
            });

            Global.myStatistics.myChatPlayCount += 1;
        }
    }

    end(fsm, transitionID) {
    }

    _backToMenu(fsm) {
        this._myParentFSM.perform(MainTransitions.End);
    }

    _buildVentSetup() {
        if (this._myIsDispute) {
            return this._disputeVentSetup();
        }

        return this._chatVentSetup();
    }

    //Evidences that appear later in the trial appear later in time in the arcade
    _buildEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VENT_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, new ValueOverTime(3, 0, 60, 120, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, new ValueOverTime(1, 3, 60, 120, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        let secondStarTime = 40;
        let secondEndTime = 80;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));

        let thirdStarTime = 90;
        let thirdEndTime = 130;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.SHATTERED_COIN, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MR_NOT_EVIDENCE, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));

        let lastStarTime = 140;
        let lastEndTime = 180;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WAYFINDER, new ValueOverTime(0, 5, lastStarTime, lastEndTime, true)));

        return evidenceSetupList;
    }
}