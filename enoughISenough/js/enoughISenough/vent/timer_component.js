WL.registerComponent("timer", {
    _myIsTrial: { type: WL.Type.Bool, default: false },
    _mySeconds: { type: WL.Type.Object },
    _myMinutes: { type: WL.Type.Object },
    _myHours: { type: WL.Type.Object },
}, {
    init: function () {
    },
    start: function () {
        this._mySecondsTextComponent = this._mySeconds.pp_getComponent("text");
        this._myMinutesTextComponent = this._myMinutes.pp_getComponent("text");
        this._myHoursTextComponent = this._myHours.pp_getComponent("text");
    },
    update: function (dt) {
        let time = Global.myVentDuration;
        if (this._myIsTrial) {
            time = Global.myTrialDuration;
        }

        time = Math.floor(time);

        let hours = Math.floor(time / 3600);
        time -= hours * 3600;
        let minutes = Math.floor(time / 60);
        time -= minutes * 60;
        let seconds = Math.floor(time);

        this._mySecondsTextComponent.text = (seconds.toFixed(0).length < 2) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0);
        this._myMinutesTextComponent.text = (minutes.toFixed(0).length < 2) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0);
        this._myHoursTextComponent.text = (hours.toFixed(0).length < 2) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0);
    }
});