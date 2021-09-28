class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Main");

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
        this._myFSM.addState(MainStates.Story, new StoryState());
        this._myFSM.addState(MainStates.ArcadeHard, new ArcadeState());
        this._myFSM.addState(MainStates.ArcadeNormal, new ArcadeState());

        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.Skip);

        this._myFSM.addTransition(MainStates.Menu, MainStates.Story, MainTransitions.StartStory);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeHard, MainTransitions.StartArcadeHard);
        this._myFSM.addTransition(MainStates.Menu, MainStates.ArcadeNormal, MainTransitions.StartArcadeNormal);
        this._myFSM.addTransition(MainStates.Menu, MainStates.Menu, MainTransitions.Reset);

        this._myFSM.addTransition(MainStates.Story, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeHard, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.ArcadeNormal, MainStates.Menu, MainTransitions.End);
    }
}

var MainStates = {
    Intro: "Intro",
    Menu: "Menu",
    Story: "Story",
    ArcadeHard: "ArcadeHard",
    ArcadeNormal: "ArcadeNormal",
};

var MainTransitions = {
    End: "End",
    Skip: "Skip",
    StartStory: "StartStory",
    StartArcadeHard: "StartArcadeHard",
    StartArcadeNormal: "StartArcadeNormal",
    Reset: "Reset"
};