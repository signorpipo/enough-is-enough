class BreakSetup {
    constructor() {
        this.myBreakDuration = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myBreakTimeCooldown = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myBreakCloneCooldown = new RangeValueOverTime([0, 0], [0, 0], 0, 0, true);
    }
}

class VentSetup {
    constructor() {
        this.myValidAngleRanges = [[-180, 180]];

        this.myBreakSetup = new BreakSetup();
        this.mySmallBreakSetup = new BreakSetup();

        this.myIsEndless = true;
        this.myClonesToDismiss = 0;
        this.myVentDuration = 0;

        this.myWavesMap = new Map();
        this.myNextWavesMap = new Map();

        this.myFirstWave = "";

        this.myCloneRotationSetup = new CloneRotationSetup();
    }
}

class Vent {
    constructor(ventSetup) {
        this._myVentSetup = ventSetup;
        this._myPulseRadar = new PulseRadar();

        this._myMrNOTClones = [];

        this._myOnVentLostCallback = null;
        this._myOnVentCompletedCallback = null;

        this._myFSM = new PP.FSM();

        //this._myFSM.setDebugLogActive(true, "        Vent");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(/*4.5*/0, "end"));
        this._myFSM.addState("wave", this._updateWave.bind(this));
        this._myFSM.addState("break", this._break.bind(this));
        this._myFSM.addState("smallBreak", this._break.bind(this));
        this._myFSM.addState("clean", this._clean.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start");
        this._myFSM.addTransition("done", "first_wait", "start");
        this._myFSM.addTransition("first_wait", "wave", "end", this._startVent.bind(this));
        this._myFSM.addTransition("wave", "break", "startBreak", this._startBreak.bind(this));
        this._myFSM.addTransition("wave", "smallBreak", "startSmallBreak", this._startSmallBreak.bind(this));
        this._myFSM.addTransition("break", "wave", "end", this._endBreak.bind(this));
        this._myFSM.addTransition("smallBreak", "wave", "end", this._endSmallBreak.bind(this));
        this._myFSM.addTransition("smallBreak", "break", "startBreak", this._startBreak.bind(this));

        this._myFSM.addTransition("wave", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("break", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("smallBreak", "done", "stop", this._stop.bind(this));

        this._myFSM.addTransition("wave", "clean", "startClean", this._startClean.bind(this));
        this._myFSM.addTransition("break", "clean", "startClean", this._startClean.bind(this));
        this._myFSM.addTransition("smallBreak", "clean", "startClean", this._startClean.bind(this));

        this._myFSM.addTransition("clean", "done", "end");

        this._myFSM.init("init");

        this._myDebugActive = true;

        this._myOncePerFrame = false;
    }

    start() {
        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    _startVent() {
        this._myMrNOTClones = [];
        this._myPulseRadar.start();

        this._myVentCompleted = false;

        this._myCurrentWave = this._myVentSetup.myWavesMap.get(this._myVentSetup.myFirstWave).createWave(this._myVentSetup, Global.myVentDuration);
        this._myCurrentWaveID = this._myVentSetup.myFirstWave;

        this._myBreakDelayTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration));
        this._myBreakCloneCooldown = this._myVentSetup.myBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        this._mySmallBreakDelayTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration));
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        this._myVentTimer = new PP.Timer(this._myVentSetup.myVentDuration);
        this._myClonesLeft = this._myVentSetup.myClonesToDismiss;

        this._debugNextWave();
    }

    _updateWave(dt) {
        this._myOncePerFrame = true;

        this._myVentTimer.update(dt);
        this._myBreakDelayTimer.update(dt);
        this._mySmallBreakDelayTimer.update(dt);

        if (this._myCurrentWave != null) {
            let cloneSetups = this._myCurrentWave.update(dt);
            for (let cloneSetup of cloneSetups) {
                this.addClone(cloneSetup);
            }
        }

        this._myPulseRadar.update(dt);
        this._updateClones(dt);

        if (this._isVentCompleted()) {
            if (this._myOnVentCompletedCallback) {
                this._myOnVentCompletedCallback();
            }
        } else if (this._myCurrentWave != null && this._myCurrentWave.isDone()) {
            this._getNextWave();
            if (this._myCurrentWave != null) {
                this._checkBreak();
            }
        }
    }

    _getNextWave() {
        if (!this._myVentSetup.myIsEndless && this._myVentTimer.isDone() && this._myClonesLeft <= 0) {
            this._myVentCompleted = true;
            this._myCurrentWave = null;

            if (this._myDebugActive) {
                console.log("Vent Completed");
            }
        } else {
            this._myCurrentWaveID = this._myVentSetup.myNextWavesMap.get(this._myCurrentWaveID).getNextWave(Global.myVentDuration);
            this._myCurrentWave = this._myVentSetup.myWavesMap.get(this._myCurrentWaveID).createWave(this._myVentSetup, Global.myVentDuration);
        }
    }

    _checkBreak() {
        if (this._myBreakDelayTimer.isDone() && this._myBreakCloneCooldown <= 0) {
            this._myFSM.perform("startBreak");
        } else if (this._mySmallBreakDelayTimer.isDone() && this._mySmallBreakCloneCooldown <= 0) {
            this._myFSM.perform("startSmallBreak");
        } else {
            this._debugNextWave();
        }
    }

