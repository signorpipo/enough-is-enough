ArcadeState.prototype._chatVentSetup = function () {
    let ventSetup = this._disputeVentSetup(true);

    ventSetup.myVentMultipliers.mySpawnTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.myDoneTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.25;
    ventSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.25;
    ventSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    ventSetup.myMrNOTSetup.myVentMultipliers.mySpawnTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myDoneTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.25;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.25;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    ventSetup.myMrNOTSetup.myMrNOTTimeCooldown = new RangeValueOverTime([130, 150], [80, 100], 10, 300, false);
    ventSetup.myMrNOTSetup.myBreakDuration = new RangeValueOverTime([4 * 1.25, 5 * 1.25], [2.5 * 1.25, 3.5 * 1.25], 10, 300, false);

    return ventSetup;
};