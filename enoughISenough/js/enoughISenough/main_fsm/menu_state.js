class MenuState extends PP.State {
    constructor() {
        super();

        this._myResetCount = 0;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "    Menu");
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning_reset", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_restart", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_arcade_hard", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_arcade_normal", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_story", this._unspawn.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("ready", "unspawning_arcade_hard", "unspawn_arcade_hard", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_arcade_normal", "unspawn_arcade_normal", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_story", "unspawn_story", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_reset", "unspawn_reset", this._startUnspawningReset.bind(this));
        this._myFSM.addTransition("ready", "unspawning_restart", "unspawn_restart", this._startUnspawningRestart.bind(this));
        this._myFSM.addTransition("unspawning_arcade_hard", "done", "end", this._endArcadeHard.bind(this));
        this._myFSM.addTransition("unspawning_arcade_normal", "done", "end", this._endArcadeNormal.bind(this));
        this._myFSM.addTransition("unspawning_story", "done", "end", this._endStory.bind(this));
        this._myFSM.addTransition("unspawning_reset", "done", "end", this._endReset.bind(this));
        this._myFSM.addTransition("unspawning_restart", "done", "end", this._endRestart.bind(this));

        this._myMenuItems = [];
        this._myStartStory = null;
        this._myStartStoryCompleted = null;
        this._myCurrentMenuItems = [];

        this._myMenuTitle = new MenuTitle(Global.myTitlesObject, Global.myTitleObject, Global.mySubtitleObject);

        this._myNotEnough = new NotEnough();

        this._fillMenuItems();

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Time", 0.1, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Scale", 2.5, 1, 3));
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;

        let storyStartedOnce = PP.SaveUtils.loadBool("story_started_once");
        if (storyStartedOnce) {
            this._myCurrentMenuItems = [];

            let storyCompleted = PP.SaveUtils.loadBool("story_completed");
            if (storyCompleted) {
                this._myCurrentMenuItems.push(this._myStartStoryCompleted);
            } else {
                this._myCurrentMenuItems.push(this._myStartStory);
            }

            for (let item of this._myMenuItems) {
                this._myCurrentMenuItems.push(item);
            }
        } else {
            this._myCurrentMenuItems = [];
            this._myCurrentMenuItems.push(this._myStartStory);
        }

        let times = [];
        times[0] = Math.pp_random(0.15, 0.55);
        for (let i = 1; i < this._myCurrentMenuItems.length; i++) {
            times[i] = times[i - 1] + Math.pp_random(0.15, 0.55);
        }

        for (let item of this._myCurrentMenuItems) {
            let randomIndex = Math.pp_randomInt(0, times.length - 1);
            let timeBeforeFirstSpawn = times.pp_removeIndex(randomIndex);
            item.init(timeBeforeFirstSpawn);
        }

        this._myMenuTitle.spawn(Math.pp_random(0.35, 0.7));

        this._myFSM = this._myFSM.clone();
        this._myFSM.init("ready");

        this._myResetCount = 0;
    }

    _readyUpdate(dt, fsm) {
        for (let item of this._myCurrentMenuItems) {
            item.update(dt);
        }

        this._myMenuTitle.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_story");
            }

            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_arcade_hard");
            }

            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_restart");
            }
        }
    }

    _startUnspawning(fsm) {
        this._myUnspawnList = [];

        let indexList = [];
        for (let i = 0; i < this._myCurrentMenuItems.length; i++) {
            if (this._myCurrentMenuItems[i].canUnspawn()) {
                indexList.push(i);
            }

            this._myCurrentMenuItems[i].setAutoSpawn(false);
        }

        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_removeIndex(randomIndex);

            let randomTimer = Math.pp_random(0.20, 0.25);
            this._myUnspawnList.push([index, new PP.Timer(randomTimer)]);
        }

        this._myMenuTitle.unspawn(Math.pp_random(0.35, 0.7));
    }

    _startUnspawningRestart(fsm) {
        this._startUnspawning();
    }

    _startUnspawningReset(fsm) {
        this._myResetCount = 0;
        PP.SaveUtils.save("story_started_once", false);
        PP.SaveUtils.save("story_completed", false);
        this._myNotEnough.start();

        this._startUnspawning();
    }

    _unspawn(dt, fsm) {
        this._myNotEnough.update(dt);

        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                this._myCurrentMenuItems[first[0]].unspawn();
                this._myUnspawnList.shift();
            }
        }

        for (let item of this._myCurrentMenuItems) {
            item.update(dt);
        }

        this._myMenuTitle.update(dt);

        let done = true;
        for (let item of this._myCurrentMenuItems) {
            done = done && item.isInactive();
        }
        done = done && this._myMenuTitle.isHidden();

        if (done && !this._myNotEnough.isNotEnoughing()) {
            fsm.perform("end");
        }
    }

    _endArcadeHard(fsm) {
        this._myParentFSM.perform(MainTransitions.StartArcadeHard);
    }

    _endArcadeNormal(fsm) {
        this._myParentFSM.perform(MainTransitions.StartArcadeNormal);
    }

    _endStory(fsm) {
        this._myParentFSM.performDelayed(MainTransitions.StartStory);
    }

    _endReset(fsm) {
        this._myParentFSM.perform(MainTransitions.Reset);
    }

    _endRestart(fsm) {
        this._myParentFSM.perform(MainTransitions.Reset);
    }

    _fillMenuItems() {
        let positions = [];
        let ringHeight = Global.myRingHeight;
        let ringRadius = Global.myRingRadius;
        let rotation = 45;

        let initialPosition = [0, ringHeight, -ringRadius];
        positions.push(initialPosition.vec3_clone());
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], rotation));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], -rotation));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], rotation * 2));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 2));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], rotation * 3));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 3));
        positions.push(initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 4));

        {
            let startStory = new MenuItem(Global.myGameObjects.get(GameObjectType.START_STORY), GameObjectType.START_STORY, positions[0], function () {
                this._myFSM.perform("unspawn_story");
                this._myResetCount = 0;
            }.bind(this));
            this._myStartStory = startStory;
        }

        {
            let startStoryCompleted = new MenuItem(Global.myGameObjects.get(GameObjectType.START_STORY_COMPLETED), GameObjectType.START_STORY_COMPLETED, positions[0], function () {
                this._myFSM.perform("unspawn_story");
                this._myResetCount = 0;
            }.bind(this));
            this._myStartStoryCompleted = startStoryCompleted;
        }

        {
            let startArcadeHard = new MenuItem(Global.myGameObjects.get(GameObjectType.START_ARCADE_HARD), GameObjectType.START_ARCADE_HARD, positions[2], function () {
                this._myFSM.perform("unspawn_arcade_hard");
                this._myResetCount = 0;
            }.bind(this));
            this._myMenuItems.push(startArcadeHard);
        }

        {
            let startArcadeNormal = new MenuItem(Global.myGameObjects.get(GameObjectType.START_ARCADE_NORMAL), GameObjectType.START_ARCADE_NORMAL, positions[1], function () {
                this._myFSM.perform("unspawn_arcade_normal");
                this._myResetCount = 0;
            }.bind(this));
            this._myMenuItems.push(startArcadeNormal);
        }

        {
            let leaderboardArcadeHard = new MenuItem(Global.myGameObjects.get(GameObjectType.LEADERBOARD_ARCADE_HARD), GameObjectType.LEADERBOARD_ARCADE_HARD, positions[4], function () {
                //get leaderboard object and component and ask for a refresh
                this._myResetCount = 0;
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeHard);
        }

        {
            let leaderboardArcadeNormal = new MenuItem(Global.myGameObjects.get(GameObjectType.LEADERBOARD_ARCADE_NORMAL), GameObjectType.LEADERBOARD_ARCADE_NORMAL, positions[3], function () {
                //get leaderboard object and component and ask for a refresh
                this._myResetCount = 0;
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeNormal);
        }

        {
            let zestyMarket = new MenuItem(Global.myGameObjects.get(GameObjectType.ZESTY_MARKET), GameObjectType.ZESTY_MARKET, positions[6], function () {
                this._myResetCount = 0;
                let zestyComponent = this._myZestyObject.getObject().pp_getComponentHierarchy("zesty-banner");
                if (zestyComponent) {
                    zestyComponent.onClick();
                }
            }.bind(this));
            this._myMenuItems.push(zestyMarket);
            this._myZestyObject = zestyMarket;
        }

        {
            let floppyDisk = new MenuItem(Global.myGameObjects.get(GameObjectType.FLOPPY_DISK), GameObjectType.FLOPPY_DISK, positions[5], function () {
                this._myResetCount++;

                if (this._myResetCount >= 5) {
                    this._myFSM.perform("unspawn_reset");
                }
            }.bind(this));
            this._myMenuItems.push(floppyDisk);
        }

        {
            let wondermelon = new MenuItem(Global.myGameObjects.get(GameObjectType.WONDERMELON), GameObjectType.WONDERMELON, positions[7], function () {
                if (WL.xrSession) {
                    WL.xrSession.end();
                }
                window.open("https://elia-ducceschi.itch.io/not-enough", "_blank");
            }.bind(this));
            this._myMenuItems.push(wondermelon);
        }
    }
}

