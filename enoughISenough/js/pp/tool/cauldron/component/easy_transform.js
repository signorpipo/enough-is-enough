WL.registerComponent("pp-easy-transform", {
    _myScaleAsOne: { type: WL.Type.Bool, default: true }
}, {
    init: function () {
        PP.myEasyTuneVariables.add(new PP.EasyTuneEasyTransform("Easy Transform", this.object.pp_getTransform(), this._myScaleAsOne));
    },
    start: function () {
        PP.myEasyTuneVariables.add(new PP.EasyTuneEasyTransform("Easy Transform", this.object.pp_getTransform(), this._myScaleAsOne));
        PP.setEasyTuneWidgetActiveVariable("Easy Transform");
    },
    update: function () {
        this.object.pp_setTransform(PP.myEasyTuneVariables.get("Easy Transform"));
    }
});