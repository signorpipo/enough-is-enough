class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "Main", true);

        this._buildFSM();

        this._myMusic = Global.myAudioManager.createAudioPlayer(SfxID.YOU_KNOW);
        this._myStartMusicTimer = new PP.Timer(1.8, false);
        this._myStartMusicTimerAfterLoad = new PP.Timer(0.2, false);
        this._myStopMusicTimer = new PP.Timer(0, false);

        this._myIsMusicPlaying = false;
        this._myMusicVolume = this._myMusic.getVolume();
    }

    init() {
        this._myFSM.init(MainStates.Intro);
    }

    update(dt) {
        this._manageMusic(dt);
        this._myFSM.update(dt);
    }

    _buildFSM() {
        this._myFSM.addState(MainStates.Intro, new IntroState());
        this._myFSM.addState(MainStates.Menu, new MenuState());
        this._myFSM.addState(MainStates.Trial, new TrialState());
        this._myFSM.addState(MainStates.ArcadeHard, new ArcadeState(true));
        this._myFSM.addState(MainStates.ArcadeNormal, new ArcadeState(false));

        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.Skip);

        this._myFSM.addTransition(MainStates.Menu, MainStates.Trial, MainTransitions.StartTrial);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeHard, MainTransitions.StartArcadeHard);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeNormal, MainTransitions.StartArcadeNormal);
        this._myFSM.addTransition(MainStates.Menu, MainStates.Menu, MainTransitions.Reset);

        this._myFSM.addTransition(MainStates.Trial, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeHard, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeNormal, MainStates.Menu, MainTransitions.End);
    }

    _manageMusic(dt) {
        if (Global.myPlayMusic) {
            Global.myPlayMusic = false;
            if (!this._myIsMusicPlaying) {
                if (!(this._myStartMusicTimer.isRunning() || this._myStartMusicTimer.isDone() || this._myStartMusicTimerAfterLoad.isRunning())) {
                    this._myStartMusicTimer.start();
                    this._myStartMusicTimerAfterLoad.reset();
                }
            } else {
                this._myStartMusicTimerAfterLoad.reset();
                this._myStartMusicTimer.reset();
            }

            this._myStopMusicTimer.reset();
        }

        if (Global.myStopMusic) {
            Global.myStopMusic = false;
            if (this._myIsMusicPlaying) {
                if (!this._myStopMusicTimer.isRunning()) {
                    this._myStopMusicTimer.start();
                }
            } else {
                this._myStopMusicTimer.reset();
            }

            this._myStartMusicTimerAfterLoad.reset();
            this._myStartMusicTimer.reset();
        }

        if (this._myStartMusicTimerAfterLoad.isRunning()) {
            this._myStartMusicTimerAfterLoad.update(dt);
            if (this._myStartMusicTimerAfterLoad.isDone()) {
                if (!this._myMusic.isPlaying()) {
                    this._myMusic.stop();
                    this._myMusic.play();
                }
                this._myMusic.fade(0, this._myMusicVolume, 6, true);
                this._myStartMusicTimerAfterLoad.reset();

                this._myIsMusicPlaying = true;
            }
        }

        if (this._myStartMusicTimer.isRunning()) {
            this._myStartMusicTimer.update(dt);
        }

        if (this._myStartMusicTimer.isDone()) {
            if (this._myMusic.isLoaded()) {
                this._myStartMusicTimerAfterLoad.start();
                this._myStartMusicTimer.reset();
            }
        }

        if (this._myStopMusicTimer.isRunning()) {
            this._myStopMusicTimer.update(dt);
            if (this._myStopMusicTimer.isDone()) {
                this._myMusic.fade(this._myMusicVolume, 0, 0.05, true);
                //this._myMusic.updateVolume(0, true);
                this._myStopMusicTimer.reset();
                this._myIsMusicPlaying = false;
            }
        }
    }
}

var MainStates = {
    Intro: "Intro",
    Menu: "Menu",
    Trial: "Trial",
    ArcadeHard: "ArcadeHard",
    ArcadeNormal: "ArcadeNormal",
};

var MainTransitions = {
    End: "End",
    Skip: "Skip",
    StartTrial: "StartTrial",
    StartArcadeHard: "StartArcadeHard",
    StartArcadeNormal: "StartArcadeNormal",
    Reset: "Reset"
};