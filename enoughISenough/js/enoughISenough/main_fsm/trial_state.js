class TrialState extends PP.State {
    constructor() {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "    Trial");
        this._myFSM.addState("init");
        this._myFSM.addState("first_talk", new TalkState(this._firstTalkSentences(), false));
        this._myFSM.addState("first_vent", new VentState(this._firstVentSetup(), this._firstEvidenceSetupList()));
        this._myFSM.addState("first_defeat", new TalkState(this._firstDefeatSentences(), true));
        this._myFSM.addState("second_talk", new TalkState(this._secondTalkSentences(), false));
        this._myFSM.addState("second_vent", new VentState(this._secondVentSetup(), this._secondEvidenceSetupList()));
        this._myFSM.addState("second_defeat", new TalkState(this._secondDefeatSentences(), true));
        this._myFSM.addState("third_talk", new TalkState(this._thirdTalkSentences(), false));
        this._myFSM.addState("third_vent", new VentState(this._thirdVentSetup(), this._thirdEvidenceSetupList()));
        this._myFSM.addState("third_defeat", new TalkState(this._thirdDefeatSentences(), true));
        this._myFSM.addState("MrNOT_talk", new TalkState(this._mrNOTTalkSentences(), true));
        this._myFSM.addState("MrNOT_vent", new MrNOTVentState());
        this._myFSM.addState("MrNOT_defeat", new TalkState(this._mrNOTDefeatSentences(), true));
        this._myFSM.addState("it_will_always_be_not_enough", new TalkState(this._NOTENOUGHTalkSentences(), true));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_talk", "start_1");
        this._myFSM.addTransition("init", "second_talk", "start_2");
        this._myFSM.addTransition("init", "third_talk", "start_3");

        this._myFSM.addTransition("first_talk", "first_vent", "end");
        this._myFSM.addTransition("first_vent", "first_defeat", "defeat");
        this._myFSM.addTransition("first_vent", "second_talk", "end");

        this._myFSM.addTransition("second_talk", "second_vent", "end");
        this._myFSM.addTransition("second_vent", "second_defeat", "defeat");
        this._myFSM.addTransition("second_vent", "third_talk", "end");

        this._myFSM.addTransition("third_talk", "third_vent", "end");
        this._myFSM.addTransition("third_vent", "third_defeat", "defeat");
        this._myFSM.addTransition("third_vent", "MrNOT_talk", "end");

        this._myFSM.addTransition("MrNOT_talk", "MrNOT_vent", "end");
        this._myFSM.addTransition("MrNOT_vent", "MrNOT_defeat", "defeat");
        this._myFSM.addTransition("MrNOT_vent", "it_will_always_be_not_enough", "end");

        this._myFSM.addTransition("it_will_always_be_not_enough", "done", "end", this._gameCompleted.bind(this));

        this._myFSM.addTransition("first_defeat", "done", "end", this._backToMenu.bind(this, 1));
        this._myFSM.addTransition("second_defeat", "done", "end", this._backToMenu.bind(this, 2));
        this._myFSM.addTransition("third_defeat", "done", "end", this._backToMenu.bind(this, 3));
        this._myFSM.addTransition("MrNOT_defeat", "done", "end", this._backToMenu.bind(this, 3));

        this._myFSM.addTransition("done", "first_talk", "start_1");
        this._myFSM.addTransition("done", "second_talk", "start_2");
        this._myFSM.addTransition("done", "third_talk", "start_3");

        let states = this._myFSM.getStates();
        for (let state of states) {
            this._myFSM.addTransition(state.myID, "done", "skip", this._backToMenu.bind(this, 1));
        }

        this._myFSM.init("init");

        this._myParentFSM = null;
    }

    update(dt, fsm) {
        Global.myTrialDuration += dt;
        Global.myStatistics.myTrialPlayTime += dt;

        this._myFSM.update(dt);
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;
        Global.myTrialDuration = 0;
        this._myTrialStartedFromBegin = true;
        Global.myStatistics.myTrialPlayCount += 1;

        let trialLevel = PP.SaveUtils.loadNumber("trial_level", 1);
        let transition = "start_".concat(trialLevel);
        this._myFSM.perform(transition);

    }

    end(fsm, transitionID) {
        PP.SaveUtils.save("trial_started_once", true);
    }

    _backToMenu(trialLevel, fsm) {
        this._myParentFSM.perform(MainTransitions.End);
        PP.SaveUtils.save("trial_level", trialLevel);
    }

    _gameCompleted(fsm) {
        if (this._myTrialStartedFromBegin) {
            if (Global.myStatistics.myTrialBestTime < 0 || Global.myTrialDuration < Global.myStatistics.myTrialBestTime) {
                Global.myStatistics.myTrialBestTime = Global.myTrialDuration;
            }
        }

        PP.SaveUtils.save("trial_level", 1);
        PP.SaveUtils.save("trial_completed", true);
        this._myParentFSM.perform(MainTransitions.End);
        Global.myStatistics.myTrialCompletedCount += 1;
    }

    _firstTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("Glad to see you again"));
        sentences.push(new Sentence("Maybe we can have a little conversation"));
        sentences.push(new Sentence("Why don't you show me what you have learned so far?", 2, 1.5));

        return sentences;
    }

    _firstDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("Don't even bother", 2, 1.5));

        return sentences;
    }

    _secondTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("After our last time together", 1, 0));
        sentences.push(new Sentence("I see you have tried many things"));
        sentences.push(new Sentence("Were they worth your time?", 2, 1.5));

        return sentences;
    }

    _secondDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("Stop wasting my time too", 2, 1.5));

        return sentences;
    }

    _thirdTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("I've watched you jump from one thing to another", 1, 0));
        sentences.push(new Sentence("hoping to find what's yours"));
        sentences.push(new Sentence("Don't you realize how meaningless this is?", 2, 1.5));

        return sentences;
    }

    _thirdDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("There is no purpose left for you", 2, 1.5));

        return sentences;
    }

    _mrNOTTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("enough is enough", 1, 0));

        return sentences;
    }

    _mrNOTDefeatSentences() {
        let sentences = [];

        sentences.push(new Sentence("", 2, 1.5));

        return sentences;
    }

    _NOTENOUGHTalkSentences() {
        let sentences = [];

        sentences.push(new Sentence("You may think you are stronger now"));
        sentences.push(new Sentence("You may feel free from others' judgment", 1, 0));
        sentences.push(new Sentence("and from your own"));
        sentences.push(new Sentence("You may fool yourself into believing this..."));
        sentences.push(new Sentence("But after all has been said and done", 0.75, 0));
        sentences.push(new Sentence("you KNOW", 0.75, 0));
        sentences.push(new Sentence("it will always be..."));
        sentences.push(new Sentence("NOT ENOUGH", 4, 4, true));

        return sentences;
    }

    _firstVentSetup() {
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
            wave.myWaveAngle = new RangeValue([20, 40]);
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
            iAmHereWave.myWaveAngle = new RangeValue([20, 40]);
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
            wave.myWaveAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
            wave.myTimeBetweenClones = new RangeValueOverTime([1, 2], [1, 1.5], 0, 0, false);
            wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 4], 0, 0, false);
            wave.myFirstCloneInTheMiddle = true;
            wave.myWaveStartAngle = new RangeValue([0, 180]);

            wave.myHugSize = new RangeValueOverTime([2, 3], [2, 3], 0, 0, true);
            wave.myHugAngle = new RangeValueOverTime([30, 70], [30, 70], 0, 0, false);
            wave.mySkipLastCloneHugging = false;
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

    _firstEvidenceSetupList() {
        let evidenceSetupList = [];

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TRIAL_TIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ZESTY_MARKET, 3));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TUCIA_DRAWING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.CPLUSPLUS_PRIMER, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PIANO, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MICCO_THE_BEAR, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WATER_LILY, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.LOL, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.DRINK_ME_EARRING, 5));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 1));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        return evidenceSetupList;
    }

    _secondVentSetup() {
        return 1;
    }

    _secondEvidenceSetupList() {
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
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.STARING_CUBE, 2));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.TROPHY, 5));

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERMELON, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PSI, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.WONDERLAND, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.VR, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EGGPLANT, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.PICO_8, 7));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.EVERYEYE, 7));

        return evidenceSetupList;
    }

    _thirdVentSetup() {
        return 2;
    }

    _thirdEvidenceSetupList() {
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

        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ANT_MAIN_CHARACTER, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HEART, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.HALO_SWORD, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FOX, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.FAMILY, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.MIRROR, 10));
        evidenceSetupList.push(new EvidenceSetup(GameObjectType.ALOE_VERA, 10));

        return evidenceSetupList;
    }
}