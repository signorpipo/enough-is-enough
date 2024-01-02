PP.AudioSetup = class AudioSetup {
    constructor(audioFilePath = null) {
        this.myAudioFilePath = (audioFilePath) ? audioFilePath.slice(0) : null;

        this.myLoop = false;
        this.myAutoplay = false;

        this.myVolume = 1.0;
        this._myRate = 1.0; //From 0.5 to 4.0

        this.myPool = 5;

        this.myPreload = false;

        //Spatial
        this.myPosition = null;
        this.mySpatial = true;
        this.myReferenceDistance = 1.0; // At this distance (and closer) the volume is not reduced
    }

    clone() {
        let audioSetup = new PP.AudioSetup();

        audioSetup.myAudioFilePath = this.myAudioFilePath.slice(0);

        audioSetup.myLoop = this.myLoop;
        audioSetup.myAutoplay = this.myAutoplay;

        audioSetup.myVolume = this.myVolume;
        audioSetup._myRate = this._myRate;

        audioSetup.myPool = this.myPool;

        audioSetup.myPreload = this.myPreload;

        //Spatial
        audioSetup.myPosition = this.myPosition;
        audioSetup.mySpatial = this.mySpatial;
        audioSetup.myReferenceDistance = this.myReferenceDistance;

        return audioSetup;
    }

    get myPitch() {
        return this._myRate;
    }

    get myRate() {
        return this._myRate;
    }

    set myPitch(pitch) {
        this._myRate = pitch;
    }

    set myRate(rate) {
        this._myRate = rate;
    }
};