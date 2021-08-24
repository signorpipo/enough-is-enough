/**
 * A quick and simple way to have the gamepads up and running
 * Add this manager to an object that will never available destroyed (like the Player object)
 * otherwise the gamepads will not be updated anymore
 */
WL.registerComponent('pp-gamepads-manager', {
}, {
    init: function () {
        PP.LeftGamepad = new PP.Gamepad(PP.GamepadHandedness.LEFT);
        PP.RightGamepad = new PP.Gamepad(PP.GamepadHandedness.RIGHT);

        PP.Gamepads = [];
        PP.Gamepads[PP.Handedness.LEFT] = PP.LeftGamepad;
        PP.Gamepads[PP.Handedness.RIGHT] = PP.RightGamepad;
    },
    start: function () {
        PP.LeftGamepad.start();
        PP.RightGamepad.start();
    },
    update: function (dt) {
        PP.LeftGamepad.update(dt);
        PP.RightGamepad.update(dt);
    },
});

PP.LeftGamepad = null;
PP.RightGamepad = null;
PP.Gamepads = null;