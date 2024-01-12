class enoughISenough {
    constructor() {
        this.prepareSFXSetups();
    }

    start() {
        Global.myStatisticsManager = new StatisticsManager();
        Global.myStatisticsManager.start();

        this._myMainFSM = new MainFSM();
        this._myMainFSM.init();
    }

    update(dt) {
        Global.myTotalTimeUpdated = false;

        this._myMainFSM.update(dt);

        if (PP.XRUtils.isXRSessionActive() && !Global.myTotalTimeUpdated) {
            Global.myTotalTimeUpdated = true;
            Global.myStatistics.myTotalPlayTime += dt;
        }

        Global.myStatisticsManager.update(dt);

        Global.myAudioPoolMap.update(dt);
    }

    prepareSFXSetups() {
        Global.myAudioPoolMap = new PP.AudioPoolManager();

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

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.NOT_ENOUGH);
            };
            //Global.myAudioPoolMap.addPool(SfxID.NOT_ENOUGH, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blather_0.wav");
            audioSetup.myVolume = 0.4;
            audioSetup.myPool = 10;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLATHER_0, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 2;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.BLATHER_0);
            };
            Global.myAudioPoolMap.addPool(SfxID.BLATHER_0, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blather_1.wav");
            audioSetup.myVolume = 0.4;
            audioSetup.myPool = 10;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLATHER_1, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 2;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.BLATHER_1);
            };
            Global.myAudioPoolMap.addPool(SfxID.BLATHER_1, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/blather_dot.wav");
            audioSetup.myVolume = 0.4;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.BLATHER_DOT, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.BLATHER_DOT);
            };
            //Global.myAudioPoolMap.addPool(SfxID.BLATHER_DOT, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/ring_rise.wav");
            audioSetup.myVolume = 0.5;
            audioSetup.myRate = 0.8;
            manager.addAudioSetup(SfxID.RING_RISE, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.RING_RISE);
            };
            //Global.myAudioPoolMap.addPool(SfxID.RING_RISE, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/hand_piece_appear.wav");
            audioSetup.myVolume = 0.2;
            manager.addAudioSetup(SfxID.HAND_PIECE_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.HAND_PIECE_APPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.HAND_PIECE_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_appear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.85;
            manager.addAudioSetup(SfxID.MR_NOT_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 2;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_APPEAR);
            };
            Global.myAudioPoolMap.addPool(SfxID.MR_NOT_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.45;
            manager.addAudioSetup(SfxID.MR_NOT_DISAPPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 2;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_DISAPPEAR);
            };
            Global.myAudioPoolMap.addPool(SfxID.MR_NOT_DISAPPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_appear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.55;
            manager.addAudioSetup(SfxID.TITLE_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.TITLE_APPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.TITLE_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/title_disappear.wav");
            audioSetup.myReferenceDistance = 1000000;
            audioSetup.myPitch = 0.8;
            audioSetup.myVolume = 0.8;
            manager.addAudioSetup(SfxID.TITLE_DISAPPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.TITLE_DISAPPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.TITLE_DISAPPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_explode.wav");
            audioSetup.myVolume = 0.95;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.CLONE_EXPLODE, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 20;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.CLONE_EXPLODE);
            };
            Global.myAudioPoolMap.addPool(SfxID.CLONE_EXPLODE, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_explode.wav");
            audioSetup.myVolume = 0.95;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.MR_NOT_EXPLODE, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_EXPLODE);
            };
            //Global.myAudioPoolMap.addPool(SfxID.MR_NOT_EXPLODE, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/evidence_appear.wav");
            audioSetup.myVolume = 0.2;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.EVIDENCE_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.EVIDENCE_APPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.EVIDENCE_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/evidence_disappear.wav");
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 3;
            manager.addAudioSetup(SfxID.EVIDENCE_DISAPPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.EVIDENCE_DISAPPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.EVIDENCE_DISAPPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/clone_appear.wav");
            audioSetup.myVolume = 0.65;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.CLONE_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 20;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.CLONE_APPEAR);
            };
            Global.myAudioPoolMap.addPool(SfxID.CLONE_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/mr_NOT_fast_appear.wav");
            audioSetup.myRate = 1.5;
            audioSetup.myVolume = 0.6;
            audioSetup.myReferenceDistance = 1000000;
            manager.addAudioSetup(SfxID.MR_NOT_FAST_APPEAR, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_FAST_APPEAR);
            };
            //Global.myAudioPoolMap.addPool(SfxID.MR_NOT_FAST_APPEAR, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/grab.wav");
            audioSetup.myVolume = 0.55;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPool = 15;
            manager.addAudioSetup(SfxID.GRAB, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.GRAB);
            };
            //Global.myAudioPoolMap.addPool(SfxID.GRAB, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/throw.wav");
            audioSetup.myRate = 0.7;
            audioSetup.myVolume = 0.225;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPool = 15;
            manager.addAudioSetup(SfxID.THROW, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.THROW);
            };
            //Global.myAudioPoolMap.addPool(SfxID.THROW, audioPoolParams);
        }

        {
            let audioSetup = new PP.AudioSetup("assets/audio/sfx/collision.wav");
            audioSetup.myRate = 0.8;
            audioSetup.myVolume = 0.5;
            audioSetup.myReferenceDistance = 0.3;
            audioSetup.myPool = 10;
            manager.addAudioSetup(SfxID.COLLISION, audioSetup);

            let audioPoolParams = new PP.AudioPoolParams();
            audioPoolParams.myPercentageToAddWhenEmpty = 0;
            audioPoolParams.myInitialPoolSize = 1;
            audioPoolParams.myCloneFunction = function () {
                return Global.myAudioManager.createAudioPlayer(SfxID.COLLISION);
            };
            //Global.myAudioPoolMap.addPool(SfxID.COLLISION, audioPoolParams);
        }

        //This MAY avoid some crackle on first play with position
        this._myRingRiseFixFirstPlayCrackleAudioPlayer = manager.createAudioPlayer(SfxID.RING_RISE);
        this._myRingRiseFixFirstPlayCrackleAudioPlayer.setVolume(0);
        this._myRingRiseFixFirstPlayCrackleAudioPlayer.updatePosition([0, -10000, 0]);
        this._myRingRiseFixFirstPlayCrackleAudioPlayer.play();
        this._myRingRiseFixFirstPlayCrackleAudioPlayer.updatePosition([0, -10000, 0]);
    }
}

var SfxID = {
    NOT_ENOUGH: 0,
    BLATHER_0: 1,
    BLATHER_1: 2,
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
    BLATHER_DOT: 19,
};