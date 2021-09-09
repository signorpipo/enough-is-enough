PP.AudioSetup = class AudioSetup {
    constructor(audioFilePath = null) {
        this.myAudioFilePath = (audioFilePath) ? audioFilePath.slice(0) : null;

        this.myLoop = false;
        this.myAutoplay = false;

        this.myVolume = 1.0;
        this.myPitch = 1.0; //From 0.5 to 4.0
        this.myRate = null; //If u specify a value for the rate, it will override the pitch. From 0.5 to 4.0

        this.myPool = 5;

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
        audioSetup.myPitch = this.myPitch;
        audioSetup.myRate = this.myRate;

        audioSetup.myPool = this.myPool;

        //Spatial
        audioSetup.myPosition = this.myPosition;
        audioSetup.mySpatial = this.mySpatial;
        audioSetup.myReferenceDistance = this.myReferenceDistance;

        return audioSetup;
    }
};