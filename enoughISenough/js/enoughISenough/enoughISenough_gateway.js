WL.registerComponent("enough-IS-enough-gateway", {
    _myPlayerRumbleObject: { type: WL.Type.Object },
    _myRingsAnimator: { type: WL.Type.Object },
    _myLeftHandAnimator: { type: WL.Type.Object },
    _myRightHandAnimator: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myAudioManager = new PP.AudioManager();
        Global.myParticlesManager = new ParticlesManager();
        Global.myScene = this.object;

        Global.myPlayerRumbleObject = this._myPlayerRumbleObject;
        Global.myRingsAnimator = this._myRingsAnimator.pp_getComponent("rings-animator");
        Global.myLeftHandAnimator = this._myLeftHandAnimator.pp_getComponent("hand-animator");
        Global.myRightHandAnimator = this._myRightHandAnimator.pp_getComponent("hand-animator");

        this.enoughISenough = new enoughISenough();
    },
    start: function () {
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float", 0, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Int", 0, 1));
        PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));

        this.enoughISenough.start();
    },
    update: function (dt) {
        this.enoughISenough.update(dt);
        Global.myParticlesManager.update(dt);
    }
});

var Global = {
    myScene: null,
    myAudioManager: null,
    myParticlesManager: null,
    myPlayerRumbleObject: null,
    myRingsAnimator: null,
    myLeftHandAnimator: null,
    myRightHandAnimator: null,
    myGameObjects: new Map(),
    myMeshObjects: new Map(),
    myRingRadius: 0,
    myRingHeight: 0,
    myTitlesObject: null,
    myTitlesRumbleObject: null,
    myTitleObject: null,
    mySubtitleObject: null
};