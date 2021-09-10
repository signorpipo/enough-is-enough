class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true);

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
        this._myFSM.addState(MainStates.PrepareGame, new PrepareGameState());
        this._myFSM.addState(MainStates.Story, new StoryState());
        this._myFSM.addState(MainStates.Arcade, new ArcadeState());
        this._myFSM.addState(MainStates.PrepareMenu, new PrepareMenuState());

        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.Intro, MainStates.Menu, MainTransitions.Skip);

        this._myFSM.addTransition(MainStates.Menu, MainStates.PrepareGame, MainTransitions.PrepareStory);
        this._myFSM.addTransition(MainStates.Menu, MainStates.PrepareGame, MainTransitions.PrepareArcade);

        this._myFSM.addTransition(MainStates.PrepareGame, MainStates.Story, MainTransitions.StartStory);
        this._myFSM.addTransition(MainStates.PrepareGame, MainStates.Arcade, MainTransitions.StartArcade);

        this._myFSM.addTransition(MainStates.Story, MainStates.PrepareMenu, MainTransitions.End);
        this._myFSM.addTransition(MainStates.Arcade, MainStates.PrepareMenu, MainTransitions.End);

        this._myFSM.addTransition(MainStates.PrepareMenu, MainStates.Menu, MainTransitions.End);
    }
}

var MainStates = {
    Intro: "Intro",
    Menu: "Menu",
    PrepareGame: "PrepareGame",
    Story: "Story",
    Arcade: "Arcade",
    PrepareMenu: "PrepareMenu"
};

var MainTransitions = {
    End: "End",
    Skip: "Skip",
    PrepareStory: "PrepareStory",
    PrepareArcade: "PrepareArcade",
    StartStory: "StartStory",
    StartArcade: "StartArcade"
};