WL.registerComponent("credits-visualizer", {
    _myWondermelon: { type: WL.Type.Object }
}, {
    init: function () {
        this._myFSM = new PP.FSM();
        this._myFSM.addState("hide", this._hideUpdate.bind(this));
        this._myFSM.addState("visible", this._visibleUpdate.bind(this));
        this._myFSM.addState("spawning", this._spawn.bind(this));
        this._myFSM.addState("unspawning", this._unspawn.bind(this));

        this._myFSM.addTransition("hide", "spawning", "spawn");
        this._myFSM.addTransition("spawning", "visible", "end");
        this._myFSM.addTransition("visible", "unspawning", "unspawn");
        this._myFSM.addTransition("unspawning", "hide", "end");
    },
    start: function () {
        this._myText = this.object.pp_getComponentHierarchy("text");
        this._myText.material = this._myText.material.clone();
        this._myTextColor = this._myText.material.color.pp_clone();

        let color = this._myText.material.color;
        color[3] = 0;
        this._myText.material.color = color;
        this._myText.active = false;

        this._myGrabbable = this._myWondermelon.pp_getComponent("pp-grabbable");

        this._myWondermelonGrabTime = 0;
        this._mySpawnTimer = new PP.Timer(1.5);
        this._myHideScale = 0.85;

        this._myAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.TITLE_APPEAR);
        this._myDisappearAudio = Global.myAudioManager.createAudioPlayer(SfxID.TITLE_DISAPPEAR);
        this._myAppearAudio.setPosition(this.object.pp_getPosition());
        this._myDisappearAudio.setPosition(this.object.pp_getPosition());

        this._myFSM.init("hide");
    },
    update(dt) {
        this._myFSM.update(dt);
    },
    _hideUpdate(dt) {
        if (this._myGrabbable.isGrabbed() && Global.myIsInMenu) {
            this._myWondermelonGrabTime += dt;
            if (this._myWondermelonGrabTime > 3) {
                this._myText.active = true;
                this._myWondermelonGrabTime = 0;
                this._mySpawnTimer.start();

                this._myAppearAudio.play();
                this._myFSM.perform("spawn");

            }
        } else {
            this._myWondermelonGrabTime = 0;
        }
    },
    _visibleUpdate(dt) {
        if (!this._myGrabbable.isGrabbed()) {
            this._myWondermelonGrabTime += dt;
            if (this._myWondermelonGrabTime > 1) {
                this._myWondermelonGrabTime = 0;
                this._mySpawnTimer.start();
                this._myDisappearAudio.play();
                this._myFSM.perform("unspawn");
            }
        } else {
            this._myWondermelonGrabTime = 0;
        }
    },
    _spawn(dt) {
        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);

            let tempColor = [0, 0, 0, 1];

            tempColor[0] = Math.pp_interpolate(0, this._myTextColor[0], this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);
            tempColor[1] = Math.pp_interpolate(0, this._myTextColor[1], this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);
            tempColor[2] = Math.pp_interpolate(0, this._myTextColor[2], this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);

            this._myText.material.color = tempColor;

            let easing = t => t * (2 - t);
            this._myText.object.pp_setScale(Math.pp_interpolate(this._myHideScale, 1, this._mySpawnTimer.getPercentage(), easing));

            if (this._mySpawnTimer.isDone()) {
                this._myFSM.perform("end");
            }
        }
    },
    _unspawn(dt) {
        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);

            let tempColor = [0, 0, 0, 1];

            tempColor[0] = Math.pp_interpolate(this._myTextColor[0], 0, this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);
            tempColor[1] = Math.pp_interpolate(this._myTextColor[1], 0, this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);
            tempColor[2] = Math.pp_interpolate(this._myTextColor[2], 0, this._mySpawnTimer.getPercentage(), PP.EasingFunction.easeInOut);

            this._myText.material.color = tempColor;

            let easing = t => t * t;
            let scale = Math.pp_interpolate(1, this._myHideScale, this._mySpawnTimer.getPercentage(), easing);
            this._myText.object.pp_setScale(scale);

            if (this._mySpawnTimer.isDone()) {
                this._myText.active = false;
                this._myFSM.perform("end");
            }
        }
    }
});