class MenuItem {
    constructor(object, objectType, position, callbackOnFall = null) {
        this._myObject = object;
        this._myObjectType = objectType;
        this._myPosition = position.slice(0);
        this._myFacing = [0, 0, 0].vec3_sub(position).vec3_removeComponentAlongAxis([0, 1, 0]);
        this._myPhysx = this._myObject.pp_getComponentHierarchy("physx");
        this._myGrabbable = this._myObject.pp_getComponentHierarchy("pp-grabbable");
        this._myScale = this._myObject.pp_getScale();

        this._myTimer = new PP.Timer(0);

        this._myCallbackOnFall = callbackOnFall;

        this._myAutoSpawn = true;

        this._myThrowTimer = new PP.Timer(5, false);
        this._myGrabbable.registerGrabEventListener(this, this._onGrab.bind(this));
        this._myGrabbable.registerThrowEventListener(this, this._onThrow.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Menu Item");
        this._myFSM.addState("init");
        this._myFSM.addState("inactive", this._inactiveUpdate.bind(this));
        this._myFSM.addState("spawning", this._spawning.bind(this));
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning", this._unspawning.bind(this));

        this._myFSM.addTransition("init", "inactive", "reset", this._reset.bind(this));
        this._myFSM.addTransition("inactive", "spawning", "spawn", this._startSpawn.bind(this));
        this._myFSM.addTransition("spawning", "ready", "end", this._startReady.bind(this));
        this._myFSM.addTransition("spawning", "unspawning", "unspawn", this._startUnspawn.bind(this));
        this._myFSM.addTransition("ready", "unspawning", "unspawn", this._startUnspawn.bind(this));
        this._myFSM.addTransition("unspawning", "inactive", "end", this._startInactive.bind(this));
        this._myFSM.addTransition("inactive", "inactive", "reset", this._reset.bind(this));

        this._myFSM.init("init");

        this._myPhysx.onCollision(this._onCollision.bind(this));

        this._myParticlesRadius = 0.225;
    }

    init(timeBeforeFirstSpawn) {
        this._myFSM.perform("reset", timeBeforeFirstSpawn);
    }

    update(dt) {
        this._myFSM.update(dt);
        this._myThrowTimer.update(dt);
    }

    setAutoSpawn(autoSpawn) {
        this._myAutoSpawn = autoSpawn;
    }

    unspawn() {
        this._myFSM.perform("unspawn");
    }

    canUnspawn() {
        return this._myFSM.canPerform("unspawn");
    }

    getObject() {
        return this._myObject;
    }

    isInactive() {
        return this._myFSM.isInState("inactive");
    }

    _reset(fsm, transition, timeBeforeFirstSpawn) {
        this._disableObject();
        this._myTimer.start(timeBeforeFirstSpawn);
        this._myAutoSpawn = true;
    }

    _inactiveUpdate(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone() && this._myAutoSpawn) {
            fsm.perform("spawn");
        }
    }

