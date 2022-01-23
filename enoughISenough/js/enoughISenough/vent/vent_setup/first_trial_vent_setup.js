TrialState.prototype._firstVentSetup = function () {
    let ventSetup = new VentSetup();

    ventSetup.myIsEndless = false;
    ventSetup.myClonesToDismiss = 0;
    ventSetup.myVentDuration = 100;

    ventSetup.myBreakSetup.myBreakDuration = new RangeValue([4, 5]);
    ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([30, 40], [20, 30], 10, 30, false);
    ventSetup.myBreakSetup.myBreakCloneCooldown = 5;

    ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1.5, 2.5], 30, 70, false);
    ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValueOverTime([40, 50], [7, 12], 10, 45, false);
    ventSetup.mySmallBreakSetup.myBreakCloneCooldown = new ValueOverTime(5, 3, 45, 50, true);

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = 1;
        wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [20, 40], 10, 30, false);
        wave.myDoneDelay = new RangeValueOverTime([6, 7], [2.5, 4], 0, 30, false);
        wave.myFirstCloneInTheMiddle = true;
        wave.myRefDirection = [0, 0, -1];

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Warm_Up", 10, 0, 30);
        nextWavesSetup.addWave("I_Am_Here_Side", 10, 30, null);

        ventSetup.myWavesMap.set("I_Am_Here_Warm_Up", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Warm_Up", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 30, 90, true);
        wave.myWaveStartAngle = new RangeValueOverTime([0, 30], [0, 50], 30, 90, false);
        wave.myWaveAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 30, 90, false);
        wave.myDoneDelay = new RangeValueOverTime([2.5, 4], [2.5, 3], 30, 90, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 4);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", new ValueOverTime(30, 7, 70, 80), 70);

        ventSetup.myWavesMap.set("I_Am_Here_Front", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Front", nextWavesSetup);
    }

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = new RangeValueOverTime([1, 1], [1, 3], 30, 90, true);
        wave.myWaveAngle = new RangeValue([20, 40]);
        wave.myMinAngleBetweenClones = 10;
        wave.myWaveStartAngle = new RangeValueOverTime([60, 130], [60, 180], 30, 90, false);
        wave.myTimeBetweenClones = new RangeValueOverTime([2, 3], [1, 2], 30, 90, false);
        wave.myDoneDelay = new RangeValueOverTime([2.5, 4], [2.5, 3], 30, 90, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", new ValueOverTime(30, 7, 70, 80), 70);

        ventSetup.myWavesMap.set("I_Am_Here_Side", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Side", nextWavesSetup);
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = new RangeValueOverTime([3, 3], [3, 4], 70, 90, true);
        wave.myMinAngleBetweenWaves = new RangeValueOverTime([40, 50], [50, 70], 70, 90, false);
        wave.myMaxAngleBetweenWaves = new RangeValueOverTime([60, 80], [90, 110], 70, 90, false);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1.5, 2.5], 70, 90, false);
        wave.myDoneDelay = new RangeValueOverTime([3, 4], [2.5, 4], 70, 90, false);
        wave.myWaveStartAngle = new RangeValue([0, 100]);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 5);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
    }

    ventSetup.myFirstWave = "I_Am_Here_Warm_Up";
    ventSetup.myValidAngleRanges = [new RangeValue([-180, 0]), new RangeValue([0, 180])];

    return ventSetup;
};