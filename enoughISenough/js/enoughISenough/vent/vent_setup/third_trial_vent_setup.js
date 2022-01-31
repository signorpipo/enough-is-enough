TrialState.prototype._thirdVentSetup = function () {
    let ventSetup = new VentSetup();

    ventSetup.myIsEndless = false;
    ventSetup.myClonesToDismiss = 0;
    ventSetup.myVentDuration = 110;

    ventSetup.myBreakSetup.myBreakDuration = new RangeValue([3, 4]);
    ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 45], [30, 35], 10, 30, false);
    ventSetup.myBreakSetup.myBreakCloneCooldown = 5;

    ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1.5, 2.5], 30, 75, false);
    ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 50], [8, 12], 10, 45, false);
    ventSetup.mySmallBreakSetup.myBreakCloneCooldown = 3;

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = 0;
        wave.myDoneDelay = 0;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);

        ventSetup.myWavesMap.set("Zero", wave);
        ventSetup.myNextWavesMap.set("Zero", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 5], 10, 70, true);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 30], [0, 50], 10, 70, false);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 10, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("I_Am_Here_Front", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Front", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 3], [1, 5], 10, 70, true);
        wave.myWaveStartAngle = new RangeValueOverTime([60, 130], [60, 180], 10, 70, false);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 10, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("I_Am_Here_Side", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Side", nextWavesSetup);
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 4], [3, 5], 10, 70, true);
        wave.myAngleBetweenWaves = new RangeValueOverTime([70, 120], [70, 120], 10, 70, false);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1.5, 2.25], 10, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([3, 4], [2, 2.5], 10, 70, false);
        wave.myWaveStartAngle = new RangeValue([70, 120]);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [4, 7], 10, 60, true);
        wave.myAngleBetweenWaves = new RangeValue([15, 25]);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 10, 70, false);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 60], [0, 100], 10, 70, false);
        wave.mySameTimeBetweenWaves = 1;
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);
        wave.myWaveDirection = 1;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("Merry_Go_Round_Left", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Left", nextWavesSetup);
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 5], [4, 7], 10, 60, true);
        wave.myAngleBetweenWaves = new RangeValue([15, 25]);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 10, 70, false);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 60], [0, 100], 10, 70, false);
        wave.mySameTimeBetweenWaves = 1;
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);
        wave.myWaveDirection = -1;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("Merry_Go_Round_Right", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Right", nextWavesSetup);
    }

    {
        let wave = new QueueForYouWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([2, 3], [2, 5], 10, 70, true);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 60], [0, 100], 10, 70, false);
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 10, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);
        wave.mySameTimeBetweenClones = new RangeValueOverTime([1, 1], [-1, 1], 10, 70, false); // >= 0 means true

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("Queue_For_You", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You", nextWavesSetup);
    }

    {
        let wave = new GiveUsAHugSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [2, 3], 40, 50, true);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myWaveStartAngle = new RangeValueOverTime([0, 10], [0, 60], 40, 70, false);
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [2, 3], 10, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 3], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;

        wave.myHugSize = new RangeValueOverTime([2, 2], [2, 2], 40, 50, true);
        wave.myHugAngle = new RangeValueOverTime([25, 35], [30, 50], 40, 60, false);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 60, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 20, 70);
        nextWavesSetup.addWave("Man_In_The_Middle", 100000, 100);

        ventSetup.myWavesMap.set("Give_Us_A_Hug", wave);
        ventSetup.myNextWavesMap.set("Give_Us_A_Hug", nextWavesSetup);
    }

    {
        let wave = new ManInTheMiddleSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 3], [3, 4], 70, 85, true);
        wave.myTimeBeforeStart = new RangeValueOverTime([1.5, 2], [1.5, 2], 70, 85, false);
        wave.myTimeBetweenWaves = new RangeValueOverTime([1.5, 2], [1, 1.5], 70, 85, false);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 100], [0, 100], 70, 85, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [1.5, 2.5], 10, 70, false);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 10);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 10);
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 10);
        nextWavesSetup.addWave("Queue_For_You", 10);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 30, 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", new ValueOverTime(15, 25, 40, 70), 40);
        nextWavesSetup.addWave("Give_Us_A_Hug", 100000, 83, 93);

        ventSetup.myWavesMap.set("Man_In_The_Middle", wave);
        ventSetup.myNextWavesMap.set("Man_In_The_Middle", nextWavesSetup);
    }

    ventSetup.myFirstWave = "Zero";
    ventSetup.myValidAngleRanges = [new RangeValue([-180, 0]), new RangeValue([0, 180])];

    return ventSetup;
};