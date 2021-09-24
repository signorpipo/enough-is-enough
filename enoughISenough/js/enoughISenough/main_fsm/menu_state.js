class MenuState extends PP.State {
    constructor() {
        super();

        this._myResetCount = 0;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Menu");
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning_arcade_hard", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_arcade_normal", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_story", this._unspawn.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("ready", "unspawning_arcade_hard", "unspawn_arcade_hard", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_arcade_normal", "unspawn_arcade_normal", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_story", "unspawn_story", this._startUnspawning.bind(this));
        this._myFSM.addTransition("unspawning_arcade_hard", "done", "end", this._endArcadeHard.bind(this));
        this._myFSM.addTransition("unspawning_arcade_normal", "done", "end", this._endArcadeNormal.bind(this));
        this._myFSM.addTransition("unspawning_story", "done", "end", this._endStory.bind(this));

        this._myMenuItems = [];

        this._myMenuTitle = new MenuTitle(Global.myTitleObject, Global.mySubtitleObject);

        this._fillMenuItems();

        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Time", 0.05, 0.1, 3));
        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Scale", 3, 1, 3));
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;

        let times = [];
        times[0] = Math.pp_random(0.15, 0.55);
        for (let i = 1; i < this._myMenuItems.length; i++) {
            times[i] = times[i - 1] + Math.pp_random(0.15, 0.55);
        }

        for (let item of this._myMenuItems) {
            let randomIndex = Math.pp_randomInt(0, times.length - 1);
            let timeBeforeFirstSpawn = times.pp_remove(randomIndex);
            item.init(timeBeforeFirstSpawn);
        }

        this._myMenuTitle.spawn(Math.pp_random(0.35, 0.7));

        this._myFSM.init("ready");

        this._myResetCount = 0;
    }

    _readyUpdate(dt, fsm) {
        for (let item of this._myMenuItems) {
            item.update(dt);
        }

        this._myMenuTitle.update(dt);

        //TEMP REMOVE THIS
        if (PP.RightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(1)) {
            this._myFSM.perform("unspawn_story");
        }
    }

    _startUnspawning(fsm) {
        this._myUnspawnList = [];

        let indexList = [];
        for (let i = 0; i < this._myMenuItems.length; i++) {
            if (this._myMenuItems[i].canUnspawn()) {
                indexList.push(i);
            }

            this._myMenuItems[i].setAutoSpawn(false);
        }

        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_remove(randomIndex);

            let randomTimer = Math.pp_random(0.20, 0.25);
            this._myUnspawnList.push([index, new PP.Timer(randomTimer)]);
        }

        this._myMenuTitle.unspawn(Math.pp_random(0.35, 0.7));
    }

    _unspawn(dt, fsm) {
        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                this._myMenuItems[first[0]].unspawn();
                this._myUnspawnList.shift();
            }
        }

        for (let item of this._myMenuItems) {
            item.update(dt);
        }

        this._myMenuTitle.update(dt);

        let done = true;
        for (let item of this._myMenuItems) {
            done &= item.isInactive();
        }
        done &= this._myMenuTitle.isHidden();

        if (done) {
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
        this._myParentFSM.perform(MainTransitions.StartStory);
    }

    _fillMenuItems() {
        let positions = [];
        let ringHeight = Global.myRingHeight;
        let ringRadius = Global.myRingRadius;
        let rotation = 45;

        let initialPosition = [0, ringHeight, -ringRadius];
        positions.push(initialPosition.vec3_clone());
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], rotation));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], rotation * 2));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation * 2));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], rotation * 3));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation * 3));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation * 4));

        {
            let startStory = new MenuItem(Global.myMenuObjects.get(MenuObjectType.START_STORY), positions[0], function () {
                this._myFSM.perform("unspawn_story");
            }.bind(this));
            this._myMenuItems.push(startStory);
        }

        {
            let startArcadeHard = new MenuItem(Global.myMenuObjects.get(MenuObjectType.START_ARCADE_HARD), positions[2], function () {
                this._myFSM.perform("unspawn_arcade_hard");
            }.bind(this));
            this._myMenuItems.push(startArcadeHard);
        }

        {
            let startArcadeNormal = new MenuItem(Global.myMenuObjects.get(MenuObjectType.START_ARCADE_NORMAL), positions[1], function () {
                this._myFSM.perform("unspawn_arcade_normal");
            }.bind(this));
            this._myMenuItems.push(startArcadeNormal);
        }

        {
            let leaderboardArcadeHard = new MenuItem(Global.myMenuObjects.get(MenuObjectType.LEADERBOARD_ARCADE_HARD), positions[4], function () {
                //get leaderboard object and component and ask for a refresh
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeHard);
        }

        {
            let leaderboardArcadeNormal = new MenuItem(Global.myMenuObjects.get(MenuObjectType.LEADERBOARD_ARCADE_NORMAL), positions[3], function () {
                //get leaderboard object and component and ask for a refresh
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeNormal);
        }

        {
            let zestyMarket = new MenuItem(Global.myMenuObjects.get(MenuObjectType.ZESTY_MARKET), positions[6], function () {
                //get zesty object and component and ask for a refresh if it is possible
            }.bind(this));
            this._myMenuItems.push(zestyMarket);
        }

        {
            let floppyDisk = new MenuItem(Global.myMenuObjects.get(MenuObjectType.FLOPPY_DISK), positions[5], function () {
                this._myResetCount++;

                if (this._myResetCount >= 5) {
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myMenuItems.push(floppyDisk);
        }

        {
            let wondermelon = new MenuItem(Global.myMenuObjects.get(MenuObjectType.WONDERMELON), positions[7], function () {
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
    constructor(object, position, callbackOnFall = null) {
        this._myObject = object;
        this._myPosition = position.slice(0);
        this._myFacing = [0, 0, 0].vec3_sub(position).vec3_removeComponentAlongAxis([0, 1, 0]);
        this._myPhysx = this._myObject.pp_getComponentHierarchy("physx");
        this._myGrabbable = this._myObject.pp_getComponentHierarchy("pp-grabbable");
        this._myScale = this._myObject.pp_getScale();

        this._myTimer = new PP.Timer(0);

        this._myCallbackOnFall = callbackOnFall;

        this._myAutoSpawn = true;

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "Menu Item");
        this._myFSM.addState("inactive", this._inactiveUpdate.bind(this));
        this._myFSM.addState("spawning", this._spawning.bind(this));
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning", this._unspawning.bind(this));

        this._myFSM.addTransition("inactive", "spawning", "spawn", this._startSpawn.bind(this));
        this._myFSM.addTransition("spawning", "ready", "end", this._startReady.bind(this));
        this._myFSM.addTransition("spawning", "unspawning", "unspawn", this._startUnspawn.bind(this));
        this._myFSM.addTransition("ready", "unspawning", "unspawn", this._startUnspawn.bind(this));
        this._myFSM.addTransition("unspawning", "inactive", "end", this._startInactive.bind(this));
    }

    init(timeBeforeFirstSpawn) {
        this._myFSM.init("inactive");
        this._myObject.pp_setActiveHierarchy(false);
        this._myTimer.start(timeBeforeFirstSpawn);
        this._myAutoSpawn = true;
    }

    update(dt) {
        this._myFSM.update(dt);
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

    isInactive() {
        return this._myFSM.isInState("inactive");
    }

    _inactiveUpdate(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone() && this._myAutoSpawn) {
            fsm.perform("spawn");
        }
    }

    _startSpawn() {
        this._myObject.pp_setActiveHierarchy(true);
        this._myObject.pp_setScale(0);
        this._myObject.pp_setPosition(this._myPosition);
        this._myObject.pp_translate([0, 0.2, 0]);
        this._myObject.pp_lookAt(this._myFacing, [0, 1, 0]);

        this._myPhysx.kinematic = true;

        this._myTimer.start(1);
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
        if (this._myObject.pp_getPosition()[1] <= 0.05 || this._myObject.pp_getPosition()[1] > 20 || this._myObject.pp_getPosition().vec3_length() > 50) {
            if (this._myCallbackOnFall) {
                this._myCallbackOnFall();
            }
            this._myFSM.perform("unspawn");
        }
    }

    _startUnspawn() {
        this._myTimer.start(PP.EasyTuneVariables.get("Unspawn Menu Time"));
        this._myPhysx.kinematic = true;

        if (!this._myGrabbable.isGrabbed()) {
            this._myPhysx.kinematic = false;
        }
    }

    _unspawning(dt) {
        this._myTimer.update(dt);

        let scaleMultiplier = Math.pp_interpolate(1, PP.EasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        if (this._myTimer.isDone()) {
            this._myFSM.perform("end");
        }
    }

    _startInactive() {
        this._myObject.pp_setActiveHierarchy(false);
        this._myTimer.start(1);
    }
}

class MenuTitle {
    constructor(titleObject, subtitleObject) {
        this._myTitleObject = titleObject;
        this._mySubtitleObject = subtitleObject;

        this._myTitleText = this._myTitleObject.pp_getComponent("text");
        this._mySubtitleText = this._mySubtitleObject.pp_getComponent("text");

        this._myStartTimer = new PP.Timer(1, false);
        this._myTimer = new PP.Timer(1, false);

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "Menu Title");
        this._myFSM.addState("spawn", this._spawnUpdate.bind(this));
        this._myFSM.addState("unspawn", this._unspawnUpdate.bind(this));

        this._myFSM.addTransition("spawn", "unspawn", "unspawn");
        this._myFSM.addTransition("unspawn", "spawn", "spawn");

        this._myFSM.init("spawn");

        //Setup
        this._mySpawnTime = 1.5;
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
            }

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
                this._myTitleObject.pp_setActive(false);
                this._mySubtitleObject.pp_setActive(false);
            }
        }
    }

}