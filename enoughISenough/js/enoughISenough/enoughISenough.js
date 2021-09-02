class enoughISenough {
    constructor() {
        this._myMainFSM = new MainFSM();
    }

    start() {
        this.prepareSFXSetups();

        this._myMainFSM.start();
    }

    update(dt) {
        this._myMainFSM.update(dt);
    }

    prepareSFXSetups() {
        let manager = PP.AudioManager;

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/NOT_ENOUGH.wav");
            manager.addAudioSetup(SFX_ID.NOT_ENOUGH, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_1.wav");
            manager.addAudioSetup(SFX_ID.BLABLA_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_2.wav");
            manager.addAudioSetup(SFX_ID.BLABLA_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/ring_rise.wav");
            manager.addAudioSetup(SFX_ID.RING_RISE, audioSetup);
        }
    }
}

SFX_ID = {
    NOT_ENOUGH: 0,
    BLABLA_1: 1,
    BLABLA_2: 2,
    RING_RISE: 3
};