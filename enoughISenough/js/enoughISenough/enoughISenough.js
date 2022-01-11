class enoughISenough {
    constructor() {
        this.prepareSFXSetups();
    }

    start() {
        this._myStatisticsManager = new StatisticsManager();
        this._myStatisticsManager.start();

        this._myMainFSM = new MainFSM();
        this._myMainFSM.init();
    }

    update(dt) {
        this._myMainFSM.update(dt);

        if (PP.XRUtils.isXRSessionActive()) {
            Global.myStatistics.myTotalPlayTime += dt;
        }

        this._myStatisticsManager.update(dt);
    }

    prepareSFXSetups() {
        let manager = Global.myAudioManager;

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/NOT_ENOUGH.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.NOT_ENOUGH, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_1.wav");
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_2.wav");
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/ring_rise.wav");
            audioSetup.myVolume = 0.6;
            audioSetup.myRate = 0.8;
            manager.addAudioSetup(SfxID.RING_RISE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/hand_piece_appear.wav");
            audioSetup.myVolume = 0.2;
            manager.addAudioSetup(SfxID.HAND_PIECE_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_appear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            manager.addAudioSetup(SfxID.MR_NOT_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.5;
            manager.addAudioSetup(SfxID.MR_NOT_DISAPPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_appear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.5;
            manager.addAudioSetup(SfxID.TITLE_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.4;
            manager.addAudioSetup(SfxID.TITLE_DISAPPEAR, audioSetup);
        }
    }
}

var SfxID = {
    NOT_ENOUGH: 0,
    BLABLA_1: 1,
    BLABLA_2: 2,
    RING_RISE: 3,
    HAND_PIECE_APPEAR: 4,
    MR_NOT_APPEAR: 5,
    MR_NOT_DISAPPEAR: 6,
    TITLE_APPEAR: 7,
    TITLE_DISAPPEAR: 8,
};