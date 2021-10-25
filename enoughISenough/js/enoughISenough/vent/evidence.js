class EvidenceSetup {
    constructor(objectType, randomChance, startSpawnTime = null, endSpawnTime = null, cardinalPositions = null) {
        this.myObjectType = objectType;
        this.myRandomChance = randomChance;
        this.myStartSpawnTime = startSpawnTime;
        this.myEndSpawnTime = endSpawnTime;
        this.myCardinalPositions = cardinalPositions;
    }
}

class Evidence {
    constructor(evidenceSetup, callbackOnUnspawned) {
        this._myEvidenceSetup = evidenceSetup;
        this._myCallbackOnUnspawned = callbackOnUnspawned;

        this._myObject = Global.myGameObjects.get(this._myEvidenceSetup.myObjectType);
        this._myObjectType = this._myEvidenceSetup.myObjectType;
        this._myPhysx = this._myObject.pp_getComponentHierarchy("physx");
        this._myGrabbable = this._myObject.pp_getComponentHierarchy("pp-grabbable");
        this._myScale = this._myObject.pp_getScale();

        this._myCurrentCardinalPosition = null;
        this._myPosition = null;
        this._myFacing = null;

        this._myTimer = new PP.Timer(0);

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "             Evidence Item");
        this._myFSM.addState("init");
        this._myFSM.addState("inactive");
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
        this.init();
    }

    getEvidenceSetup() {
        return this._myEvidenceSetup;
    }

    init() {
        this._myFSM.perform("reset");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    spawn(position) {
        this._myPosition = position.slice(0);
        this._myFacing = [0, 0, 0].vec3_sub(position).vec3_removeComponentAlongAxis([0, 1, 0]);
        this._myFSM.perform("spawn");
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

    hide() {
        this._myFSM.init("inactive");
        this._myObject.pp_setActive(false);
    }

    _reset(fsm, transition) {
        this._myObject.pp_setActive(false);
    }

    _startSpawn() {
        this._myObject.pp_setPosition(this._myPosition);
        this._myObject.pp_setActive(true);
        this._myObject.pp_setScale(0);
        this._myObject.pp_translate([0, 0.2, 0]);
        this._myObject.pp_lookAt(this._myFacing, [0, 1, 0]);

        // TEMP kinematic false with no gravity but on collision it adds gravity (only if kinematic false)
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
            this._myFSM.perform("unspawn");
        }
    }

    _startUnspawn() {
        this._myTimer.start(PP.myEasyTuneVariables.get("Unspawn Menu Time"));
        this._myPhysx.kinematic = true;

        if (!this._myGrabbable.isGrabbed()) {
            this._myPhysx.kinematic = false;
        }
    }

    _unspawning(dt) {
        this._myTimer.update(dt);

        let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
        this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

        if (this._myTimer.isDone()) {
            Global.myParticlesManager.explosion(this._myObject.pp_getPosition(), this._myScale, this._myObjectType);
            this._myFSM.perform("end");
            this._myCallbackOnUnspawned(this);
        }
    }

    _startInactive() {
        this._myObject.pp_setActive(false);
    }
}

var CardinalPosition = {
    NORTH: 0,
    NORTH_EAST: 1,
    NORTH_WEST: 2,
    EAST: 3,
    WEST: 4,
    SOUTH_EAST: 5,
    SOUTH_WEST: 6,
    SOUTH: 7
};