    _startSpawn() {
        let position = this._myPosition.pp_clone();

        let evidenceComponent = this._myObject.pp_getComponentHierarchy("evidence-component");
        if (evidenceComponent) {
            let heightDisplacement = evidenceComponent.getHeightDisplacement();
            if (Math.abs(heightDisplacement) > 0.0001) {
                position.vec3_add([0, heightDisplacement, 0], position);
            }
        }

        this._myObject.pp_setPosition(position);
        this._myObject.pp_setScale(0);
        this._myObject.pp_translate([0, 0.2, 0]);
        this._myObject.pp_lookTo(this._myFacing, [0, 1, 0]);
        this._myObject.pp_setActive(true);

        this._myPhysx.kinematic = true;
        this._myPhysx.linearVelocity = [0, 0, 0];
        this._myPhysx.angularVelocity = [0, 0, 0];

        this._myTimer.start(1);
        this._myThrowTimer.reset();
    }

    _spawning(dt) {
        this._myTimer.update(dt);

        let scaleMultiplier = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        if (this._myTimer.isDone()) {
            this._myFSM.perform("end");
        }
    }

    _startReady() {
        this._myObject.pp_setScale(this._myScale);
        if (!this._myGrabbable.isGrabbed()) {
            this._myPhysx.kinematic = false;
        }
    }

    _readyUpdate(dt) {
        if (this._myObject.pp_getPosition()[1] <= -6 || this._myObject.pp_getPosition()[1] > 20 || this._myObject.pp_getPosition().vec3_length() > 50) {
            if (this._myCallbackOnFall && WL.xrSession && this._myThrowTimer.isRunning()) {
                this._myCallbackOnFall();
            }
            this._myFSM.perform("unspawn");
        }
    }

