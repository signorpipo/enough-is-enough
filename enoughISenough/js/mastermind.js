class MasterMind{
    constructor() {        
        this.gamepadManager = new GamepadManager();
    }

    start(){
        this.gamepadManager.start();
    }
}

var MM = new MasterMind();