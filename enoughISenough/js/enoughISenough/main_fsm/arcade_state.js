class ArcadeState extends PP.State {
    constructor() {
        super();

        this._myIsHard = false;
    }

    update(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            fsm.perform(MainTransitions.End);
        }
    }

    init(fsm) {
    }

    start(fsm, transition) {
        if (transition.myID == MainTransitions.StartArcadeHard) {
            this._myIsHard = true;
        }

        console.log(this._myIsHard ? "HARD" : "NORMAL");

        this._myTimer = new PP.Timer(1);
    }

    end(fsm, transitionID) {
    }
}