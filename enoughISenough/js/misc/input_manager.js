PP.InputManager = class InputManager {

    constructor() {
        this.myLeftGamepad = new PP.Gamepad(PP.Handedness.LEFT);
        this.myRightGamepad = new PP.Gamepad(PP.Handedness.RIGHT);
    }

    start() {
        this.myLeftGamepad.start();
        this.myRightGamepad.start();
    }

    update(dt) {
        this.myLeftGamepad.update(dt);
        this.myRightGamepad.update(dt);
    }

    getGamepad(handedness){
        if(handedness == PP.Handedness.LEFT){
            return this.myLeftGamepad
        }

        return this.myRightGamepad;
    }
};