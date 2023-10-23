class NotEnough {
    constructor(audioPosition = null) {
        this._myTimer = new PP.Timer(1, false);
        this._myExtraTimer = new PP.Timer(2, false);
        this._myNotEnoughAudio = Global.myAudioManager.createAudioPlayer(SfxID.NOT_ENOUGH);
        this._myAudioPosition = audioPosition;
    }

    start() {
        this._myTimer.start();

        if (this._myAudioPosition && false) {
            this._myNotEnoughAudio.setPosition(this._myAudioPosition);
        } else {
            this._updateAudioPosition();
        }

        this._myNotEnoughAudio.play();

        this._myLeftTimer = new PP.Timer(0);
        this._myRightTimer = new PP.Timer(0);

        this._myLastLeftIntensity = 0.4;
        this._myLastRightIntensity = 0.4;

        if (Math.pp_random() < 0.5) {
            this._myLastRightIntensity = 0.7;
        } else {
            this._myLastLeftIntensity = 0.7;
        }
    }

    stop() {
        this._myTimer.reset();
        Global.myPlayerRumbleObject.pp_resetPositionLocal();
        Global.myTitlesRumbleObject.pp_resetPositionLocal();
        this._myExtraTimer.start();
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            this._updateAudioPosition();

            let rumbleValue = 0.04;
            Global.myPlayerRumbleObject.pp_setPositionLocal([Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue)]);
            rumbleValue = 8;
            Global.myTitlesRumbleObject.pp_setPositionLocal([Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue), Math.pp_random(-rumbleValue, rumbleValue)]);

            this._myLeftTimer.update(dt);
            if (this._myLeftTimer.isDone()) {
                this._myLeftTimer.start(Math.pp_random(0.25, 0.4));

                let intensity = Math.pp_random(0.3, 0.5);
                if (this._myLastLeftIntensity < 0.55) {
                    intensity = Math.pp_random(0.65, 0.8);
                }
                this._myLastLeftIntensity = intensity;

                PP.myLeftGamepad.pulse(intensity, this._myLeftTimer.getDuration() + 0.05);
            }

            this._myRightTimer.update(dt);
            if (this._myRightTimer.isDone()) {
                this._myRightTimer.start(Math.pp_random(0.25, 0.4));

                let intensity = Math.pp_random(0.3, 0.5);
                if (this._myLastRightIntensity < 0.55) {
                    intensity = Math.pp_random(0.65, 0.8);
                }
                this._myLastRightIntensity = intensity;

                PP.myRightGamepad.pulse(intensity, this._myRightTimer.getDuration() + 0.05);
            }

            if (this._myTimer.isDone()) {
                this.stop();

                PP.myLeftGamepad.pulse(this._myLastLeftIntensity, Math.pp_random(0.25, 0.35));
                PP.myRightGamepad.pulse(this._myLastRightIntensity, Math.pp_random(0.25, 0.35));
            }

        }

        if (this._myExtraTimer.isRunning()) {
            this._myExtraTimer.update(dt);
            this._updateAudioPosition();
        }
    }

    _updateAudioPosition() {
        let position = Global.myPlayerPosition.vec3_clone();
        position.vec3_add(Global.myPlayerUp.vec3_scale(0.15), position);
        position.vec3_add(Global.myPlayerForward.vec3_scale(0.5), position);
        this._myNotEnoughAudio.updatePosition(position, true);
    }

    isNotEnoughing() {
        return this._myTimer.isRunning();
    }
}