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
        this._myMrNOT = new MrNOT(this._onPatienceOver.bind(this), this._onReach.bind(this), this._onExplosionDone.bind(this));
        this._myVent = new Vent(this._buildVentSetup());
        this._myVent.onVentLost(this._onReach.bind(this));
        this._myNotEnough = new NotEnough();

        this._myCleanTimer = new PP.Timer(2.75);
        this._myEvidenceTimer = new PP.Timer(1);
    }

    update(dt, fsm) {
        Global.myVentDuration += dt;

        this._myFSM.update(dt);
        this._myEvidenceManager.update(dt);
        this._myVent.update(dt);
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
        this._myNotEnough.stop();
    }

    _prepareVent() {
        this._myMrNOT.start();
        this._myEvidenceTimer.start();
        this._myVent.start();
    }

    _updateVent(dt, fsm) {
        if (this._myEvidenceTimer.isRunning()) {
            this._myEvidenceTimer.update(dt);
            if (this._myEvidenceTimer.isDone()) {
                this._myEvidenceManager.start();
            }
        }

    }

    _prepareClean() {
        this._myCleanTimer.start();
        this._myVent.clean(this._myCleanTimer.getDuration());
    }

    _updateClean(dt, fsm) {
        if (this._myCleanTimer.isRunning()) {
            this._myCleanTimer.update(dt);
            if (this._myCleanTimer.isDone()) {
                this._myEvidenceManager.clean();
            }
        }

        if (this._myMrNOT.isDone() && this._myEvidenceManager.isDone() && this._myVent.isDone()) {
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

        this._myVent.stop();
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
        this._myVent.stop();
        this._myNotEnough.stop();
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
        this._myVent.ventLostDebug();
        this._myFSM.perform("defeat");
    }

    _onExplosionDone() {
    }

    _buildVentSetup() {
        let ventSetup = new VentSetup();

        ventSetup.myIsEndless = true;

        ventSetup.myBreakSetup.myBreakDuration = new RangeValue([2, 3]);
        ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([20, 25], [20, 25], 10, 30, false);
        ventSetup.myBreakSetup.myBreakCloneCooldown = 5;

        ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([1, 2], [1, 2], 10, 30, false);
        ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([800, 1200], [800, 1200], 10, 30, false);
        ventSetup.mySmallBreakSetup.myBreakCloneCooldown = 3;

        ventSetup.myCloneRotationSetup.mySpinSpeed = new RangeValue([4, 6], false);
        ventSetup.myCloneRotationSetup.mySpinChance = new RangeValueOverTime([1, 12], [1, 4], 25, 50, true);
        ventSetup.myCloneRotationSetup.mySpinStartTime = 25;

        ventSetup.myCloneRotationSetup.myTiltAngle = new RangeValueOverTime([0, 10], [0, 15], 15, 35, false);
        ventSetup.myCloneRotationSetup.myTiltChance = new RangeValueOverTime([1, 6], [1, 2], 15, 35, true);
        ventSetup.myCloneRotationSetup.myTiltStartTime = 15;

        ventSetup.myValidAngleRanges =
            [[new RangeValueOverTime([30, 180], [90, 180], PP.myEasyTuneVariables.get("Time To Reach Target") / 5, PP.myEasyTuneVariables.get("Time To Reach Target")), [0, 0, -1]],
            [new RangeValueOverTime([-180, -30], [-180, -90], PP.myEasyTuneVariables.get("Time To Reach Target") / 5, PP.myEasyTuneVariables.get("Time To Reach Target")), [0, 0, -1]]];

        let multipliers = new VentRuntimeMultipliers();

        multipliers.mySpawnTimeMultiplier = 1;
        multipliers.myDoneTimeMultiplier = 1;
        multipliers.myBreakTimeMultiplier = 1;
        multipliers.myBreakDelayTimeMultiplier = 1;
        multipliers.mySmallBreakTimeMultiplier = 1;
        multipliers.mySmallBreakDelayTimeMultiplier = 1;

        ventSetup.myVentMultipliers = multipliers;

        ventSetup.myDelayBeforeStart = 7;

        let timeBetweenClones = new RangeValueOverTime([2, 3], [1.5, 2.5], 10, 30, false);
        let doneDelay = new RangeValueOverTime([2.5, 4], [2, 3], 10, 30, false);

        {
            let wave = new IAmHereWaveSetup();

            wave.myClonesCount = new RangeValue([2, 3], true);
            wave.myWaveStartAngle = new RangeValue([35, 45]);
            wave.mySpawnConeAngle = new RangeValue([20, 30]);
            wave.myMinAngleBetweenClones = 10;
            wave.myTimeBetweenClones = new RangeValue([2, 3]);
            wave.myDoneDelay = new RangeValue([2.5, 4]);
            wave.myFirstCloneInTheMiddle = true;

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("I_Am_Here_mr_NOT_Side", wave);
            ventSetup.myNextWavesMap.set("I_Am_Here_mr_NOT_Side", nextWavesSetup);
        }

        {
            let wave = new IAmHereWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 5], 10, 30, true);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySpawnConeAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myTimeBetweenClones = timeBetweenClones;
            wave.myDoneDelay = doneDelay;
            wave.myFirstCloneInTheMiddle = true;

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("I_Am_Here", wave);
            ventSetup.myNextWavesMap.set("I_Am_Here", nextWavesSetup);
        }

        {
            let wave = new IAmEverywhereWaveSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 5], 10, 30, true);
            wave.myAngleBetweenWaves = new RangeValueOverTime([70, 120], [70, 120], 10, 30, false);
            wave.myTimeBetweenWaves = timeBetweenClones;
            wave.myDoneDelay = new RangeValueOverTime([3, 4], [2.5, 3], 10, 30, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
            ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
        }

        {
            let wave = new MerryGoRoundSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 5], [4, 6], 10, 30, true);
            wave.myAngleBetweenWaves = new RangeValue([15, 25]);
            wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1.5, 2], 10, 30, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySameTimeBetweenWaves = 1;
            wave.myDoneDelay = doneDelay;
            wave.myWaveDirection = 1;

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("Merry_Go_Round_Left", wave);
            ventSetup.myNextWavesMap.set("Merry_Go_Round_Left", nextWavesSetup);
        }

        {
            let wave = new MerryGoRoundSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 5], [4, 6], 10, 30, true);
            wave.myAngleBetweenWaves = new RangeValue([15, 25]);
            wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1.5, 2], 10, 30, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.mySameTimeBetweenWaves = 1;
            wave.myDoneDelay = doneDelay;
            wave.myWaveDirection = -1;

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("Merry_Go_Round_Right", wave);
            ventSetup.myNextWavesMap.set("Merry_Go_Round_Right", nextWavesSetup);
        }

        {
            let wave = new QueueForYouWaveSetup();

            wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 5], 10, 30, true);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.myTimeBetweenClones = timeBetweenClones;
            wave.myDoneDelay = doneDelay;
            wave.mySameTimeBetweenClones = new RangeValueOverTime([1, 1], [-1, 1], 10, 30, false); // >= 0 means true

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("Queue_For_You", wave);
            ventSetup.myNextWavesMap.set("Queue_For_You", nextWavesSetup);
        }

        {
            let wave = new GiveUsAHugSetup();

            wave.myClonesCount = new RangeValueOverTime([1, 2], [2, 3], 10, 30, true);
            wave.mySpawnConeAngle = new RangeValue([20, 40]);
            wave.myMinAngleBetweenClones = 10;
            wave.myWaveStartAngle = new RangeValueOverTime([90, 180], [135, 180], PP.myEasyTuneVariables.get("Time To Reach Target") / 5, PP.myEasyTuneVariables.get("Time To Reach Target"));
            wave.myTimeBetweenClones = timeBetweenClones;
            wave.myDoneDelay = doneDelay;
            wave.myFirstCloneInTheMiddle = true;
            wave.myRefDirection = [0, 0, -1];

            wave.myHugSize = new RangeValueOverTime([2, 2], [2, 2], 10, 30, true);
            wave.myHugAngle = new RangeValueOverTime([30, 40], [30, 40], 10, 30, false);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);
            nextWavesSetup.addWave("Man_In_The_Middle", 10);

            ventSetup.myWavesMap.set("Give_Us_A_Hug", wave);
            ventSetup.myNextWavesMap.set("Give_Us_A_Hug", nextWavesSetup);
        }

        {
            let wave = new ManInTheMiddleSetup();

            wave.myWavesCount = new RangeValueOverTime([3, 3], [2, 4], 10, 30, true);
            wave.myTimeBeforeStart = new RangeValueOverTime([1, 1.5], [1, 1.5], 10, 30, false);
            wave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 2], 10, 30, false);
            wave.myWaveStartAngle = new RangeValue([0, 180]);
            wave.myDoneDelay = new RangeValueOverTime([3, 4], [2.5, 3], 10, 30, false);

            let nextWavesSetup = new NextWavesSetup();
            nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
            nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
            nextWavesSetup.addWave("I_Am_Here", 10);
            nextWavesSetup.addWave("Queue_For_You", 10);
            nextWavesSetup.addWave("Give_Us_A_Hug", 10);
            nextWavesSetup.addWave("I_Am_Everywhere", 10);

            ventSetup.myWavesMap.set("Man_In_The_Middle", wave);
            ventSetup.myNextWavesMap.set("Man_In_The_Middle", nextWavesSetup);
        }

        ventSetup.myFirstWave = "I_Am_Here_mr_NOT_Side";

        return ventSetup;
    }
}