ArcadeState.prototype._chatVentSetup = function () {
    let ventSetup = this._disputeVentSetup();

    ventSetup.myVentMultipliers.mySpawnTimeMultiplier *= 2;
    ventSetup.myVentMultipliers.myDoneTimeMultiplier *= 2;
    ventSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.25;
    ventSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.25;
    ventSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    ventSetup.myMrNOTSetup.myVentMultipliers.mySpawnTimeMultiplier *= 2;
    ventSetup.myMrNOTSetup.myVentMultipliers.myDoneTimeMultiplier *= 2;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakTimeMultiplier *= 1.25;
    ventSetup.myMrNOTSetup.myVentMultipliers.myBreakDelayTimeMultiplier *= 1;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakTimeMultiplier *= 1.25;
    ventSetup.myMrNOTSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier *= 1;

    return ventSetup;
};