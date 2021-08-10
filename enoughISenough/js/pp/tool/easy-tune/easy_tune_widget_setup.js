PP.EasyTuneWidgetSetup = class EasyTuneWidgetSetup {

    constructor() {
        this._initializeRuntimeSetup();
    }

    _initializeRuntimeSetup() {
        this.myGamepadHandedness = PP.HandednessIndex.RIGHT;

        this.myScrollVariableDelay = 0.5;
        this.myScrollVariableMinXThreshold = 0.6;
        this.myScrollVariableMaxYThreshold = 0.25;
        this.myScrollVariableButtonType = null;
    }
};