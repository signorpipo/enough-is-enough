TrialState.prototype._secondVentSetup = function () {
    let ventSetup = new VentSetup();

    ventSetup.myIsEndless = false;
    ventSetup.myClonesToDismiss = 0;
    ventSetup.myVentDuration = 95;

    ventSetup.myBreakSetup.myBreakDuration = new RangeValue([4, 5]);
    ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([30, 35], [30, 35], 10, 30, false);
    ventSetup.myBreakSetup.myBreakCloneCooldown = 5;

    ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1.5, 2.5], 30, 75, false);
    ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 50], [8, 12], 10, 45, false);
    ventSetup.mySmallBreakSetup.myBreakCloneCooldown = 3;

    ventSetup.myCloneRotationSetup.myTiltAngle = new RangeValueOverTime([0, 10], [0, 15], 40, 75, false);
    ventSetup.myCloneRotationSetup.myTiltChance = new RangeValueOverTime([1, 6], [1, 3], 40, 75, true);
    ventSetup.myCloneRotationSetup.myTiltStartTime = 40;

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = 1;
        wave.myWaveStartAngle = new RangeValueOverTime([10, 30], [10, 50], 10, 70, false);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 0, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;
        wave.myRefDirection = [0, 0, -1];

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Warm_Up", 100, 0, 20);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 100, 20);
        nextWavesSetup.addWave("Merry_Go_Round_Right", 100, 20);

        ventSetup.myWavesMap.set("I_Am_Here_Warm_Up", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Warm_Up", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 0, 30, true);
        wave.myWaveStartAngle = new RangeValueOverTime([10, 30], [10, 50], 10, 70, false);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 0, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 125);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 125);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("I_Am_Everywhere", 125, 50);
        nextWavesSetup.addWave("Queue_For_You", new ValueOverTime(1000000, 150, 50, 60), 50);

        ventSetup.myWavesMap.set("I_Am_Here_Front", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Front", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 0, 30, true);
        wave.myWaveStartAngle = new RangeValueOverTime([70, 110], [60, 150], 10, 70, false);
        wave.mySpawnConeAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 0, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 125);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 125);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("I_Am_Everywhere", 125, 50);
        nextWavesSetup.addWave("Queue_For_You", new ValueOverTime(1000000, 150, 50, 60), 50);

        ventSetup.myWavesMap.set("I_Am_Here_Side", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Side", nextWavesSetup);
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValue([3, 4]);
        wave.myAngleBetweenWaves = new RangeValueOverTime([60, 110], [60, 130], 20, 60, false);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1.5, 2.25], 0, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([3, 4], [2.5, 4], 10, 70, false);
        wave.myWaveStartAngle = new RangeValueOverTime([60, 110], [60, 130], 20, 60, false);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 125);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 125);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("Queue_For_You", new ValueOverTime(1000000, 150, 50, 60), 50);

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([4, 5], [4, 6], 30, 60, true);
        wave.myAngleBetweenWaves = new RangeValue([15, 25]);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 0, 70, false);
        wave.myWaveStartAngle = new RangeValueOverTime([10, 30], [10, 120], 20, 70, false);
        wave.mySameTimeBetweenWaves = 1;
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.myWaveDirection = 1;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 100);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("I_Am_Everywhere", 125, 50);
        nextWavesSetup.addWave("Queue_For_You", new ValueOverTime(1000000, 150, 50, 60), 50);

        ventSetup.myWavesMap.set("Merry_Go_Round_Left", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Left", nextWavesSetup);
    }

    {
        let wave = new MerryGoRoundSetup();

        wave.myWavesCount = new RangeValueOverTime([4, 5], [4, 6], 30, 60, true);
        wave.myAngleBetweenWaves = new RangeValue([15, 25]);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [0.75, 1.25], 0, 70, false);
        wave.myWaveStartAngle = new RangeValueOverTime([10, 30], [10, 120], 20, 70, false);
        wave.mySameTimeBetweenWaves = 1;
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.myWaveDirection = -1;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Left", 100);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("I_Am_Everywhere", 125, 50);
        nextWavesSetup.addWave("Queue_For_You", new ValueOverTime(1000000, 150, 50, 60), 50);

        ventSetup.myWavesMap.set("Merry_Go_Round_Right", wave);
        ventSetup.myNextWavesMap.set("Merry_Go_Round_Right", nextWavesSetup);
    }

    {
        let wave = new QueueForYouWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([3, 3], [2, 4], 55, 60, true);
        wave.myWaveStartAngle = new RangeValue([25, 120]);
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 0, 70, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 10, 70, false);
        wave.mySameTimeBetweenClones = 1;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("Merry_Go_Round_Right", 125);
        nextWavesSetup.addWave("Merry_Go_Round_Left", 125);
        nextWavesSetup.addWave("I_Am_Here_Front", 50);
        nextWavesSetup.addWave("I_Am_Here_Side", 100);
        nextWavesSetup.addWave("I_Am_Everywhere", 125, 50);
        nextWavesSetup.addWave("Queue_For_You", 100);

        ventSetup.myWavesMap.set("Queue_For_You", wave);
        ventSetup.myNextWavesMap.set("Queue_For_You", nextWavesSetup);
    }

    ventSetup.myFirstWave = "I_Am_Here_Warm_Up";

    return ventSetup;
};