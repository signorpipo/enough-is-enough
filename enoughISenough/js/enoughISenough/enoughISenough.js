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
            let audioSetup = new PP.AudioSetup("assets/audio/music/you_KNOW_22Hz.wav");
            audioSetup.myLoop = true;
            audioSetup.mySpatial = false;
            audioSetup.myVolume = 0.45;
            manager.addAudioSetup(SfxID.YOU_KNOW, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/NOT_ENOUGH.wav");
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.NOT_ENOUGH, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_1.wav");
            audioSetup.myVolume = 0.4;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_1, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blabla_2.wav");
            audioSetup.myVolume = 0.4;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLABLA_2, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/ring_rise.wav");
            audioSetup.myVolume = 0.5;
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
            audioSetup.myVolume = 0.85;
            manager.addAudioSetup(SfxID.MR_NOT_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.45;
            manager.addAudioSetup(SfxID.MR_NOT_DISAPPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_appear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.55;
            manager.addAudioSetup(SfxID.TITLE_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.8;
            manager.addAudioSetup(SfxID.TITLE_DISAPPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_explode.wav");
            audioSetup.myVolume = 0.95;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.CLONE_EXPLODE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_explode.wav");
            audioSetup.myVolume = 0.95;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.MR_NOT_EXPLODE, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/evidence_appear.wav");
            audioSetup.myVolume = 0.2;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.EVIDENCE_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/evidence_disappear.wav");
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.EVIDENCE_DISAPPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/clone_appear.wav");
            audioSetup.myVolume = 0.65;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.CLONE_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_fast_appear.wav");
            audioSetup.myRate = 1.5;
            audioSetup.myVolume = 0.6;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.MR_NOT_FAST_APPEAR, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/grab.wav");
            audioSetup.myVolume = 0.55;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(SfxID.GRAB, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/throw.wav");
            audioSetup.myRate = 0.8;
            audioSetup.myVolume = 0.25;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(SfxID.THROW, audioSetup);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/collision.wav");
            audioSetup.myRate = 0.8;
            audioSetup.myVolume = 0.325;
            audioSetup.myReferenceDistance = 0.3;
            manager.addAudioSetup(SfxID.COLLISION, audioSetup);
        }

        manager.createAudioPlayer(SfxID.RING_RISE);
        for (let i = 0; i <= SfxID.COLLISION; i++) {
            manager.createAudioPlayer(i);
        }

        //This MAY avoid some crackle on first play with position
        let ringRise = manager.createAudioPlayer(SfxID.RING_RISE);
        ringRise.setVolume(0);
        ringRise.play();
        ringRise.updatePosition([0, 0, 0]);
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
    CLONE_EXPLODE: 9,
    MR_NOT_EXPLODE: 10,
    EVIDENCE_APPEAR: 11,
    EVIDENCE_DISAPPEAR: 12,
    CLONE_APPEAR: 13,
    MR_NOT_FAST_APPEAR: 14,
    YOU_KNOW: 15,
    GRAB: 16,
    THROW: 17,
    COLLISION: 18,
};