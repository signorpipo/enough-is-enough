WL.registerComponent("pp-easy-transform", {

}, {
    init: function () {
        PP.EasyTuneVariables.add(new PP.EasyTuneEasyTransform("Easy Transform", this.object.pp_getTransform(), false));
    },
    start: function () {
        PP.SetEasyTuneWidgetActiveVariable("Easy Transform");
    },
    update: function () {
        this.object.pp_setTransform(PP.EasyTuneVariables.get("Easy Transform"));
    }
});