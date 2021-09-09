PP.AudioEvent = {
    END: "end",
    STOP: "stop",
    LOAD: "load",
    LOAD_ERROR: "loaderror",
    PLAY: "play",
    PLAY_ERROR: "playerror",
    PAUSE: "pause",
    MUTE: "mute",
    VOLUME: "volume",
    RATE: "rate",
    SEEK: "seek",
    FADE: "fade",
    UNLOCK: "unlock"
};

PP.AudioPlayer = class AudioPlayer {
    constructor(audioSetupOrAudioFilePath) {
        if (typeof audioSetupOrAudioFilePath === 'string') {
            this._myAudioSetup = new PP.AudioSetup(audioSetupOrAudioFile);
        } else {
            this._myAudioSetup = audioSetupOrAudioFilePath.clone();
        }

        this._myAudio = new Howl({
            src: [this._myAudioSetup.myAudioFilePath],
            loop: this._myAudioSetup.myLoop,
            volume: this._myAudioSetup.myVolume,
            autoplay: this._myAudioSetup.myAutoplay,
            rate: this._myAudioSetup.myRate,
            pool: this._myAudioSetup.myPool,
            preload: true
        });

        this._myAudio._pannerAttr.refDistance = this._myAudioSetup.myReferenceDistance;

        this._myLastAudioID = null;

        this._myCallbackMap = new Map();
        for (let eventKey in PP.AudioEvent) {
            this._myCallbackMap.set(PP.AudioEvent[eventKey], new Map());
        }

        this._addListeners();
    }

    play() {
        let audioID = this._myAudio.play();
        if (audioID != null) {
            this._myLastAudioID = audioID;

            this.updatePosition(this._myAudioSetup.myPosition, true);
            this.updatePitch(this._myAudioSetup.myPitch, true);
        }
    }

    stop() {
        this._myAudio.stop();
    }

    pause() {
        this._myAudio.pause();
    }

    resume() {
        this._myAudio.play();
    }

    updatePosition(position, updateOnlyLast = false) {
        this.setPosition(position);

        if (this._myAudioSetup.mySpatial && position) {
            if (updateOnlyLast) {
                this._myAudio.pos(position[0], position[1], position[2], this._myLastAudioID);
            } else {
                this._myAudio.pos(position[0], position[1], position[2]);
            }
        }
    }

    updatePitch(pitch, updateOnlyLast = false) {
        this.updateRate(pitch, updateOnlyLast);
    }

    updateRate(rate, updateOnlyLast = false) {
        this.setRate(rate);

        if (rate != null) {
            if (updateOnlyLast) {
                this._myAudio.rate(rate, this._myLastAudioID);
            } else {
                this._myAudio.rate(rate);
            }
        }
    }

    setSpatial(spatial) {
        this._myAudioSetup.mySpatial = spatial;
    }

    setPosition(position) {
        this._myAudioSetup.myPosition = position;
    }

    setPitch(pitch) {
        this._myAudioSetup.myPitch = pitch;
    }

    setRate(rate) {
        this._myAudioSetup.myRate = rate;
    }

    registerAudioEventListener(audioEvent, listenerID, callback) {
        this._myCallbackMap.get(audioEvent).set(listenerID, callback);
    }

    unregisterAudioEventListener(audioEvent, listenerID) {
        this._myCallbackMap.get(audioEvent).delete(listenerID);
    }

    _addListeners() {
        for (let eventKey in PP.AudioEvent) {
            let event = PP.AudioEvent[eventKey];
            this._myAudio.on(event, function (audioID) {
                let callbacks = this._myCallbackMap.get(event);
                for (let value of callbacks.values()) {
                    value(audioID);
                }
            }.bind(this));
        }
    }
};