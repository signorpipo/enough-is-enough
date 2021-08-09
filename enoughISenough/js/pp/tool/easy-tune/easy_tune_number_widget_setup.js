PP.EasyTuneNumberWidgetSetup = class EasyTuneNumberWidgetSetup {

    constructor() {
        this._initializeBuildSetup();
        this._initializeRuntimeSetup();
    }

    _initializeBuildSetup() {
        //General
        this.myBackgroundColor = [46 / 255, 46 / 255, 46 / 255, 1];

        this.myCursorTargetCollisionCollider = 2; // box
        this.myCursorTargetCollisionGroup = 7;
        this.myCursorTargetCollisionThickness = 0.001;

        this.myDefaultTextColor = [255 / 255, 255 / 255, 255 / 255, 1];

        this.myTextAlignment = 2; // center
        this.myTextJustification = 2; // middle
        this.myTextOutlineRange = [0.45, 0.45];
        this.myTextColor = this.myDefaultTextColor;
        this.myTextOutlineColor = this.myDefaultTextColor;

        //Pivot
        this.myPivotObjectPositions = [];
        this.myPivotObjectPositions[PP.HandednessIndex.NONE] = [0, 0, 0];
        this.myPivotObjectPositions[PP.HandednessIndex.LEFT] = [-0.04, 0, 0.00003713]; //little "random" z offset to avoid glitching with other widgets
        this.myPivotObjectPositions[PP.HandednessIndex.RIGHT] = [-0.08, 0, 0.00003713];

        let panelZ = 0.01;
        let distanceFromBorder = 0.0125;
        let colliderZPosition = 0.017;
        let backgroundHalfWidth = 0.2;

        this.mySideButtonBackgroundScale = [0.015, 0.015, 1];
        this.mySideButtonTextScale = [0.18, 0.18, 0.18];
        this.mySideButtonTextPosition = [0, 0, 0.007];

        this.mySideButtonCursorTargetPosition = [0, 0, 0];
        this.mySideButtonCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.mySideButtonCollisionExtents = this.mySideButtonBackgroundScale.slice(0);
        this.mySideButtonCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myLeftSideButtonPosition = [0, 0, 0];
        this.myLeftSideButtonPosition[0] = -backgroundHalfWidth + this.mySideButtonBackgroundScale[0] + distanceFromBorder;

        this.myRightSideButtonPosition = [0, 0, 0];
        this.myRightSideButtonPosition[0] = backgroundHalfWidth - this.mySideButtonBackgroundScale[0] - distanceFromBorder;

        this.myIncreaseButtonText = "+";
        this.myDecreaseButtonText = "-";

        //Display
        this.myDisplayPanelPosition = [0, 0.1, 0];

        this.myVariableLabelPanelPosition = [0, 0.025, panelZ];
        this.myVariableLabelTextScale = [0.19, 0.19, 0.19];

        this.myValuePanelPosition = [0, -0.03, panelZ];
        this.myValueTextScale = [0.4, 0.4, 0.4];

        this.myValueCursorTargetPosition = [0, 0, 0];
        this.myValueCursorTargetPosition[2] = colliderZPosition - panelZ;
        this.myValueCollisionExtents = [0.065, 0.02, 1];
        this.myValueCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        this.myNextButtonText = ">";
        this.myPreviousButtonText = "<";

        //Step
        this.myStepPanelPosition = [0, 0.015, panelZ];
        this.myStepTextScale = [0.19, 0.19, 0.19];
        this.myStepStartString = "Step: ";

        this.myStepCursorTargetPosition = [0, 0, 0];
        this.myStepCursorTargetPosition[2] = colliderZPosition - this.myStepPanelPosition[2];
        this.myStepCollisionExtents = [0.045, 0.0175, 1];
        this.myStepCollisionExtents[2] = this.myCursorTargetCollisionThickness;

        //Background
        {
            let maxY = this.myDisplayPanelPosition[1] + this.myVariableLabelPanelPosition[1] + this.mySideButtonBackgroundScale[1] + distanceFromBorder * 1.25;
            let minY = this.myStepPanelPosition[1] - distanceFromBorder * 1.25 - this.mySideButtonBackgroundScale[1];
            this.myBackPanelPosition = [0, (maxY + minY) / 2, 0];
            this.myBackBackgroundScale = [backgroundHalfWidth, (maxY - minY) / 2, 1];
            this.myBackBackgroundColor = [70 / 255, 70 / 255, 70 / 255, 1];
        }

        //Pointer
        this.myPointerCollisionExtents = this.myBackBackgroundScale.slice(0);
        this.myPointerCollisionExtents[2] = this.myCursorTargetCollisionThickness;
        this.myPointerCursorTargetPosition = this.myBackPanelPosition.slice(0);
        this.myPointerCursorTargetPosition[2] = colliderZPosition - 0.0001; // a little behind the button target to avoid hiding it
    }

    _initializeRuntimeSetup() {
        this.myButtonHoverColor = [150 / 255, 150 / 255, 150 / 255, 1];
        this.myTextHoverScaleMultiplier = [1.25, 1.25, 1.25];

        this.myEditThumbstickMinThreshold = 0.2;
        this.myStepMultiplierStepPerSecond = 2.25;
        this.myButtonEditDelay = 0.25;
    }
};