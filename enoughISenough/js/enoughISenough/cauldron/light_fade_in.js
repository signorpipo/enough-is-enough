WL.registerComponent("light-fade-in", {
}, {
    init: function () {
    },
    start: function () {
        this._myLight = this.object.pp_getComponent("light");
        this._myLightColor = this._myLight.color.pp_clone();

        this._myLight.color[0] = 0;
        this._myLight.color[1] = 0;
        this._myLight.color[2] = 0;

        this._myFadeTimer = new PP.Timer(Global.myLightFadeInTime);
        this._myFadeOutTimer = new PP.Timer(Global.myLightFadeInTime);

        this._myLastFadeOut = false;
    },
    update(dt) {
        if (!Global.myStartFadeOut && this._myFadeTimer.isRunning()) {
            this._myFadeTimer.update(dt);

            this._myLight.color[0] = this._myLightColor[0] * PP.EasingFunction.easeOut(this._myFadeTimer.getPercentage());
            this._myLight.color[1] = this._myLightColor[1] * PP.EasingFunction.easeOut(this._myFadeTimer.getPercentage());
            this._myLight.color[2] = this._myLightColor[2] * PP.EasingFunction.easeOut(this._myFadeTimer.getPercentage());
        }

        if (!this._myLastFadeOut && Global.myStartFadeOut) {
            this._myFadeOutTimer.start(Global.myLightFadeInTime);
        }
        this._myLastFadeOut = Global.myStartFadeOut;

        if (Global.myStartFadeOut) {
            if (this._myFadeOutTimer.isRunning()) {
                this._myFadeOutTimer.update(dt);

                this._myLight.color[0] = this._myLightColor[0] * (1 - PP.EasingFunction.easeIn(this._myFadeOutTimer.getPercentage()));
                this._myLight.color[1] = this._myLightColor[1] * (1 - PP.EasingFunction.easeIn(this._myFadeOutTimer.getPercentage()));
                this._myLight.color[2] = this._myLightColor[2] * (1 - PP.EasingFunction.easeIn(this._myFadeOutTimer.getPercentage()));
            }
        }

    },
    onActivate: function () {
        this._myFadeTimer.start(Global.myLightFadeInTime);
    },
    onDeactivate: function () {
        this._myLight.color[0] = 0;
        this._myLight.color[1] = 0;
        this._myLight.color[2] = 0;
    },
});