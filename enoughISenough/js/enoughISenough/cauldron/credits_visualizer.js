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
        let color = this._myText.material.color;
        color[3] = 0;
        this._myText.material.color = color;
        this._myText.active = false;

        this._myGrabbable = this._myWondermelon.pp_getComponent("pp-grabbable");

        this._myWondermelonGrabTime = 0;
        this._mySpawnTimer = new PP.Timer(1.5);
        this._myHideScale = 0.85;

        this._myFSM.init("hide");
    },
    update(dt) {
        this._myFSM.update(dt);
    },
    _hideUpdate(dt) {
        if (this._myGrabbable.isGrabbed()) {
            this._myWondermelonGrabTime += dt;
            if (this._myWondermelonGrabTime > 3.5) {
                this._myText.active = true;
                this._myWondermelonGrabTime = 0;
                this._mySpawnTimer.start();
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
                this._myFSM.perform("unspawn");
            }
        } else {
            this._myWondermelonGrabTime = 0;
        }
    },
    _spawn(dt) {
        if (this._mySpawnTimer.isRunning()) {
            this._mySpawnTimer.update(dt);

            let color = this._myText.material.color;
            color[3] = PP.EasingFunction.easeInOut(this._mySpawnTimer.getPercentage());
            this._myText.material.color = color;

            color = this._myText.material.outlineColor;
            color[3] = PP.EasingFunction.easeInOut(this._mySpawnTimer.getPercentage());
            this._myText.material.outlineColor = color;

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

            let color = this._myText.material.color;
            color[3] = 1 - PP.EasingFunction.easeInOut(this._mySpawnTimer.getPercentage());
            this._myText.material.color = color;

            color = this._myText.material.outlineColor;
            color[3] = 1 - PP.EasingFunction.easeInOut(this._mySpawnTimer.getPercentage());
            this._myText.material.outlineColor = color;

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