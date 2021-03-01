PP.MasterMind = class MasterMind {
    constructor() {        
        this.inputManager = new PP.InputManager();
    }

    start(){
        this.inputManager.start();
    }

    update(dt){
        this.inputManager.update(dt);
    }
}; 