    _startBreak() {
        this._myBreakTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakDuration.get(Global.myVentDuration));
        this._myIsSmallBreak = false;

        if (this._myDebugActive) {
            console.log("Break -", this._myBreakTimer.getDuration().toFixed(3));
        }
    }

    _startSmallBreak() {
        this._myBreakTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakDuration.get(Global.myVentDuration));
        this._myIsSmallBreak = true;

        if (this._myDebugActive) {
            console.log("Small Break -", this._myBreakTimer.getDuration().toFixed(3));
        }
    }

    _break(dt) {
        this._myVentTimer.update(dt);
        this._myBreakTimer.update(dt);
        this._myBreakDelayTimer.update(dt);

        this._myPulseRadar.update(dt);
        this._updateClones(dt);

        if (this._isVentCompleted()) {
            if (this._myOnVentCompletedCallback) {
                this._myOnVentCompletedCallback();
            }
        } else if (this._myBreakTimer.isDone()) {
            if (this._myIsSmallBreak && this._myBreakDelayTimer.isDone() && this._myBreakCloneCooldown <= 0) {
                this._myFSM.perform("startBreak");
            } else {
                this._myFSM.perform("end");
            }
        }
    }

    _endBreak() {
        this._myBreakDelayTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration));
        this._myBreakCloneCooldown = this._myVentSetup.myBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        this._mySmallBreakTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration));
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        this._debugNextWave();
    }

    _endSmallBreak() {
        this._mySmallBreakDelayTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration));
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        /*
        if (this._myBreakDelayTimer.getTimer() < 10) {
            this._myBreakDelayTimer = new PP.Timer(Math.pp_random(10, 15));
            this._myBreakCloneCooldown = Math.pp_randomInt(10, 20);

            this._mySmallBreakTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;
        }
        */

        this._debugNextWave();
    }

    isDone() {
        return this._myFSM.isInState("done");
    }

    stop() {
        this._myFSM.perform("stop");
    }

    _stop() {
        for (let clone of this._myMrNOTClones) {
            clone.destroy();
        }
        this._myMrNOTClones = [];
    }

    clean() {
        this._myFSM.perform("startClean");
    }

    _startClean() {
        this._myUnspawnList = [];

        let indexList = [];
        for (let i = 0; i < this._myMrNOTClones.length; i++) {
            if (this._myMrNOTClones[i].canUnspawn()) {
                indexList.push(i);
                this._myMrNOTClones[i].stop();
            }
        }

        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_removeIndex(randomIndex);

            let randomTimer = Math.pp_random(0.20, 0.25);
            if (this._myUnspawnList.length == 0) {
                randomTimer += 0.3;
            }
            this._myUnspawnList.push([this._myMrNOTClones[index], new PP.Timer(randomTimer)]);
        }
    }

    _clean(dt) {
        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                first[0].unspawn();
                this._myUnspawnList.shift();
            }
        }

        this._updateClones(dt);

        if (this._myMrNOTClones.length <= 0) {
            this._myFSM.perform("end");
        }
    }

    onVentLost(callback) {
        this._myOnVentLostCallback = callback;
    }

    onVentCompleted(callback) {
        this._myOnVentCompletedCallback = callback;
    }

    addClone(cloneSetup) {
        let startPosition = cloneSetup.myDirection.pp_clone();
        startPosition.vec3_normalize(startPosition);
        startPosition.vec3_scale(cloneSetup.myStartDistance, startPosition);
        startPosition[1] += cloneSetup.myStartHeight;

        let endPosition = [0, cloneSetup.myEndHeight, 0];

        this._myPulseRadar.addSignal(startPosition);

        let mrNOTClone = new MrNOTClone(startPosition, endPosition, cloneSetup.myTimeToReachTarget, this._myVentSetup.myCloneRotationSetup, this._mrNOTCloneDismissed.bind(this), this._mrNOTCloneReachYou.bind(this));
        this._myMrNOTClones.push(mrNOTClone);
    }

    _mrNOTCloneDismissed() {
        this._myClonesLeft = Math.max(0, this._myClonesLeft - 1);
        this._myBreakCloneCooldown = Math.max(0, this._myBreakCloneCooldown - 1);
        this._mySmallBreakCloneCooldown = Math.max(0, this._mySmallBreakCloneCooldown - 1);
    }

    _mrNOTCloneReachYou() {
        if (this._myOnVentLostCallback && this._myOncePerFrame && this._myFSM.isInState("wave")) {
            this._myOnVentLostCallback();
            this._myOncePerFrame = false;
        }
    }

    _updateClones(dt) {
        for (let clone of this._myMrNOTClones) {
            clone.update(dt);
        }

        this._myMrNOTClones.pp_removeAll(element => element.isDone());
    }

    _isVentCompleted() {
        return this._myVentCompleted && this._myMrNOTClones.length <= 0;
    }

    _debugNextWave() {
        if (this._myDebugActive) {
            console.log("Next Wave -", this._myCurrentWaveID);
            console.log("   Break -", this._myBreakDelayTimer.getTimer().toFixed(3), " -", this._myBreakCloneCooldown);
            console.log("   Small Break -", this._mySmallBreakDelayTimer.getTimer().toFixed(3), " -", this._mySmallBreakCloneCooldown);
        }
    }
}