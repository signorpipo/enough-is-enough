PP.MasterMind = class MasterMind {
    constructor() {        
        this.gamepadManager = new PP.GamepadManager();
    }

    start(){
        this.gamepadManager.start();
    }

    update(dt){
        this.gamepadManager.update(dt);
    }
}; 