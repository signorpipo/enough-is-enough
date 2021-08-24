WL.registerComponent("pp-easy-transform", {
    _myScaleAsOne: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        PP.EasyTuneVariables.add(new PP.EasyTuneEasyTransform("Easy Transform", this.object.pp_getTransform(), this._myScaleAsOne));
    },
    start: function () {
        PP.EasyTuneVariables.add(new PP.EasyTuneEasyTransform("Easy Transform", this.object.pp_getTransform(), this._myScaleAsOne));
        PP.SetEasyTuneWidgetActiveVariable("Easy Transform");
    },
    update: function () {
        this.object.pp_setTransform(PP.EasyTuneVariables.get("Easy Transform"));
    }
});