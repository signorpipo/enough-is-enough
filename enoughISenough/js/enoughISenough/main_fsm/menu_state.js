class MenuState extends PP.State {
    constructor() {
        super();

        this._myResetCount = 0;

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "    Menu");
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning_reset", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_restart", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_arcade_dispute", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_arcade_chat", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_trial", this._unspawn.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("ready", "unspawning_arcade_dispute", "unspawn_arcade_dispute", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_arcade_chat", "unspawn_arcade_chat", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_trial", "unspawn_trial", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_reset", "unspawn_reset", this._startUnspawningReset.bind(this));
        this._myFSM.addTransition("ready", "unspawning_restart", "unspawn_restart", this._startUnspawningRestart.bind(this));
        this._myFSM.addTransition("unspawning_arcade_dispute", "done", "end", this._endArcadeHard.bind(this));
        this._myFSM.addTransition("unspawning_arcade_chat", "done", "end", this._endArcadeNormal.bind(this));
        this._myFSM.addTransition("unspawning_trial", "done", "end", this._endTrial.bind(this));
        this._myFSM.addTransition("unspawning_reset", "done", "end", this._endReset.bind(this));
        this._myFSM.addTransition("unspawning_restart", "done", "end", this._endRestart.bind(this));

        this._myMenuItems = [];
        this._myStartTrial = null;
        this._myStartTrialCompleted = null;
        this._myFloppyDisk = null;
        this._myCurrentMenuItems = [];

        this._myMenuTitle = new MenuTitle(Global.myTitlesObject, Global.myTitleObject, Global.mySubtitleObject);

        this._myNotEnough = new NotEnough();

        this._fillMenuItems();

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Time", 0.1, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Scale", 2.5, 1, 3));

        this._myMenuDuration = 0;
        this._myFirstTime = true;
    }

    update(dt, fsm) {
        this._myMenuDuration += dt;
        this._myFSM.update(dt);
        this._myNotEnough.update(dt);
    }

    start(fsm, transitionID) {
        this._myParentFSM = fsm;

        let trialStartedOnce = Global.mySaveManager.loadBool("trial_started_once", false);
        let trialLevel = Global.mySaveManager.loadNumber("trial_level", 1);
        let trialCompleted = Global.mySaveManager.loadBool("trial_completed", false);
        if (trialCompleted || (trialStartedOnce && trialLevel >= 2)) {
            this._myCurrentMenuItems = [];

            if (trialCompleted) {
                this._myCurrentMenuItems.push(this._myStartTrialCompleted);
            } else {
                this._myCurrentMenuItems.push(this._myStartTrial);
            }

            for (let item of this._myMenuItems) {
                this._myCurrentMenuItems.push(item);
            }
        } else {
            this._myCurrentMenuItems = [];
            this._myCurrentMenuItems.push(this._myStartTrial);
        }

        let times = [];
        if (this._myFirstTime) {
            times[0] = 0.35;
            this._myFirstTime = false;
        } else {
            times[0] = Math.pp_random(0.15, 0.55);
        }
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

        Global.myIsInMenu = true;

        Global.myEnableSelectPhysx = trialCompleted || (trialStartedOnce && trialLevel >= 2);

        Global.myPlayMusic = true;

        this._myMenuDuration = 0;
    }

    end() {
        if (Global.myGoogleAnalytics) {
            gtag("event", "menu_time", {
                "time": Math.round(this._myMenuDuration * 1000)
            });
        }

        Global.myIsInMenu = false;
    }

    _readyUpdate(dt, fsm) {
        for (let item of this._myCurrentMenuItems) {
            item.update(dt);
        }

        this._myMenuTitle.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_trial");
            }

            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SQUEEZE).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_arcade_dispute");
                //this._myNotEnough.start();
                //Global.myParticlesManager.mrNOTParticles(Global.myPlayerPosition);
            }

            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("unspawn_restart");
            }
        }
    }

    _startUnspawning(fsm) {
        this._startUnspawningInternal();
    }


    _startUnspawningInternal(evidenceMinDelay = 0.2, evidenceMaxDelay = 0.25, titleMinDelay = 0.35, titleMaxDelay = 0.7) {
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

            let randomTimer = Math.pp_random(evidenceMinDelay, evidenceMaxDelay);
            this._myUnspawnList.push([index, new PP.Timer(randomTimer)]);
        }

        this._myMenuTitle.unspawn(Math.pp_random(titleMinDelay, titleMaxDelay));
    }

    _startUnspawningRestart(fsm) {
        this._startUnspawningInternal();
    }

    _startUnspawningReset(fsm) {
        this._myResetCount = 0;

        let fullReset = this._myFloppyDisk.getGrabTime() >= 5;
        if (!fullReset) {

            if (Global.myGoogleAnalytics) {
                gtag("event", "save_reset", {
                    "value": 1
                });
            }

            Global.mySaveManager.save("trial_started_once", false);
            Global.mySaveManager.save("trial_completed", false);
            Global.mySaveManager.save("trial_level", 1);

            Global.myStatistics.myTrialPlayCountResettable = 0;
            Global.myStatistics.myMrNOTClonesDismissedResettable = 0;
            Global.mySaveManager.save("trial_play_count_resettable", 0);
            Global.mySaveManager.save("mr_NOT_clones_dismissed_resettable", 0);

            this._myNotEnough.start();
        } else {
            if (Global.myGoogleAnalytics) {
                gtag("event", "save_reset_full", {
                    "value": 1
                });
            }

            Global.mySaveManager.clear();
            Global.mySaveManager.save("game_version", Global.myGameVersion);
            this._myNotEnough.start();
            Global.myParticlesManager.mrNOTParticles(Global.myPlayerPosition);
        }

        this._startUnspawningInternal(0, 0, 0, 0);
    }

    _unspawn(dt, fsm) {
        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                this._myCurrentMenuItems[first[0]].unspawn();
                this._myUnspawnList.shift();
            }

            let moreDeleted = false;
            for (let element of this._myUnspawnList) {
                element[1].update(0);
                if (element[1].isDone()) {
                    moreDeleted = true;
                    this._myCurrentMenuItems[element[0]].unspawn();
                }
            }

            if (moreDeleted) {
                this._myUnspawnList.pp_removeAll(element => element[1].isDone());
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

    _endTrial(fsm) {
        this._myParentFSM.performDelayed(MainTransitions.StartTrial);
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
        positions.push(initialPosition.vec3_rotateAxis(rotation, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(-rotation, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(rotation * 2, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(-rotation * 2, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(rotation * 3, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(-rotation * 3, [0, 1, 0]));
        positions.push(initialPosition.vec3_rotateAxis(-rotation * 4, [0, 1, 0]));

        {
            let startTrial = new MenuItem(Global.myGameObjects.get(GameObjectType.COIN), GameObjectType.COIN, positions[0], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myFSM.perform("unspawn_trial");
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myStartTrial = startTrial;
        }

        {
            let startTrialCompleted = new MenuItem(Global.myGameObjects.get(GameObjectType.NOT_COIN), GameObjectType.NOT_COIN, positions[0], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myFSM.perform("unspawn_trial");
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myStartTrialCompleted = startTrialCompleted;
        }

        {
            let startArcadeHard = new MenuItem(Global.myGameObjects.get(GameObjectType.ARCADE_STICK_DISPUTE), GameObjectType.ARCADE_STICK_DISPUTE, positions[2], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myFSM.perform("unspawn_arcade_dispute");
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myMenuItems.push(startArcadeHard);
        }

        {
            let startArcadeNormal = new MenuItem(Global.myGameObjects.get(GameObjectType.ARCADE_STICK_CHAT), GameObjectType.ARCADE_STICK_CHAT, positions[1], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myFSM.perform("unspawn_arcade_chat");
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myMenuItems.push(startArcadeNormal);
        }

        {
            let leaderboardArcadeHard = new MenuItem(Global.myGameObjects.get(GameObjectType.ARCADE_LEADERBOARD_DISPUTE), GameObjectType.ARCADE_LEADERBOARD_DISPUTE, positions[4], function () {
                if (this._myFSM.isInState("ready")) {
                    //get leaderboard object and component and ask for a refresh
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeHard);
        }

        {
            let leaderboardArcadeNormal = new MenuItem(Global.myGameObjects.get(GameObjectType.ARCADE_LEADERBOARD_CHAT), GameObjectType.ARCADE_LEADERBOARD_CHAT, positions[3], function () {
                if (this._myFSM.isInState("ready")) {
                    //get leaderboard object and component and ask for a refresh
                    this._myResetCount = 0;
                }
            }.bind(this));
            this._myMenuItems.push(leaderboardArcadeNormal);
        }

        {
            let zestyMarket = new MenuItem(Global.myGameObjects.get(GameObjectType.ZESTY_MARKET), GameObjectType.ZESTY_MARKET, positions[6], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myResetCount = 0;
                    let zestyComponent = this._myZestyObject.getObject().pp_getComponentHierarchy("zesty-banner");
                    if (zestyComponent) {
                        Global.myZestyToClick = zestyComponent;
                    }
                }
            }.bind(this));
            this._myMenuItems.push(zestyMarket);
            this._myZestyObject = zestyMarket;
        }

        {
            let floppyDisk = new MenuItem(Global.myGameObjects.get(GameObjectType.FLOPPY_DISK), GameObjectType.FLOPPY_DISK, positions[5], function () {
                if (this._myFSM.isInState("ready")) {
                    this._myResetCount++;

                    if (this._myResetCount >= 5) {
                        this._myFSM.perform("unspawn_reset");
                    }
                }
            }.bind(this));
            this._myMenuItems.push(floppyDisk);
            this._myFloppyDisk = floppyDisk;
        }

        {
            let wondermelon = new MenuItem(Global.myGameObjects.get(GameObjectType.WONDERMELON), GameObjectType.WONDERMELON, positions[7], function () {
                if (Global.myGoogleAnalytics) {
                    gtag("event", "not_enough_opened", {
                        "value": 1
                    });
                }

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
        this._myAudioTimer = new PP.Timer(0);

        this._myCallbackOnFall = callbackOnFall;

        this._myAutoSpawn = true;

        this._myThrowTimer = new PP.Timer(5, false);
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

        this._myParticlesRadius = 0.225;

        this._myAppearAudio = null;
        this._myDisappearAudio = null;

        this._myGrabTime = 0;
        this._myCollisionCallbackID = null;
    }

    init(timeBeforeFirstSpawn) {
        this._myFSM.perform("reset", timeBeforeFirstSpawn);
    }

    update(dt) {
        this._myFSM.update(dt);
        this._myThrowTimer.update(dt);

        if (this._myGrabbable.isGrabbed()) {
            this._myGrabTime += dt;
        }
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

    getGrabTime() {
        return this._myGrabTime;
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
        if (this._myAppearAudio == null) {
            this._myAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.EVIDENCE_APPEAR);
            this._myDisappearAudio = Global.myAudioManager.createAudioPlayer(SfxID.EVIDENCE_DISAPPEAR);
        }

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

        this._myAudioTimer.start(0.2);
        this._myAppearAudio.setPosition(position);
        this._myAppearAudio.setPitch(Math.pp_random(0.85, 1.05));

        this._myHitFloor = false;
        this._myGrabTime = 0;

        this._myGrabbable.registerGrabEventListener(this, this._onGrab.bind(this));
        this._myGrabbable.registerThrowEventListener(this, this._onThrow.bind(this));

        this._myCollisionCallbackID = this._myPhysx.onCollision(this._onCollision.bind(this));
    }

    _spawning(dt) {
        if (this._myAudioTimer.isRunning()) {
            this._myAudioTimer.update(dt);
            if (this._myAudioTimer.isDone()) {
                this._myAppearAudio.play();
            }
        }

        this._myTimer.update(dt);

        let scaleMultiplier = PP.EasingFunction.easeInOut(this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        this._myAppearAudio.updatePosition(this._myObject.pp_getPosition());

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
        if (this._myObject.pp_getPosition()[1] <= -10 || this._myObject.pp_getPosition()[1] > 20 || this._myObject.pp_getPosition().vec3_length() > 50) {
            this._myHitFloor = true;
            this._myFSM.perform("unspawn");
        }
    }

    _startUnspawn() {
        if (this._myHitFloor) {
            //Global.myStatistics.myEvidencesThrown += 1;
        }

        this._myTimer.start(PP.myEasyTuneVariables.get("Unspawn Menu Time"));

        this._myDisappearAudio.setPosition(this._myObject.pp_getPosition());
        this._myDisappearAudio.setPitch(Math.pp_random(0.85, 1.05));
        this._myDisappearAudio.play();
    }

    _unspawning(dt) {
        this._myTimer.update(dt);

        let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        //this._myDisappearAudio.updatePosition(this._myObject.pp_getPosition());

        if (this._myTimer.isDone()) {
            Global.myParticlesManager.explosion(this._myObject.pp_getPosition(), this._myParticlesRadius, this._myScale, this._myObjectType);
            this._myFSM.perform("end");
            if (this._myCallbackOnFall && WL.xrSession && this._myThrowTimer.isRunning()) {
                this._myCallbackOnFall();
            }
        }
    }

    _startInactive() {
        this._disableObject();
        this._myTimer.start(1);
    }

    _onGrab() {
        this._myGrabTime = 0;
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
            this._myObject.pp_setPosition([0, -10, 0]);
        }
        this._myObject.pp_setActive(false);
        this._myGrabbable.unregisterGrabEventListener(this);
        this._myGrabbable.unregisterThrowEventListener(this);
        if (this._myCollisionCallbackID != null) {
            this._myPhysx.removeCollisionCallback(this._myCollisionCallbackID);
            this._myCollisionCallbackID = null;
        }
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
        this._myTitleTextColor = this._myTitleText.material.outlineColor.pp_clone();
        this._mySubtitleText = this._mySubtitleObject.pp_getComponent("text");
        this._mySubtitleTextColor = this._mySubtitleText.material.outlineColor.pp_clone();

        this._myStartTimer = new PP.Timer(1, false);
        this._myStartAppearAudioTimer = new PP.Timer(0.3, false);
        this._myTimer = new PP.Timer(1, false);

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Menu Title");
        this._myFSM.addState("spawn", this._spawnUpdate.bind(this));
        this._myFSM.addState("unspawn", this._unspawnUpdate.bind(this));

        this._myFSM.addTransition("spawn", "unspawn", "unspawn");
        this._myFSM.addTransition("unspawn", "spawn", "spawn");

        this._myFSM.init("spawn");

        this._myAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.TITLE_APPEAR);
        this._myDisappearAudio = Global.myAudioManager.createAudioPlayer(SfxID.TITLE_DISAPPEAR);

        //Setup
        this._mySpawnTime = 1.5;
        this._myHideScale = 0.95;
    }

    spawn(timeToStart) {
        if (!this._myTitleText.active) {
            this._myTitleObject.pp_setActive(true);
            this._mySubtitleObject.pp_setActive(true);

            this._myTitleCenterPosition = [0, 168, -184];
            this._myAppearAudio.setPosition(this._myTitleCenterPosition);
            this._myDisappearAudio.setPosition(this._myTitleCenterPosition);

            this._myTimer.start(this._mySpawnTime);
            this._myStartAppearAudioTimer.start(0.4);
        }

        this._myStartTimer.start(timeToStart + 0.4);
        this._myFSM.perform("spawn");
    }

    unspawn(timeToStart) {
        this._myTimer.start(this._mySpawnTime);
        this._myStartTimer.start(timeToStart);
        this._myFSM.perform("unspawn");

        this._myDisappearAudio.play();
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    isHidden() {
        return !this._myTimer.isRunning();
    }

    _spawnUpdate(dt) {
        if (this._myStartAppearAudioTimer.isRunning()) {
            this._myStartAppearAudioTimer.update(dt);
            if (this._myStartAppearAudioTimer.isDone()) {
                this._myAppearAudio.play();
            }
        }

        this._myStartTimer.update(dt);
        if (this._myStartTimer.isDone()) {
            if (this._myTimer.isRunning()) {
                this._myTimer.update(dt);

                let tempColor = [0, 0, 0, 1];

                tempColor[0] = Math.pp_interpolate(0, this._myTitleTextColor[0], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[1] = Math.pp_interpolate(0, this._myTitleTextColor[1], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[2] = Math.pp_interpolate(0, this._myTitleTextColor[2], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

                this._myTitleText.material.outlineColor = tempColor;

                tempColor[0] = Math.pp_interpolate(0, this._mySubtitleTextColor[0], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[1] = Math.pp_interpolate(0, this._mySubtitleTextColor[1], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[2] = Math.pp_interpolate(0, this._mySubtitleTextColor[2], this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

                this._mySubtitleText.material.outlineColor = tempColor;

                let easing = t => t * (2 - t);
                this._myTitlesObject.pp_setScale(Math.pp_interpolate(this._myHideScale, 1, this._myTimer.getPercentage(), easing));
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
                let tempColor = [0, 0, 0, 1];

                tempColor[0] = Math.pp_interpolate(this._myTitleTextColor[0], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[1] = Math.pp_interpolate(this._myTitleTextColor[1], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[2] = Math.pp_interpolate(this._myTitleTextColor[2], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

                this._myTitleText.material.outlineColor = tempColor;

                tempColor[0] = Math.pp_interpolate(this._mySubtitleTextColor[0], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[1] = Math.pp_interpolate(this._mySubtitleTextColor[1], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);
                tempColor[2] = Math.pp_interpolate(this._mySubtitleTextColor[2], 0, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

                this._mySubtitleText.material.outlineColor = tempColor;

                let easing = t => t * t;
                let scale = Math.pp_interpolate(1, this._myHideScale, this._myTimer.getPercentage(), easing);
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