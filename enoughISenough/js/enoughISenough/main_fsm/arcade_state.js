class ArcadeState extends PP.State {
    constructor(isDispute) {
        super();

        this._myIsDispute = isDispute;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "    Arcade");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(1.5, "end"));
        this._myFSM.addState("vent", new VentState(this._buildVentSetup(), this._buildEvidenceSetupList()));
        this._myFSM.addState("defeat", new ArcadeResultState(isDispute));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start");
        this._myFSM.addTransition("first_wait", "vent", "end");
        this._myFSM.addTransition("vent", "defeat", "defeat");
        this._myFSM.addTransition("vent", "defeat", "end");
        this._myFSM.addTransition("defeat", "done", "end", this._backToMenu.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start");

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        Global.myArcadeDuration += dt;
        if (this._myIsDispute) {
            Global.myStatistics.myDisputePlayTime += dt;
        } else {
            Global.myStatistics.myChatPlayTime += dt;
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
            Global.myStatistics.myDisputePlayCount += 1;
        } else {
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
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 1));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, 5));
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
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ETHEREUM, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, 5));

        return evidenceSetupList;
    }

    _disputeVentSetup() {
        let ventSetup = new VentSetup();

        ventSetup.myBreakSetup.myBreakDuration = new RangeValueOverTime([5, 6], [4, 5], 30, 120, false);
        ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 50], [50, 70], 30, 120, false);
        ventSetup.myBreakSetup.myBreakCloneCooldown = new RangeValueOverTime([10, 20], [20, 30], 30, 120, true);

        ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1, 2], 30, 120, false);
        ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([10, 20], [15, 20], 30, 120, false);
        ventSetup.mySmallBreakSetup.myBreakCloneCooldown = new RangeValueOverTime([4, 5], [8, 12], 30, 120, true);

        ventSetup.myCloneRotationSetup.mySpinSpeed = new RangeValue([4, 6], false);
        ventSetup.myCloneRotationSetup.mySpinChance = new RangeValueOverTime([1, 30], [1, 15], 60, 120, true);
        ventSetup.myCloneRotationSetup.mySpinStartTime = 60;
        ventSetup.myCloneRotationSetup.myTiltAngle = new RangeValueOverTime([0, 0], [0, 15], 60, 120, false);

        {
            let wave = new IAmHereWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            wave.myWaveAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;

            ventSetup.myWavesMap.set("I_Am_Here_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 5, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("I_Am_Here_Easy", nextWavesSetup);
        }

        {
            let wave = new IAmEverywhereWaveSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            wave.myMinAngleBetweenWaves = new RangeValue([40, 100]);
            wave.myTimeBetweenWaves = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);

            let iAmHereWave = new IAmHereWaveSetup();
            iAmHereWave.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            iAmHereWave.myWaveAngle = new RangeValue([20, 40]);
            iAmHereWave.myMinAngleBetweenClones = 10;
            iAmHereWave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            iAmHereWave.myFirstCloneInTheMiddle = true;

            wave.myWavesSetup.push([iAmHereWave, 1, "I_Am_Here"]);

            let queueForYou = new QueueForYouWaveSetup();

            queueForYou.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            queueForYou.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            queueForYou.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            queueForYou.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            queueForYou.myFirstCloneInTheMiddle = true;

            wave.myWavesSetup.push([queueForYou, 1, "Queue_For_You"]);

            ventSetup.myWavesMap.set("I_Am_Everywhere_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 1000, 0, null);
            nextWavesSetup.addWave("I_Am_Here_Easy", 0, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("I_Am_Everywhere_Easy", nextWavesSetup);
        }

        {
            let wave = new QueueForYouWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;

            ventSetup.myWavesMap.set("Queue_For_You_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 5, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("Queue_For_You_Easy", nextWavesSetup);
        }

        ventSetup.myFirstWave = "I_Am_Everywhere_Easy";

        return ventSetup;
    }

    _chatVentSetup() {
        return this._disputeVentSetup();
    }
}