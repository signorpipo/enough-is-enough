TrialState.prototype._firstVentSetup = function () {
    let ventSetup = new VentSetup();

    ventSetup.myIsEndless = false;
    ventSetup.myClonesToDismiss = 0;
    ventSetup.myVentDuration = 100;

    ventSetup.myBreakSetup.myBreakDuration = 4;
    ventSetup.myBreakSetup.myBreakTimeCooldown = new RangeValue([30, 40]);
    ventSetup.myBreakSetup.myBreakCloneCooldown = new RangeValue([8, 13], true);

    ventSetup.mySmallBreakSetup.myBreakDuration = new RangeValueOverTime([2, 3], [1, 2], 30, 90, false);
    ventSetup.mySmallBreakSetup.myBreakTimeCooldown = new RangeValue([20, 30], [10, 15], 30, 90, false);
    ventSetup.mySmallBreakSetup.myBreakCloneCooldown = new RangeValue([7, 15], [5, 10], 30, 90, true);

    {
        let wave = new IAmHereWaveSetup();

        wave.myClonesCount = 1;
        wave.myWaveStartAngle = new RangeValueOverTime([0, 0], [20, 40], 10, 30, false);
        wave.myDoneDelay = new RangeValueOverTime([6, 7], [2, 4], 0, 30, false);
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
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 30, 90, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 4);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 6, 70);

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
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 30, 90, false);
        wave.myFirstCloneInTheMiddle = true;

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 4);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);
        nextWavesSetup.addWave("I_Am_Everywhere", 6, 70);

        ventSetup.myWavesMap.set("I_Am_Here_Side", wave);
        ventSetup.myNextWavesMap.set("I_Am_Here_Side", nextWavesSetup);
    }

    {
        let wave = new IAmEverywhereWaveSetup();

        wave.myWavesCount = 1;
        wave.myMinAngleBetweenWaves = new RangeValueOverTime([20, 30], [40, 70], 80, 120, false);
        wave.myMaxAngleBetweenWaves = new RangeValueOverTime([50, 70], [70, 100], 80, 120, false);
        wave.myTimeBetweenWaves = new RangeValueOverTime([2, 3], [1, 2], 80, 120, false);
        wave.myDoneDelay = new RangeValueOverTime([2, 4], [2, 2.5], 30, 90, false);
        wave.myWaveStartAngle = new RangeValue([0, 180]);

        let nextWavesSetup = new NextWavesSetup();
        nextWavesSetup.addWave("I_Am_Here_Front", 4);
        nextWavesSetup.addWave("I_Am_Here_Side", 10);

        ventSetup.myWavesMap.set("I_Am_Everywhere", wave);
        ventSetup.myNextWavesMap.set("I_Am_Everywhere", nextWavesSetup);
    }

    ventSetup.myFirstWave = "I_Am_Here_Warm_Up";
    ventSetup.myValidAngleRanges = [new RangeValue([-180, 0]), new RangeValue([0, 180])];

    return ventSetup;
};