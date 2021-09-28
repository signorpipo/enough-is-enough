class StoryState extends PP.State {
    constructor() {
        super();
    }

    update(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            fsm.perform(MainTransitions.End);
        }
    }

    init(fsm) {
    }

    start(fsm, transitionID) {
        this._myTimer = new PP.Timer(1);
    }

    end(fsm, transitionID) {
        PP.SaveUtils.save("story_started_once", true);
    }
}