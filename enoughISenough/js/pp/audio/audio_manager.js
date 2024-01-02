PP.AudioManager = class AudioManager {
    constructor() {
        this._myAudioSetupMap = new Map();

        this._myAudioPlayersForPreload = [];
    }

    createAudioPlayer(audioSetupID) {
        return new PP.AudioPlayer(this.getAudioSetup(audioSetupID));
    }

    getAudioSetup(id) {
        return this._myAudioSetupMap.get(id);
    }

    addAudioSetup(id, audioSetup, preload = true) {
        this._myAudioSetupMap.set(id, audioSetup);

        if (preload) {
            let preloadAudioSetup = audioSetup.clone();
            preloadAudioSetup.myPreload = true;
            this._myAudioPlayersForPreload.push(new PP.AudioPlayer(preloadAudioSetup));
        }
    }

    removeAudioSetup(id) {
        this._myAudioSetupMap.delete(id);
    }

    setVolume(volume) {
        Howler.volume(volume);
    }

    setMute(mute) {
        Howler.mute(mute);
    }

    stop() {
        Howler.stop();
    }
};