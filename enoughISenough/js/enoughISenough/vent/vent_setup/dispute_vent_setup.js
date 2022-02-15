ArcadeState.prototype._disputeVentSetup = function () {
    let ventSetup = new VentSetup();

    ventSetup.myBreakSetup.myBreakDuration = new RangeValueOverTime([3, 4], [1.5, 2.5], 100, 300, false);
    ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([35, 45], [25, 35], 10, 100, false);
    ventSetup.myBreakSetup.myBreakCloneCooldown = 5;

    ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [0.5, 1], 50, 250, false);
    ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([50, 50], [8, 12], 10, 100, false);
    ventSetup.mySmallBreakSetup.myBreakCloneCooldown = 3;

    ventSetup.myCloneRotationSetup.mySpinSpeed = new RangeValue([4, 6], false);
    ventSetup.myCloneRotationSetup.mySpinChance = new RangeValueOverTime([1, 10], [1, 4], 160, 300, true);
    ventSetup.myCloneRotationSetup.mySpinStartTime = 150;

    ventSetup.myCloneRotationSetup.myTiltAngle = new RangeValueOverTime([0, 5], [0, 15], 60, 200, false);
    ventSetup.myCloneRotationSetup.myTiltChance = new RangeValueOverTime([1, 6], [1, 2], 60, 200, true);
    ventSetup.myCloneRotationSetup.myTiltStartTime = 60;

    ventSetup.myVentMultipliers = new VentRuntimeMultipliers();
    ventSetup.myVentMultipliers.mySpawnTimeMultiplier = 1;
    ventSetup.myVentMultipliers.myDoneTimeMultiplier = 1;
    ventSetup.myVentMultipliers.myBreakTimeMultiplier = 1;
    ventSetup.myVentMultipliers.myBreakDelayTimeMultiplier = 1;
    ventSetup.myVentMultipliers.mySmallBreakTimeMultiplier = 1;
    ventSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier = 1;

    ventSetup.myMrNOTSetup = new VentMrNOTSetup();

    ventSetup.myMrNOTSetup.myMrNOTAppearenceEnabled = true;
    ventSetup.myMrNOTSetup.myMrNOTTimeCooldown = new RangeValueOverTime([100, 110], [50, 70], 120, 350, false);

    ventSetup.myMrNOTSetup.myVentMultipliers = new VentRuntimeMultipliers();
    ventSetup.myMrNOTSetup.myVentMultipliers.mySpawnTimeMultiplier = 2;
    ventSetup.myMrNOTSetup.myVentMultipliers.myDoneTimeMultiplier = 2;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakTimeMultiplier = 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakDelayTimeMultiplier = 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakTimeMultiplier = 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier = 1;

    ventSetup.myMrNOTSetup.myStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    ventSetup.myMrNOTSetup.myTimeToReachTarget = new RangeValueOverTime([35, 45], [25, 35], 120, 300, false);
    ventSetup.myMrNOTSetup.myMaxPatience = new ValueOverTime(7, 15, 25, 45, true);

    let nextWavesSetup = new NextWavesSetup();
    nextWavesSetup.addWave("I_Am_Here", 200);
    nextWavesSetup.addWave("Queue_For_You", 200, 15);
    nextWavesSetup.addWave("Merry_Go_Round", 200, 15);
    nextWavesSetup.addWave("I_Am_Everywhere", 150, 45);
    nextWavesSetup.addWave("Give_Us_A_Hug_2", 100, 60);
    nextWavesSetup.addWave("Give_Us_A_Hug_3", 50, 60);
    nextWavesSetup.addWave("Man_In_The_Middle", 150, 75);

    let waveStartAngle = new RangeValue([30, 180]);

    let timeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 10, 100, false);
    let doneDelay = new RangeValueOverTime([2, 4], [2, 2.75], 10, 100, false);

    let timeBetweenClonesHard = new RangeValueOverTime([2, 3], [1.5, 2.25], 10, 100, false);
    let doneDelayHard = new RangeValueOverTime([3, 4], [2.5, 3], 10, 100, false);

    let timeBetweenClonesVeryHard = new RangeValueOverTime([2, 3], [2, 3], 10, 100, false);

    let randomTrue = new RangeValue([1, 1], [-0.5, 1], 150, 160, false); // >= 0 means true

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = 0;
        wave.myDoneDelay = 0;

        ventSetup.myWavesMap.set("Zero", wave);
        ventSetup.myNextWavesMap.set("Zero", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 5], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("I_Am_Here", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here", nextWavesSetup);
    }

    {
        let wave = new QueueForYouWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 5], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySameTimeBetweenClones = randomTrue;
        wave.myTimeBetweenClones = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("Queue_For_You", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You", nextWavesSetup);
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [3, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValue([15, 25]);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 10, 100, false);;
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("Merry_Go_Round", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round", nextWavesSetup);
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 6], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myHugSize = 2;
        wave.myHugAngle = new RangeValueOverTime([20, 30], [20, 40], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_2", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_2", nextWavesSetup);
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myHugSize = 3;
        wave.myHugAngle = new RangeValueOverTime([40, 50], [40, 60], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_3", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_3", nextWavesSetup);
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("Man_In_The_Middle", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle", nextWavesSetup);
    }

    ventSetup.myFirstWave = "Zero";


    return ventSetup;
};