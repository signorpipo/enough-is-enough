class enoughISenough {
    constructor() {
        this._myMainFSM = new MainFSM();
    }

    start() {
        this._myMainFSM.start();
    }

    update(dt) {
        this._myMainFSM.update(dt);
    }
}