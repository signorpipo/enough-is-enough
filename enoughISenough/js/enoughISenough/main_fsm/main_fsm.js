class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Main", true);

        this._buildFSM();

        this._myMusic = Global.myAudioManager.createAudioPlayer(SfxID.YOU_KNOW);
        this._myStartMusicTimer = new PP.Timer(2.4, false);
        this._myStartMusicTimerAfterLoad = new PP.Timer(0.1, false);
    }

    init() {
        this._myFSM.init(MainStates.Intro);
    }

    update(dt) {
        if (this._myStartMusicTimer.isRunning()) {
            this._myStartMusicTimer.update(dt);
        }

        if (this._myStartMusicTimer.isDone()) {
            if (this._myMusic.isLoaded()) {
                this._myStartMusicTimerAfterLoad.start();
                this._myStartMusicTimer.reset();
            }
        }

        if (this._myStartMusicTimerAfterLoad.isRunning()) {
            this._myStartMusicTimerAfterLoad.update(dt);
            if (this._myStartMusicTimerAfterLoad.isDone()) {
                this._myMusic.stop();
                this._myMusic.play();
                this._myMusic.fade(0, 1, 6);
                this._myStartMusicTimerAfterLoad.reset();
            }
        }

        this._myFSM.update(dt);
    }

    _buildFSM() {
        this._myFSM.addState(MainStates.Intro, new IntroState());
        this._myFSM.addState(MainStates.Menu, new MenuState());
        this._myFSM.addState(MainStates.Trial, new TrialState());
        this._myFSM.addState(MainStates.ArcadeHard, new ArcadeState(true));
        this._myFSM.addState(MainStates.ArcadeNormal, new ArcadeState(false));

        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.End, this._startMusic.bind(this));
        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.Skip, this._startMusic.bind(this));

        this._myFSM.addTransition(MainStates.Menu, MainStates.Trial, MainTransitions.StartTrial);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeHard, MainTransitions.StartArcadeHard);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeNormal, MainTransitions.StartArcadeNormal);
        this._myFSM.addTransition(MainStates.Menu, MainStates.Menu, MainTransitions.Reset);

        this._myFSM.addTransition(MainStates.Trial, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeHard, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeNormal, MainStates.Menu, MainTransitions.End);
    }

    _startMusic() {
        this._myStartMusicTimer.start();
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