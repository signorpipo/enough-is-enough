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
    nextWavesSetup.addWave("Merry_Go_Round", 201110, 15);
    nextWavesSetup.addWave("Merry_Go_Round_Queue", 1, 0);
    nextWavesSetup.addWave("Merry_Go_Round_Here", 1, 0);

    nextWavesSetup.addWave("I_Am_Everywhere", 100, 45);
    nextWavesSetup.addWave("Give_Us_A_Hug_2", 70, 60);
    nextWavesSetup.addWave("Give_Us_A_Hug_3", 30, 60);
    nextWavesSetup.addWave("Man_In_The_Middle", 100, 75);
    nextWavesSetup.addWave("I_Am_Everywhere_Waves", 1, 1);
    nextWavesSetup.addWave("Man_In_The_Middle_Waves", 1, 1);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_Waves", 1, 1);


    //nextWavesSetup.addWave("Give_Us_A_Hug_Distance", 1, 0);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere", 1, 0);
    nextWavesSetup.addWave("I_Am_Here_Rain", 1, 0);
    nextWavesSetup.addWave("Queue_For_You_Rain", 1, 0);
    nextWavesSetup.addWave("Give_Us_A_Hug_4", 1, 0);
    nextWavesSetup.addWave("Give_Us_A_Hug_Everywhere_2", 1, 0);
    nextWavesSetup.addWave("Give_Us_A_Hug_Everywhere_3", 1, 0);

    nextWavesSetup.addWave("Give_Us_A_Hug_Cross", 1, 0);
    nextWavesSetup.addWave("Merry_Go_Round_Rain", 1, 0);


    // Wave Data

    let waveStartAngle = new RangeValue([30, 180]);

    let timeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 10, 100, false);
    let doneDelay = new RangeValueOverTime([2, 4], [2, 2.75], 10, 100, false);

    let timeBetweenClonesHard = new RangeValueOverTime([2, 3], [1.5, 2.25], 10, 100, false);
    let doneDelayHard = new RangeValueOverTime([3, 4], [2.5, 3], 10, 100, false);

    let timeBetweenClonesVeryHard = new RangeValueOverTime([2, 3], [2, 3], 10, 100, false);
    let doneDelayVeryHard = new RangeValueOverTime([3, 4], [3, 4], 10, 100, false);

    let timeBetweenClonesMegaHard = new RangeValueOverTime([3, 4], [3, 4], 10, 100, false);
    let doneDelayMegaHard = new RangeValueOverTime([4, 5], [4, 5], 10, 100, false);

    let randomTrue = new RangeValueOverTime([1, 1], [-0.5, 1], 150, 160, false); // >= 0 means true
    let randomVeryTrue = new RangeValueOverTime([1, 1], [-0.75, 1], 150, 160, false); // >= 0 means true
    let randomRandom = new RangeValue([-1, 1]); // >= 0 means true

    // Booster Data    

    let boosterGroup1 = ["I_Am_Here", "Queue_For_You", "Merry_Go_Round"];
    let boosterGroup2 = ["I_Am_Everywhere", "Give_Us_A_Hug_2", "Give_Us_A_Hug_3", "Man_In_The_Middle"];
    let boosterGroup3 = ["Give_Us_A_Hug_Cross"];

    let boosterGroupName1 = "1";
    let boosterGroupName2 = "2";
    let boosterGroupName3 = "3";

    let dampingOverLastPick1 = new ValueOverTime(-90, 0, 0, 30);
    let dampingOverLastPick2 = new ValueOverTime(-90, 0, 0, 30);
    let dampingOverLastPick3 = new ValueOverTime(-90, 0, 0, 30);

    let boostMultiplier1 = 1;
    let boostMultiplier2 = 1;
    let boostMultiplier3 = 1;

    let boostDivider = 2;

    // Waves

    {
        let wave = new ZeroWaveSetup();

        ventSetup.myWavesMap.set("Zero", wave);
        ventSetup.myNextWavesMap.set("Zero", nextWavesSetup);
    }

    let subHereWave = new IAmHereWaveSetup();
    subHereWave.myClonesCount = new RangeValueOverTime([2, 3], [2, 3], 10, 100, true);
    subHereWave.myWaveStartAngle = 0;
    subHereWave.mySpawnConeAngle = new RangeValue([20, 40]);
    subHereWave.mySameTimeBetweenClones = randomRandom;
    subHereWave.myMinAngleBetweenClones = 10;
    subHereWave.myFirstCloneInTheMiddle = true;
    subHereWave.myTimeBetweenClones = timeBetweenClones;
    subHereWave.myDoneDelay = 0;

    let subQueueWave = new QueueForYouWaveSetup();
    subQueueWave.myClonesCount = new RangeValueOverTime([2, 3], [2, 3], 10, 100, true);
    subQueueWave.myWaveStartAngle = 0;
    subQueueWave.mySameTimeBetweenClones = randomTrue;
    subQueueWave.myTimeBetweenClones = timeBetweenClones;
    subQueueWave.myDoneDelay = 0;

    // I AM HERE

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 5], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.mySameTimeBetweenClones = randomRandom;
        wave.myMinAngleBetweenClones = 10;
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("I_Am_Here", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Here",
            new NextWaveChanceBoosterSetup(0, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider));
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([4, 6], [5, 8], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.mySameTimeBetweenClones = randomRandom;
        wave.myMinAngleBetweenClones = 10;
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = new RangeValueOverTime([0.75, 1.25], [0.6, 1], 10, 100, false);
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("I_Am_Here_Rain", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Rain", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Here_Rain",
            new NextWaveChanceBoosterSetup(0, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider));
    }

    // QUEUE FOR YOU

    {
        let wave = new QueueForYouWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 5], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySameTimeBetweenClones = randomTrue;
        wave.myTimeBetweenClones = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("Queue_For_You", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Queue_For_You",
            new NextWaveChanceBoosterSetup(15, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider));
    }

    {
        let wave = new QueueForYouWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([4, 6], [5, 8], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySameTimeBetweenClones = randomTrue;
        wave.myTimeBetweenClones = new RangeValueOverTime([0.75, 1.25], [0.6, 1], 10, 100, false);
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("Queue_For_You_Rain", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You_Rain", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Queue_For_You_Rain",
            new NextWaveChanceBoosterSetup(15, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider));
    }

    // MERRY GO ROUND

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [3, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 10, 100, false);
        wave.myDoneDelay = doneDelay;

        ventSetup.myWavesMap.set("Merry_Go_Round", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round",
            new NextWaveChanceBoosterSetup(15, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([8, 12], [8, 12], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = new RangeValueOverTime([0.5, 1], [0.4, 0.8], 10, 100, false);
        wave.myDoneDelay = doneDelayVeryHard;

        ventSetup.myWavesMap.set("Merry_Go_Round_Rain", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Rain", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_Rain",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([4, 5], [4, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        wave.myWavesSetup.push([subQueueWave, 1, "Queue_For_You"]);
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Merry_Go_Round_Queue", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Queue", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_Queue",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([4, 5], [4, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValue([25, 35]);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Merry_Go_Round_Here", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Here", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_Here",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    // I AM EVERYWHERE

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 6], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere",
            new NextWaveChanceBoosterSetup(45, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [3, 4], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 1, "Queue_For_You"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("I_Am_Everywhere_Waves", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere_Waves",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    // GIVE US A HUG

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myHugSize = 2;
        wave.myHugAngle = new RangeValueOverTime([20, 30], [20, 40], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_2", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_2",
            new NextWaveChanceBoosterSetup(60, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myHugSize = 3;
        wave.myHugAngle = new RangeValueOverTime([40, 50], [40, 60], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_3", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_3",
            new NextWaveChanceBoosterSetup(60, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myHugSize = 4;
        wave.myHugAngle = new RangeValueOverTime([60, 70], [60, 80], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_4", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_4", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_4",
            new NextWaveChanceBoosterSetup(60, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([70, 180]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myHugSize = 2;
        wave.myHugAngle = new RangeValueOverTime([20, 30], [20, 40], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_Everywhere_2", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Everywhere_2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_Everywhere_2",
            new NextWaveChanceBoosterSetup(60, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([2, 2], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([70, 180]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesMegaHard;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myHugSize = 3;
        wave.myHugAngle = new RangeValueOverTime([40, 50], [40, 60], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_Everywhere_3", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Everywhere_3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_Everywhere_3",
            new NextWaveChanceBoosterSetup(60, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myHugSize = new RangeValueOverTime([3, 3], [3, 3], 10, 100, true);
        wave.myHugAngle = new RangeValueOverTime([80, 100], [80, 100], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;
        wave.myHugClonesSameDistance = -1;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_Distance", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Distance", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_Distance",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = 1;
        wave.myWaveStartAngle = waveStartAngle;
        wave.myFirstCloneInTheMiddle = true;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myHugSize = 5;
        wave.myHugAngle = 180;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_Cross", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Cross", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_Cross",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    // MAN IN THE MIDDLE

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
        wave.myTimeBeforeOpposite = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
        wave.myAllSameTimes = randomVeryTrue;
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("Man_In_The_Middle", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle",
            new NextWaveChanceBoosterSetup(75, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBeforeOpposite = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myOppositeTimeAsTimeBetweenWaves = -1;
        wave.mySameOppositeTimeBetweenWaves = randomVeryTrue;
        wave.mySameTimeBetweenWaves = randomVeryTrue;
        wave.myAngleBetweenWaves = new RangeValue([40, 140]);
        wave.myDoneDelay = doneDelayHard;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myTimeBeforeOpposite = timeBetweenClonesHard;
        wave.myAllSameTimes = randomVeryTrue;
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 2, "Queue_For_You"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Waves", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Waves",
            new NextWaveChanceBoosterSetup(75, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBeforeOpposite = timeBetweenClonesHard;
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myOppositeTimeAsTimeBetweenWaves = -1;
        wave.mySameOppositeTimeBetweenWaves = randomVeryTrue;
        wave.mySameTimeBetweenWaves = randomVeryTrue;
        wave.myAngleBetweenWaves = new RangeValue([40, 140]);
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 2, "Queue_For_You"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere_Waves", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere_Waves",
            new NextWaveChanceBoosterSetup(160, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider));
    }

    ventSetup.myFirstWave = "Zero";

    return ventSetup;
};