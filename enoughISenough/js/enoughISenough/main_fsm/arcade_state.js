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

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
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

        let secondStarTime = 25;
        let secondEndTime = 80;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, new ValueOverTime(0, 5, secondStarTime, secondEndTime, true)));

        let thirdStarTime = 80;
        let thirdEndTime = 135;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, new ValueOverTime(0, 5, thirdStarTime, thirdEndTime, true)));

        let lastStarTime = 135;
        let lastEndTime = 190;
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WAYFINDER, new ValueOverTime(0, 5, lastStarTime, lastEndTime, true)));

        return evidenceSetupList;
    }

    _disputeVentSetup() {
        let ventSetup = new VentSetup();

        ventSetup.myBreakSetup.myBreakDuration = new RangeValueOverTime([5, 6], [4, 5], 30, 180, false);
        ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 50], [50, 70], 30, 180, false);
        ventSetup.myBreakSetup.myBreakCloneCooldown = new RangeValueOverTime([30, 40], [30, 40], 30, 180, true);

        ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1, 2], 30, 180, false);
        ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([15, 20], [15, 20], 30, 180, false);
        ventSetup.mySmallBreakSetup.myBreakCloneCooldown = new RangeValueOverTime([10, 20], [10, 20], 30, 180, true);

        ventSetup.myCloneRotationSetup.mySpinSpeed = new RangeValue([4, 6], false);
        ventSetup.myCloneRotationSetup.mySpinChance = new RangeValueOverTime([1, 30], [1, 15], 60, 180, true);
        ventSetup.myCloneRotationSetup.mySpinStartTime = 60;
        ventSetup.myCloneRotationSetup.myTiltAngle = new RangeValueOverTime([0, 0], [0, 15], 60, 120, false);

        {
            let wave = new IAmHereWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 4], 0, 30, true);
            wave.mySpawnConeAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;
            wave.myWaveStartAngle = new RangeValue([0, 180]);

            ventSetup.myWavesMap.set("I_Am_Here_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 10, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("I_Am_Here_Easy", nextWavesSetup);
        }

        {
            let wave = new IAmEverywhereWaveSetup();

            wave.myWavesCount = new RangeValueOverTime([1, 3], [1, 4], 0, 30, true);
            wave.myMinAngleBetweenWaves = new RangeValue([40, 100]);
            wave.myTimeBetweenWaves = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);

            let iAmHereWave = new IAmHereWaveSetup();
            iAmHereWave.myClonesCount = new RangeValueOverTime([1, 3], [1, 4], 0, 30, true);
            iAmHereWave.mySpawnConeAngle = new RangeValue([20, 40]);
            iAmHereWave.myMinAngleBetweenClones = 10;
            iAmHereWave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            iAmHereWave.myFirstCloneInTheMiddle = true;

            wave.myWavesSetup.push([iAmHereWave, 1, "I_Am_Here"]);

            let queueForYou = new QueueForYouWaveSetup();

            queueForYou.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            queueForYou.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            queueForYou.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            queueForYou.myFirstCloneInTheMiddle = true;


            ventSetup.myWavesMap.set("I_Am_Everywhere_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 10, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 10, 0, null);
            ventSetup.myNextWavesMap.set("I_Am_Everywhere_Easy", nextWavesSetup);
        }

        {
            let wave = new QueueForYouWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 4], 0, 30, true);
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 3], [1, 3], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySameTimeBetweenClones = new RangeValueOverTime([-1, -1], [-1, -1], 0, 0, false); // >= 0 means true

            ventSetup.myWavesMap.set("Queue_For_You_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 11230, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 10, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("Queue_For_You_Easy", nextWavesSetup);
        }

        {
            let wave = new MerryGoRoundSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 7], [3, 7], 0, 30, true);
            wave.myAngleBetweenWaves = new RangeValue([15, 25]);
            wave.myTimeBetweenWaves = new RangeValueOverTime([1, 4], [1, 4], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySameTimeBetweenWaves = 1;

            let queueForYou = new QueueForYouWaveSetup();
            queueForYou.myClonesCount = new RangeValueOverTime([3, 3], [3, 4], 0, 30, true);
            queueForYou.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            queueForYou.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            queueForYou.myFirstCloneInTheMiddle = true;
            //wave.myWavesSetup.push([queueForYou, 1, "Queue_For_You"]);

            ventSetup.myWavesMap.set("Merry_Go_Round_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 1230, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("Merry_Go_Round_Easy", nextWavesSetup);
        }

        {
            let wave = new GiveUsAHugSetup();

            wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 3], 0, 30, true);
            wave.mySpawnConeAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;
            wave.myWaveStartAngle = new RangeValue([0, 180]);

            wave.myHugSize = new RangeValueOverTime([2, 3], [2, 3], 0, 0, true);
            wave.myHugAngle = new RangeValueOverTime([30, 70], [30, 70], 0, 0, false);
            wave.myEqualDistance = true;
            wave.myMinAngleBetweenClonesHugging = new RangeValueOverTime([10, 10], [10, 10], 0, 0, false);

            ventSetup.myWavesMap.set("Give_Us_A_Hug_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 10, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 10, 0, null);

            ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Easy", nextWavesSetup);
        }

        {
            let wave = new ManInTheMiddleSetup();

            wave.myWavesCount = new RangeValueOverTime([1, 3], [1, 4], 0, 30, true);
            wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [2, 2.5], 0, 0, false);
            wave.myTimeBeforeOpposite = new RangeValueOverTime([0.5, 1], [0.5, 1], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySameTimeBetweenWaves = -1;

            let queueForYou = new QueueForYouWaveSetup();
            queueForYou.myClonesCount = new RangeValueOverTime([1, 2], [1, 2], 0, 30, true);
            queueForYou.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            queueForYou.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            queueForYou.myFirstCloneInTheMiddle = true;
            //wave.myWavesSetup.push([queueForYou, 1, "Queue_For_You"]);

            ventSetup.myWavesMap.set("Man_In_The_Middle_Easy", wave);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("I_Am_Here_Easy", 10, 0, null);
            nextWavesSetup.addWave("I_Am_Everywhere_Easy", 10, 0, null);
            nextWavesSetup.addWave("Queue_For_You_Easy", 10, 0, null);
            nextWavesSetup.addWave("Merry_Go_Round_Easy", 10, 0, null);
            nextWavesSetup.addWave("Give_Us_A_Hug_Easy", 10, 0, null);
            nextWavesSetup.addWave("Man_In_The_Middle_Easy", 12310, 0, null);

            ventSetup.myNextWavesMap.set("Man_In_The_Middle_Easy", nextWavesSetup);
        }

        ventSetup.myFirstWave = "Merry_Go_Round_Easy";
        ventSetup.myValidAngleRanges = [new RangeValue([-180, 0]), new RangeValue([0, 180])];

        return ventSetup;
    }

    _chatVentSetup() {
        return this._disputeVentSetup();
    }
}