ArcadeState.prototype._chatVentSetup = function () {
    let ventSetup = this._disputeVentSetup(true);

    ventSetup.myVentMultipliers.mySpawnTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.myDoneTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.5;
    ventSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    ventSetup.myMrNOTSetup.myVentMultipliers.mySpawnTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myDoneTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.5;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    ventSetup.myMrNOTSetup.myMrNOTTimeCooldown = new RangeValueOverTime([130, 160], [80, 100], 160, 300, false);
    ventSetup.myMrNOTSetup.myBreakDuration = new RangeValueOverTime([4 * 1.5, 5 * 1.5], [2.5 * 1.5, 3.5 * 1.5], 160, 300, false);

    return ventSetup;
};