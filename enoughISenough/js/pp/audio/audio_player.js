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

PP.AudioSetup = class AudioSetup {
    constructor(audioFilePath = null) {
        this.myAudioFilePath = audioFilePath.slice(0);

        this.myLoop = false;
        this.myAutoplay = false;
        this.myVolume = 1.0;
        this.myPitch = 1.0;

        this.myPool = 5;
    }
};

PP.AudioPlayer = class AudioPlayer {
    constructor(audioSetupOrAudioFilePath) {
        let audioSetup = audioSetupOrAudioFilePath;
        if (typeof audioSetupOrAudioFilePath === 'string') {
            audioSetup = new PP.AudioSetup(audioSetupOrAudioFile);
        }

        this._myAudio = new Howl({
            src: [audioSetup.myAudioFilePath],
            loop: audioSetup.myLoop,
            volume: audioSetup.myVolume,
            autoplay: audioSetup.myAutoplay,
            rate: audioSetup.myPitch,
            pool: audioSetup.myPool,
            preload: true
        });

        this._myLastID = null;

        this._myIsSpatial = false;

        this._myPosition = null;
        this._myPitch = null;

        this._myCallbackMap = new Map();
        for (let eventKey in PP.AudioEvent) {
            this._myCallbackMap.set(PP.AudioEvent[eventKey], new Map());
        }

        this._addListeners();
    }

    play() {
        let id = this._myAudio.play();
        if (id != null) {
            this._myLastID = id;

            this.updatePosition(this._myPosition, true);
            this.updatePitch(this._myPitch, true);
        }

        return id;
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

        if (this._myIsSpatial && position) {
            if (updateOnlyLast) {
                this._myAudio.pos(position[0], position[1], position[2], this._myLastID);
            } else {
                this._myAudio.pos(position[0], position[1], position[2]);
            }
        }
    }

    updatePitch(pitch, updateOnlyLast = false) {
        this.setPitch(pitch);

        if (pitch != null) {
            if (updateOnlyLast) {
                this._myAudio.rate(pitch, this._myLastID);
            } else {
                this._myAudio.rate(pitch);
            }
        }
    }

    setSpatial(spatial) {
        this._myIsSpatial = spatial;
    }

    setPosition(position) {
        this._myPosition = position;
    }

    setPitch(pitch) {
        this._myPitch = pitch;
    }

    resetPosition() {
        this.setPosition(null);
    }

    resetPitch() {
        this.setPitch(null);
    }

    registerAudioEventListener(audioEvent, id, callback) {
        this._myCallbackMap.get(audioEvent).set(id, callback);
    }

    unregisterAudioEventListener(audioEvent, id) {
        this._myCallbackMap.get(audioEvent).delete(id);
    }

    _addListeners() {
        for (let eventKey in PP.AudioEvent) {
            let event = PP.AudioEvent[eventKey];
            this._myAudio.on(event, function (id) {
                let callbacks = this._myCallbackMap.get(event);
                for (let value of callbacks.values()) {
                    value(id);
                }
            }.bind(this));
        }
    }
};