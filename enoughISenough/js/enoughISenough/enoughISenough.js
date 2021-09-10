class enoughISenough {
    constructor() {
    }

    start() {
        this.prepareSFXSetups();

        this._myMainFSM = new MainFSM();
        this._myMainFSM.init();
    }

    update(dt) {
        this._myMainFSM.update(dt);
    }

    prepareSFXSetups() {
        let manager = PP.AudioManager;

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/NOT_ENOUGH.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.NOT_ENOUGH, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_1.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_2.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/ring_rise.wav");
            audioSetup.myRate = 0.8;
            manager.addAudioSetup(SfxID.RING_RISE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/hand_piece_appear.wav");
            audioSetup.myVolume = 0.2;
            manager.addAudioSetup(SfxID.HAND_PIECE_APPEAR, audioSetup);
        }
    }
}

var SfxID = {
    NOT_ENOUGH: 0,
    BLABLA_1: 1,
    BLABLA_2: 2,
    RING_RISE: 3,
    HAND_PIECE_APPEAR: 4
};