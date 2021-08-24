WL.registerComponent('pp-easy-tune', {
    _myHandedness: { type: WL.Type.Enum, values: ['none', 'left', 'right'], default: 'none' },
    _myShowOnStart: { type: WL.Type.Bool, default: false },
    _myShowVisibilityButton: { type: WL.Type.Bool, default: true },
    _myEnableAdditionalButtons: { type: WL.Type.Bool, default: false },
    _myEnableChangeVariableShortcut: { type: WL.Type.Bool, default: true },
    _myPlaneMaterial: { type: WL.Type.Material, default: null },
    _myTextMaterial: { type: WL.Type.Material, default: null }
}, {
    init: function () {
        //Examples
        //Number: PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Speed", 10.32, 0.01, 3));
        //Integer: PP.EasyTuneVariables.add(new PP.EasyTuneInt("Lives", 3, 1));
        //Bool: PP.EasyTuneVariables.add(new PP.EasyTuneBool("Run", false));

        PP.EasyTuneVariables = new PP.EasyTuneVariableMap();

        this._myWidget = new PP.EasyTuneWidget();
        PP.SetEasyTuneWidgetActiveVariable = function (variableName) {
            this._myWidget.setEasyTuneWidgetActiveVariable(variableName);
        }.bind(this);
    },
    start: function () {

        let additionalSetup = {};
        additionalSetup.myHandednessIndex = this._myHandedness;
        additionalSetup.myHandedness = PP.InputUtils.getHandednessByIndex(this._myHandedness);
        additionalSetup.myShowOnStart = this._myShowOnStart;
        additionalSetup.myShowVisibilityButton = this._myShowVisibilityButton;
        additionalSetup.myEnableAdditionalButtons = this._myEnableAdditionalButtons;
        additionalSetup.myEnableChangeVariableShortcut = this._myEnableChangeVariableShortcut;
        additionalSetup.myPlaneMaterial = this._myPlaneMaterial;
        additionalSetup.myTextMaterial = this._myTextMaterial;

        this._myWidget.start(this.object, additionalSetup, PP.EasyTuneVariables._getInternalMap());
    },
    update: function (dt) {
        this._myWidget.update(dt);
    }
});

PP.EasyTuneVariables = null;

PP.SetEasyTuneWidgetActiveVariable = function () {
    console.log("SetEasyTuneWidgetActiveVariable function not initialized yet");
};