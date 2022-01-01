class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Main", true);

        this._buildFSM();
    }

    init() {
        this._myFSM.init(MainStates.Intro);
    }

    update(dt) {
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