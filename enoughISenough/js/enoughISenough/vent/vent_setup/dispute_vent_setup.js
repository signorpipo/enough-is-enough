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
    ventSetup.myMrNOTSetup.myBreakDuration = new RangeValueOverTime([4, 5], [2.5, 3.5], 100, 300, false);

    ventSetup.myMrNOTSetup.myVentMultipliers = new VentRuntimeMultipliers();
    ventSetup.myMrNOTSetup.myVentMultipliers.mySpawnTimeMultiplier = 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myDoneTimeMultiplier = 2;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakTimeMultiplier = 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakDelayTimeMultiplier = 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakTimeMultiplier = 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier = 1;

    ventSetup.myMrNOTSetup.myStartAngle = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
    ventSetup.myMrNOTSetup.myTimeToReachTarget = new RangeValueOverTime([35, 45], [25, 40], 120, 300, false);
    ventSetup.myMrNOTSetup.myMaxPatience = new ValueOverTime(7, 15, 25, 45, true);

    let nextWavesSetup = new NextWavesSetup();

    let firstWavesStartTime = 15;
    let secondWavesStartTime = 140;
    let thirdWavesStartTime = 250;
    let fourthWavesStartTime = 350;

    let firstGroupChance = 300;
    let secondGroupChance = 200;
    let thirdGroupChance = 100;
    let fourthGroupChance = 50;
    let fifthGroupChance = 25;

    // FIRST
    nextWavesSetup.addWave("I_Am_Here", firstGroupChance, 0, secondWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You", firstGroupChance, 15, secondWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round", firstGroupChance, 15, secondWavesStartTime);

    nextWavesSetup.addWave("I_Am_Everywhere", secondGroupChance, 45, secondWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_2", Math.floor(secondGroupChance * 2 / 3), 60, secondWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_3", Math.floor(secondGroupChance * 1 / 3), 60, secondWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle", secondGroupChance, 75, secondWavesStartTime);

    //

    //

    //

    // SECOND
    nextWavesSetup.addWave("I_Am_Here", firstGroupChance, secondWavesStartTime);
    nextWavesSetup.addWave("I_Am_Here_2", firstGroupChance, secondWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You", firstGroupChance, secondWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You_2", firstGroupChance, secondWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round", firstGroupChance, secondWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_Waves", firstGroupChance, secondWavesStartTime);

    let secondGroupSecondWaveChance = secondGroupChance * 2;
    nextWavesSetup.addWave("I_Am_Everywhere", Math.floor(secondGroupSecondWaveChance * 1 / 2), secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_2", Math.floor(secondGroupSecondWaveChance * 1 / 2), secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_2", Math.floor(secondGroupSecondWaveChance * 2 / 3), secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_3", Math.floor(secondGroupSecondWaveChance * 1 / 3), secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle", secondGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);

    let thirdGroupSecondWaveChance = thirdGroupChance;
    nextWavesSetup.addWave("I_Am_Everywhere_Waves", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Here_Rain", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You_Rain", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_Waves", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Here_Rain", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You_Rain", thirdGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);

    let fourthGroupSecondWaveChance = fourthGroupChance;
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_GUAH2", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_GUAH2", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_GUAH2", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_GUAH2", fourthGroupSecondWaveChance, secondWavesStartTime, thirdWavesStartTime);

    //

    // THIRD

    //

    let secondGroupThirdWaveChance = secondGroupChance * 2;
    nextWavesSetup.addWave("I_Am_Everywhere", Math.floor(secondGroupThirdWaveChance * 1 / 2), thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_2", Math.floor(secondGroupThirdWaveChance * 1 / 2), thirdWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_2", Math.floor(secondGroupThirdWaveChance * 3 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_3", Math.floor(secondGroupThirdWaveChance * 2 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle", Math.floor(secondGroupThirdWaveChance * 1 / 2), thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_MITM", Math.floor(secondGroupThirdWaveChance * 1 / 2), thirdWavesStartTime);

    let thirdGroupThirdWaveChance = thirdGroupChance * 6 / 5;
    nextWavesSetup.addWave("I_Am_Everywhere_Waves", thirdGroupThirdWaveChance, thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Here_Rain", thirdGroupThirdWaveChance, thirdWavesStartTime);
    nextWavesSetup.addWave("Queue_For_You_Rain", thirdGroupThirdWaveChance, thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_Rain", thirdGroupThirdWaveChance, thirdWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Waves", thirdGroupThirdWaveChance, thirdWavesStartTime);

    let fourthGroupThirdWaveChance = fourthGroupChance * 2;
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere", Math.floor(fourthGroupThirdWaveChance * 3 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_GUAH2", Math.floor(fourthGroupThirdWaveChance * 3 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_GUAH2", Math.floor(fourthGroupThirdWaveChance * 3 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_Waves", Math.floor(fourthGroupThirdWaveChance * 2 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("I_Am_Everywhere_GUAH3", Math.floor(fourthGroupThirdWaveChance * 2 / 5), thirdWavesStartTime);
    nextWavesSetup.addWave("Merry_Go_Round_GUAH3", Math.floor(fourthGroupThirdWaveChance * 2 / 5), thirdWavesStartTime);

    let fifthGroupThirdWaveChance = fifthGroupChance * 2;
    nextWavesSetup.addWave("Give_Us_A_Hug_4", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_GUAH2", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_GUAH2", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_4", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_GUAH2", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_GUAH2", Math.floor(fifthGroupThirdWaveChance * 1 / 2), thirdWavesStartTime, fourthWavesStartTime);

    //FOURTH

    //

    //

    //

    //

    let fifthGroupFourthWaveChance = fifthGroupChance * 2;
    nextWavesSetup.addWave("Give_Us_A_Hug_4", Math.floor(fifthGroupFourthWaveChance * 1 / 2), fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_GUAH2", Math.floor(fifthGroupFourthWaveChance * 3 / 5), fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_GUAH2", Math.floor(fifthGroupFourthWaveChance * 3 / 5), fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_GUAH3", Math.floor(fifthGroupFourthWaveChance * 2 / 5), fourthWavesStartTime);
    nextWavesSetup.addWave("Man_In_The_Middle_Everywhere_GUAH3", Math.floor(fifthGroupFourthWaveChance * 2 / 5), fourthWavesStartTime);
    nextWavesSetup.addWave("Give_Us_A_Hug_Cross", Math.floor(fifthGroupFourthWaveChance * 1 / 2), fourthWavesStartTime);

    //nextWavesSetup.addWave("Give_Us_A_Hug_Distance", 0, 0);

    secondWavesStartTime -= 40;
    thirdWavesStartTime -= 40;
    fourthWavesStartTime -= 40;

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
    let randomFalse = new RangeValueOverTime([-1, -1], [-1, 0.5], 150, 160, false); // >= 0 means true
    let randomRandom = new RangeValue([-1, 1]); // >= 0 means true

    // Booster Data   
    let boosterGroup1 = ["I_Am_Here", "I_Am_Here_2", "Queue_For_You", "Queue_For_You_2", "Merry_Go_Round", "Merry_Go_Round_Waves"];
    let boosterGroup2 = ["I_Am_Everywhere", "I_Am_Everywhere_2", "Give_Us_A_Hug_2", "Give_Us_A_Hug_3", "Man_In_The_Middle", "Merry_Go_Round_MITM"];
    let boosterGroup3 = ["I_Am_Everywhere_Waves", "I_Am_Here_Rain", "Queue_For_You_Rain", "Man_In_The_Middle_Waves", "Merry_Go_Round_Rain"];
    let boosterGroup4 = ["Man_In_The_Middle_Everywhere", "I_Am_Everywhere_GUAH2", "Merry_Go_Round_GUAH2", "Man_In_The_Middle_Everywhere_Waves", "I_Am_Everywhere_GUAH3", "Merry_Go_Round_GUAH3"];
    let boosterGroup5 = ["Give_Us_A_Hug_4", "Man_In_The_Middle_GUAH2", "Man_In_The_Middle_Everywhere_GUAH2", "Man_In_The_Middle_GUAH3", "Man_In_The_Middle_Everywhere_GUAH3", "Give_Us_A_Hug_Cross"];

    let boosterGroupName1 = "1";
    let boosterGroupName2 = "2";
    let boosterGroupName3 = "3";
    let boosterGroupName4 = "4";
    let boosterGroupName5 = "5";

    let dampingOverLastPick1 = new ValueOverTime(-90, 0, 0, 30);
    let dampingOverLastPick2 = new ValueOverTime(-80, 0, 0, 30);
    let dampingOverLastPick3 = new ValueOverTime(-70, 0, 0, 30);
    let dampingOverLastPick4 = new ValueOverTime(-60, 0, 0, 30);
    let dampingOverLastPick5 = new ValueOverTime(-50, 0, 0, 30);

    let boostMultiplier1 = 1.5;
    let boostMultiplier2 = new ValueOverTime(4, 2.5, 100, 500);
    let boostMultiplier3 = new ValueOverTime(4, 2.5, secondWavesStartTime, 500);
    let boostMultiplier4 = new ValueOverTime(4, 2.5, secondWavesStartTime, 500);
    let boostMultiplier5 = new ValueOverTime(6, 2.5, thirdWavesStartTime, 500);

    let boostDivider1 = 3;
    let boostDivider2 = new ValueOverTime(1.5, 2, 100, 250);
    let boostDivider3 = new ValueOverTime(1.5, 2, secondWavesStartTime, secondWavesStartTime + 150);
    let boostDivider4 = new ValueOverTime(1.5, 2, secondWavesStartTime, secondWavesStartTime + 150);
    let boostDivider5 = new ValueOverTime(1.5, 2, thirdWavesStartTime, thirdWavesStartTime + 150);

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

    let subGiveUsAHug2Wave = new GiveUsAHugSetup();
    subGiveUsAHug2Wave.myClonesCount = 1;
    subGiveUsAHug2Wave.myWaveStartAngle = 0;
    subGiveUsAHug2Wave.myFirstCloneInTheMiddle = true;
    subGiveUsAHug2Wave.myTimeBetweenClones = 0;
    subGiveUsAHug2Wave.myHugSize = 2;
    subGiveUsAHug2Wave.myHugAngle = new RangeValueOverTime([20, 30], [20, 40], 10, 100, false);
    subGiveUsAHug2Wave.mySameHugAngle = randomTrue;
    subGiveUsAHug2Wave.myDoneDelay = 0;

    let subGiveUsAHug3Wave = new GiveUsAHugSetup();
    subGiveUsAHug3Wave.myClonesCount = 1;
    subGiveUsAHug3Wave.myWaveStartAngle = 0;
    subGiveUsAHug3Wave.myFirstCloneInTheMiddle = true;
    subGiveUsAHug3Wave.myTimeBetweenClones = 0;
    subGiveUsAHug3Wave.myHugSize = 3;
    subGiveUsAHug3Wave.myHugAngle = new RangeValueOverTime([40, 50], [40, 60], 10, 100, false);
    subGiveUsAHug3Wave.mySameHugAngle = randomTrue;
    subGiveUsAHug3Wave.myDoneDelay = 0;

    let subMerryWave = new MerryGoRoundSetup();
    subMerryWave.myWavesCount = new RangeValueOverTime([3, 4], [3, 4], 10, 100, true);
    subMerryWave.myWaveStartAngle = 0;
    subMerryWave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
    subMerryWave.mySameTimeBetweenWaves = randomTrue;
    subMerryWave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 10, 100, false);
    subMerryWave.myPrecomputeWaveDirection = randomFalse;
    subMerryWave.myDoneDelay = 0;

    let subMITMWave = new ManInTheMiddleSetup();
    subMITMWave.myWavesCount = 1;
    subMITMWave.myWaveStartAngle = 0;
    subMITMWave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
    subMITMWave.myTimeBeforeOpposite = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
    subMITMWave.myAllSameTimes = randomVeryTrue;
    subMITMWave.myDoneDelay = 0;

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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));

        ventSetup.myWavesMap.set("I_Am_Here_2", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Here_2",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));
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
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));

        ventSetup.myWavesMap.set("Queue_For_You_2", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You_2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Queue_For_You_2",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));
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
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));
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
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [3, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = timeBetweenClones;
        wave.myDoneDelay = doneDelay;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 1, "Queue_For_You"]);
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Merry_Go_Round_Waves", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_Waves",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup1, boosterGroupName1, dampingOverLastPick1, boostMultiplier1, boostDivider1));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValue([25, 35]);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myWavesSetup.push([subGiveUsAHug2Wave, 1, "Give Us A Hug 2"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Merry_Go_Round_GUAH2", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_GUAH2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_GUAH2",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 5], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValue([25, 35]);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = timeBetweenClonesMegaHard;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myWavesSetup.push([subGiveUsAHug3Wave, 1, "Give Us A Hug 3"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Merry_Go_Round_GUAH3", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_GUAH3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_GUAH3",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [3, 6], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myAngleBetweenWaves = new RangeValueOverTime([15, 25], [15, 35], 10, 100, false);
        wave.mySameTimeBetweenWaves = randomTrue;
        wave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 1.5], 10, 100, false);
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subMITMWave, 1, "Man_In_The_Middle"]);
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Merry_Go_Round_MITM", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_MITM", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Merry_Go_Round_MITM",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));
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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));

        ventSetup.myWavesMap.set("I_Am_Everywhere_2", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere_2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere_2",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [3, 5], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 1, "Queue_For_You"]);
        wave.myWavesSetup.push([subMerryWave, 1, "Merry_Go_Round"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("I_Am_Everywhere_Waves", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere_Waves",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [3, 5], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myWavesSetup.push([subGiveUsAHug2Wave, 1, "Give Us A Hug 2"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("I_Am_Everywhere_GUAH2", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere_GUAH2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere_GUAH2",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
    }


    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [3, 4], 10, 100, true);
        wave.myAngleBetweenWaves = new RangeValue([70, 180]);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesMegaHard;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myWavesSetup.push([subGiveUsAHug3Wave, 1, "Give Us A Hug 3"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("I_Am_Everywhere_GUAH3", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere_GUAH3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("I_Am_Everywhere_GUAH3",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesVeryHard;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myHugSize = 3;
        wave.myHugAngle = new RangeValueOverTime([40, 50], [40, 60], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_3", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_3",
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myFirstCloneInTheMiddle = true;
        wave.myTimeBetweenClones = timeBetweenClonesMegaHard;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myHugSize = 4;
        wave.myHugAngle = new RangeValueOverTime([60, 70], [60, 80], 10, 100, false);
        wave.mySameHugAngle = randomTrue;
        wave.mySameHugSize = randomTrue;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_4", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_4", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_4",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
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
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myFirstCloneInTheMiddle = true;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myHugSize = 5;
        wave.myHugAngle = 180;

        ventSetup.myWavesMap.set("Give_Us_A_Hug_Cross", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug_Cross", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Give_Us_A_Hug_Cross",
            new NextWaveChanceBoosterSetup(fourthWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
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
            new NextWaveChanceBoosterSetup(firstWavesStartTime, boosterGroup2, boosterGroupName2, dampingOverLastPick2, boostMultiplier2, boostDivider2));
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
        wave.myDoneDelay = doneDelayVeryHard;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere",
            new NextWaveChanceBoosterSetup(secondWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClones;
        wave.myTimeBeforeOpposite = timeBetweenClones;
        wave.myAllSameTimes = randomVeryTrue;
        wave.myDoneDelay = doneDelayHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 2, "Queue_For_You"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Waves", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Waves",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup3, boosterGroupName3, dampingOverLastPick3, boostMultiplier3, boostDivider3));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBeforeOpposite = timeBetweenClones;
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myOppositeTimeAsTimeBetweenWaves = -1;
        wave.mySameOppositeTimeBetweenWaves = randomVeryTrue;
        wave.mySameTimeBetweenWaves = randomVeryTrue;
        wave.myAngleBetweenWaves = new RangeValue([40, 140]);
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myWavesSetup.push([subHereWave, 1, "I_Am_Here"]);
        wave.myWavesSetup.push([subQueueWave, 2, "Queue_For_You"]);
        wave.myWavesSetupPickOne = randomVeryTrue;
        wave.myWavesSetupPrecompute = randomTrue;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere_Waves", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere_Waves", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere_Waves",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup4, boosterGroupName4, dampingOverLastPick4, boostMultiplier4, boostDivider4));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesHard;
        wave.myTimeBeforeOpposite = timeBetweenClonesHard;
        wave.myAllSameTimes = randomVeryTrue;
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myWavesSetup.push([subGiveUsAHug2Wave, 1, "Give Us A Hug 2"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Man_In_The_Middle_GUAH2", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_GUAH2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_GUAH2",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
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
        wave.myDoneDelay = doneDelayVeryHard;

        wave.myWavesSetup.push([subGiveUsAHug2Wave, 1, "Give Us A Hug 2"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere_GUAH2", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere_GUAH2", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere_GUAH2",
            new NextWaveChanceBoosterSetup(thirdWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBetweenWaves = timeBetweenClonesVeryHard;
        wave.myTimeBeforeOpposite = timeBetweenClonesVeryHard;
        wave.myAllSameTimes = randomVeryTrue;
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myWavesSetup.push([subGiveUsAHug3Wave, 1, "Give Us A Hug 3"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Man_In_The_Middle_GUAH3", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_GUAH3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_GUAH3",
            new NextWaveChanceBoosterSetup(fourthWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([2, 3], [2, 4], 10, 100, true);
        wave.myWaveStartAngle = waveStartAngle;
        wave.myTimeBeforeOpposite = timeBetweenClonesVeryHard;
        wave.myTimeBetweenWaves = timeBetweenClonesMegaHard;
        wave.myOppositeTimeAsTimeBetweenWaves = -1;
        wave.mySameOppositeTimeBetweenWaves = randomVeryTrue;
        wave.mySameTimeBetweenWaves = randomVeryTrue;
        wave.myAngleBetweenWaves = new RangeValue([40, 140]);
        wave.myDoneDelay = doneDelayMegaHard;

        wave.myWavesSetup.push([subGiveUsAHug3Wave, 1, "Give Us A Hug 3"]);
        wave.myWavesSetupPrecompute = randomRandom;

        ventSetup.myWavesMap.set("Man_In_The_Middle_Everywhere_GUAH3", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle_Everywhere_GUAH3", nextWavesSetup);
        ventSetup.myNextWaveChanceBoosterSetupMap.set("Man_In_The_Middle_Everywhere_GUAH3",
            new NextWaveChanceBoosterSetup(fourthWavesStartTime, boosterGroup5, boosterGroupName5, dampingOverLastPick5, boostMultiplier5, boostDivider5));
    }

    ventSetup.myFirstWave = "Zero";

    return ventSetup;
};