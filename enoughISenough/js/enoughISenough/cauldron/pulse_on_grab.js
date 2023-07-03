WL.registerComponent("pulse-on-grab", {
    _myHandedness: { type: WL.Type.Enum, values: ['left', 'right'], default: 'left' },
}, {
    init: function () {
    },
    start: function () {
        if (this._myHandedness == 0) {
            this._myGamepad = PP.myLeftGamepad;
        } else {
            this._myGamepad = PP.myRightGamepad;
        }

        let grab = this.object.pp_getComponent("pp-grabber-hand");
        grab.registerGrabEventListener(this, this._onGrab.bind(this));
        grab.registerThrowEventListener(this, this._onThrow.bind(this));

        this._myGrabAudio = Global.myAudioManager.createAudioPlayer(SfxID.GRAB);
        this._myThrowAudio = Global.myAudioManager.createAudioPlayer(SfxID.THROW);

        this._myGrabPitch = this._myGrabAudio.getPitch();
        this._myThrowPitch = this._myThrowAudio.getPitch();

        this._myHandednessType = PP.InputUtils.getHandednessByIndex(this._myHandedness)
    },
    _onGrab() {
        let intensity = 0.2;
        let pulseInfo = this._myGamepad.getPulseInfo();
        if (pulseInfo.myIntensity <= intensity) {
            this._myGamepad.pulse(intensity, 0.1);
        }

        this._myGrabAudio.setPosition(this.object.pp_getPosition());
        this._myGrabAudio.setPitch(Math.pp_random(this._myGrabPitch - 0.15, this._myGrabPitch + 0.05));
        this._myGrabAudio.play();

        if (!Global.myHasGrabbedTrackedHandsEventSent) {
            if (PP.InputUtils.getInputSourceType(this._myHandednessType) == PP.InputSourceType.HAND) {
                Global.myHasGrabbedTrackedHandsEventSent = true;

                if (Global.myGoogleAnalytics) {
                    gtag("event", "has_grabbed_with_tracked_hands", {
                        "value": 1
                    });
                }
            }
        }
    },
    _onThrow() {
        let intensity = 0.09;
        let pulseInfo = this._myGamepad.getPulseInfo();
        if (pulseInfo.myIntensity <= intensity) {
            this._myGamepad.pulse(intensity, 0.1);
        }

        this._myThrowAudio.setPosition(this.object.pp_getPosition());
        this._myThrowAudio.setPitch(Math.pp_random(this._myThrowPitch - 0.15, this._myThrowPitch + 0.05));
        this._myThrowAudio.play();
    },
});