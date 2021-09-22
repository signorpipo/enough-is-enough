class MenuState extends PP.State {
    constructor(fsm) {
        super();
        this._myParentFSM = fsm;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "Menu");
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning_arcade", this._unspawn.bind(this));
        this._myFSM.addState("unspawning_story", this._unspawn.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("ready", "unspawning_arcade", "unspawn_arcade", this._startUnspawning.bind(this));
        this._myFSM.addTransition("ready", "unspawning_story", "unspawn_story", this._startUnspawning.bind(this));
        this._myFSM.addTransition("unspawning_arcade", "done", "end", this._endArcade.bind(this));
        this._myFSM.addTransition("unspawning_story", "done", "end", this._endStory.bind(this));

        this._myMenuItems = [];

        this._fillMenuItems();

        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Time", 0.05, 0.1, 3));
        PP.EasyTuneVariables.add(new PP.EasyTuneNumber("Unspawn Menu Scale", 3, 1, 3));
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    start(fsm, transitionID) {
        let times = [];
        times[0] = Math.pp_random(0.25, 0.75);
        for (let i = 1; i < this._myMenuItems.length; i++) {
            times[i] = times[i - 1] + Math.pp_random(0.25, 0.75);
        }

        for (let item of this._myMenuItems) {
            let randomIndex = Math.pp_randomInt(0, times.length - 1);
            let timeBeforeFirstSpawn = times.pp_remove(randomIndex);
            item.init(timeBeforeFirstSpawn);
        }

        this._myFSM.init("ready");
    }

    _readyUpdate(dt, fsm) {
        for (let item of this._myMenuItems) {
            item.update(dt);
        }
    }

    _startUnspawning(fsm) {

    }

    _unspawn(dt, fsm) {

    }

    _endArcade(fsm) {
        this._myParentFSM.perform(MainTransitions.PrepareArcade);
    }

    _endStory(fsm) {
        this._myParentFSM.perform(MainTransitions.PrepareStory);
    }

    _fillMenuItems() {
        let positions = [];
        let ringHeight = Global.myRingHeight;
        let ringRadius = Global.myRingRadius;
        let rotation = 35;

        let initialPosition = [0, ringHeight, -ringRadius];
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], rotation));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], rotation * 2));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], -rotation * 2));
        positions.push(initialPosition.vec3_rotateAroundAxis([0, 1, 0], 180));

        {
            let startArcade = new MenuItem(Global.myMenuObjects.get(MenuObjectType.START_ARCADE), positions[0]);
            this._myMenuItems.push(startArcade);
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

        this._myFSM.setDebugLogActive(true, "Menu Item");
        this._myFSM.addState("inactive", this._inactiveUpdate.bind(this));
        this._myFSM.addState("spawning", this._spawning.bind(this));
        this._myFSM.addState("ready", this._readyUpdate.bind(this));
        this._myFSM.addState("unspawning", this._unspawning.bind(this));

        this._myFSM.addTransition("inactive", "spawning", "spawn", this._startSpawn.bind(this));
        this._myFSM.addTransition("spawning", "ready", "end", this._startReady.bind(this));
        this._myFSM.addTransition("ready", "unspawning", "unspawn", this._startUnspawn.bind(this));
        this._myFSM.addTransition("unspawning", "inactive", "end", this._startInactive.bind(this));
        this._myFSM.addTransition("inactive", "inactive", "unspawn");
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

    _inactiveUpdate(dt, fsm) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone() && this._myAutoSpawn) {
            fsm.perform("spawn");
        }
    }

    unspawn() {
        this._myFSM.perform("unspawn");
    }

    canUnspawn() {
        return this._myFSM.canPerform("unspawn");
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
        if (this._myObject.pp_getPosition()[1] <= 0.05 || this._myObject.pp_getPosition()[1] > 20) {
            if (this._myCallbackOnFall) {
                this._myCallbackOnFall();
            }
            this._myFSM.perform("unspawn");
        }
    }

    _startUnspawn() {
        this._myTimer.start(PP.EasyTuneVariables.get("Unspawn Menu Time"));
        this._myPhysx.kinematic = true;
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