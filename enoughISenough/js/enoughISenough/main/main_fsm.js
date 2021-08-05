class MainFSM {
    constructor() {
        this._myFSM = new PP.FSM();

        this._buildFSM();
    }

    start() {
        this._myFSM.start(MainStates.Menu);
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    _buildFSM() {
        this._myFSM.addState(MainStates.Menu, new MenuState());
    }
}

var MainStates = {
    Menu: "Menu"
};