ArcadeState.prototype._chatVentSetup = function () {
    let ventSetup = this._disputeVentSetup();

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

    //remove group 4 and 5

    return ventSetup;
};