    _startUnspawn() {
        this._myTimer.start(PP.myEasyTuneVariables.get("Unspawn Menu Time"));
        this._myPhysx.kinematic = true;

        if (!this._myGrabbable.isGrabbed()) {
            this._myPhysx.kinematic = false;
        }

        this._myGrabbable.release();
    }

    _unspawning(dt) {
        this._myTimer.update(dt);

        let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        if (this._myTimer.isDone()) {
            Global.myParticlesManager.explosion(this._myObject.pp_getPosition(), this._myParticlesRadius, this._myScale, this._myObjectType);
            this._myFSM.perform("end");
        }
    }

    _startInactive() {
        this._disableObject();
        this._myTimer.start(1);
    }

    _onGrab() {
        this._myThrowTimer.reset();
    }

    _onThrow() {
        this._myThrowTimer.start();
    }

    _onXRSessionEnd() {
        this._myThrowTimer.reset();
    }

    _disableObject() {
        if (this._myPhysx.active) {
            this._myPhysx.linearVelocity = [0, 0, 0];
            this._myPhysx.angularVelocity = [0, 0, 0];
            this._myPhysx.kinematic = true;
            this._myObject.pp_setPosition([0, -10, 0]);
        }
        this._myObject.pp_setActive(false);
    }

    _onCollision() {
        if (!this._myGrabbable.isGrabbed() && this._myPhysx.active && this._myPhysx.kinematic &&
            (this._myFSM.getCurrentState().myID == "spawning")) {
            this._myPhysx.kinematic = false;
        }
    }
}

class MenuTitle {
    constructor(titlesObject, titleObject, subtitleObject) {
        this._myTitlesObject = titlesObject;
        this._myTitleObject = titleObject;
        this._mySubtitleObject = subtitleObject;

        this._myTitleText = this._myTitleObject.pp_getComponent("text");
        this._mySubtitleText = this._mySubtitleObject.pp_getComponent("text");

        this._myStartTimer = new PP.Timer(1, false);
        this._myTimer = new PP.Timer(1, false);

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Menu Title");
        this._myFSM.addState("spawn", this._spawnUpdate.bind(this));
        this._myFSM.addState("unspawn", this._unspawnUpdate.bind(this));

        this._myFSM.addTransition("spawn", "unspawn", "unspawn");
        this._myFSM.addTransition("unspawn", "spawn", "spawn");

        this._myFSM.init("spawn");

        //Setup
        this._mySpawnTime = 1.5;
        this._myHideScale = 0.95;
    }

    spawn(timeToStart) {
        if (!this._myTitleText.active) {
            this._myTitleObject.pp_setActive(true);
            this._mySubtitleObject.pp_setActive(true);

            this._myTimer.start(this._mySpawnTime);
        }

        this._myStartTimer.start(timeToStart);
        this._myFSM.perform("spawn");
    }

    unspawn(timeToStart) {
        this._myTimer.start(this._mySpawnTime);
        this._myStartTimer.start(timeToStart);
        this._myFSM.perform("unspawn");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    isHidden() {
        return !this._myTimer.isRunning();
    }

    _spawnUpdate(dt) {
        this._myStartTimer.update(dt);
        if (this._myStartTimer.isDone()) {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);
                this._myTitleText.material.color[3] = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());

                let color = this._myTitleText.material.color;
                color[3] = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._myTitleText.material.color = color;

                color = this._myTitleText.material.outlineColor;
                color[3] = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._myTitleText.material.outlineColor = color;

                color = this._mySubtitleText.material.color;
                color[3] = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._mySubtitleText.material.color = color;
                color = this._mySubtitleText.material.outlineColor;
                color[3] = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._mySubtitleText.material.outlineColor = color;

                this._myTitlesObject.pp_setScale(Math.pp_interpolate(this._myHideScale, 1, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut));
            }

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
            }
        }
    }

    _unspawnUpdate(dt) {
        this._myStartTimer.update(dt);
        if (this._myStartTimer.isDone()) {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);
                let color = this._myTitleText.material.color;
                color[3] = 1 - PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._myTitleText.material.color = color;

                color = this._myTitleText.material.outlineColor;
                color[3] = 1 - PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._myTitleText.material.outlineColor = color;

                color = this._mySubtitleText.material.color;
                color[3] = 1 - PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._mySubtitleText.material.color = color;
                color = this._mySubtitleText.material.outlineColor;
                color[3] = 1 - PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
                this._mySubtitleText.material.outlineColor = color;

                let scale = Math.pp_interpolate(1, this._myHideScale, this._myTimer.getPercentage(), PP.EasingFunction.linear);
                this._myTitlesObject.pp_setScale(scale);
            }

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
                this._myTitleObject.pp_setActive(false);
                this._mySubtitleObject.pp_setActive(false);
            }
        }
    }

}