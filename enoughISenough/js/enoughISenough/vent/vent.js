class BreakSetup {
    constructor() {
        this.myBreakDuration = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myBreakTimeCooldown = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myBreakCloneCooldown = new RangeValueOverTime([0, 0], [0, 0], 0, 0, true);
    }
}

class VentSetup {
    constructor() {
        this.myValidAngleRanges = [[new RangeValue([-180, 180]), [0, 0, -1]]];
        this.myVentMultipliers = new VentRuntimeMultipliers();

        this.myBreakSetup = new BreakSetup();
        this.mySmallBreakSetup = new BreakSetup();

        this.myIsEndless = true;
        this.myClonesToDismiss = 0;
        this.myVentDuration = 0;

        this.myWavesMap = new Map();
        this.myNextWavesMap = new Map();

        this.myFirstWave = "";

        this.myCloneRotationSetup = new CloneRotationSetup();

        this.myRefDirection = null;

        this.mySkipBreakWhenTimerBelow = 15;
        this.mySkipSmallBreakWhenTimerBelow = 7;
        this.mySkipSmallBreakWhenBreakTimerBelow = 5;

        this.myResetBreakWhenBreakTimerBelow = 10;
        this.myResetBreakAmount = new RangeValue([10, 12]);

        this.myDelayBeforeStart = 4.5;

        this.myMrNOTSetup = new VentMrNOTSetup();

        this.myNextWaveChanceBoosterSetupMap = new Map();
    }
}

class VentMrNOTSetup {
    constructor() {
        this.myMrNOTAppearenceEnabled = false;
        this.myMrNOTTimeCooldown = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);
        this.myVentMultipliers = new VentRuntimeMultipliers();

        this.myBreakDuration = new RangeValueOverTime([0, 0], [0, 0], 0, 0, false);

        this.myResetMrNOTTimerWhenBelowBreak = 8;
        this.myResetTimerAmountBreak = new RangeValue([8, 10]);
        this.myResetMrNOTTimerWhenBelowSmallBreak = 4;
        this.myResetTimerAmountSmallBreak = new RangeValue([4, 6]);

        this.myStartAngle = new RangeValueOverTime([180, 180], [180, 180], 0, 0, false);
        this.myTimeToReachTarget = new RangeValueOverTime([50, 50], [50, 50], 0, 0, false);
        this.myMaxPatience = new ValueOverTime(15, 15, 0, 0, true);
    }
}

class VentRuntimeSetup {
    constructor() {
        this.myValidAngleRanges = [[new RangeValue([-180, 180]), [0, 0, -1]]];

        this.myVentMultipliers = new VentRuntimeMultipliers();

    }
}

class VentRuntimeMultipliers {
    constructor() {
        this.mySpawnTimeMultiplier = 1;
        this.myDoneTimeMultiplier = 1;
        this.myBreakTimeMultiplier = 1;
        this.myBreakDelayTimeMultiplier = 1;
        this.mySmallBreakTimeMultiplier = 1;
        this.mySmallBreakDelayTimeMultiplier = 1;
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
        this._myFSM.addState("first_wait", new PP.TimerState(ventSetup.myDelayBeforeStart, "end"));
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

        this._myFSM.addTransition("break", "break", "startBreak", this._startBreak.bind(this));
        this._myFSM.addTransition("smallBreak", "break", "startBreak", this._startBreak.bind(this));

        this._myFSM.addTransition("break", "wave", "forceEnd");
        this._myFSM.addTransition("smallBreak", "wave", "forceEnd");

        this._myFSM.addTransition("first_wait", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("wave", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("break", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("smallBreak", "done", "stop", this._stop.bind(this));
        this._myFSM.addTransition("clean", "done", "stop", this._stop.bind(this));

        this._myFSM.addTransition("wave", "clean", "startClean", this._startClean.bind(this));
        this._myFSM.addTransition("break", "clean", "startClean", this._startClean.bind(this));
        this._myFSM.addTransition("smallBreak", "clean", "startClean", this._startClean.bind(this));

        this._myFSM.addTransition("clean", "done", "end");

        this._myFSM.init("init");

        this._myDebugActive = true;
        this._myDebugActiveNextWave = false;
        this._myDebugActiveBreak = false;
        this._myDebugActivePreviousWaveStats = false;
        this._myDebugActiveWaveStats = false;
        this._myDebugActiveVentStats = false;
        this._myDebugActiveMrNOT = false;
        this._myDebugActiveBoosterGroup = true;

        this._myOncePerFrame = false;

        this._myCurrentVentRuntimeSetup = new VentRuntimeSetup();

        this._myMrNOT = null;

        this._myNextWaveChanceBooster = new NextWaveChanceBooster();
        for (let entry of this._myVentSetup.myNextWaveChanceBoosterSetupMap.entries()) {
            this._myNextWaveChanceBooster.addSetup(entry[0], entry[1]);
        }

        this._myBoosterGroupCountMap = new Map();
        this._myBoosterGroupDistanceCountMap = new Map();

        this._myIsTesting = false;
    }

    start() {
        this._myIsTesting = false;
        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    _startVent() {
        this._myMrNOTClones = [];
        this._myPulseRadar.start();

        this._myVentCompleted = false;

        this._prepareVentRuntimeSetup();

        this._myCurrentWave = this._myVentSetup.myWavesMap.get(this._myVentSetup.myFirstWave).createWave(this._myCurrentVentRuntimeSetup, Global.myVentDuration);
        this._myCurrentWaveID = this._myVentSetup.myFirstWave;

        this._myPreviousWave = null;
        this._myPreviousWaveID = null;

        let breakDelayMultiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.myBreakDelayTimeMultiplier.get(Global.myVentDuration);
        this._myBreakDelayTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration) * breakDelayMultiplier);
        this._myBreakCloneCooldown = this._myVentSetup.myBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        let smallBreakDelayMultiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier.get(Global.myVentDuration);
        this._mySmallBreakDelayTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration) * smallBreakDelayMultiplier);
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        this._myVentTimer = new PP.Timer(this._myVentSetup.myVentDuration - Global.myVentDuration);
        this._myClonesLeft = this._myVentSetup.myClonesToDismiss;

        this._myCloneDismissed = 0;

        this._myMrNOT = null;
        this._myMrNOTTimer = new PP.Timer(this._myVentSetup.myMrNOTSetup.myMrNOTTimeCooldown.get(Global.myVentDuration) - Global.myVentDuration, this._myVentSetup.myMrNOTSetup.myMrNOTAppearenceEnabled);

        this._myNextWaveChanceBooster.reset();

        this._myBoosterGroupCountMap = new Map();
        this._myBoosterGroupDistanceCountMap = new Map();

        this._myMrNOTBreak = false;

        Global.myDebugCurrentVentObject = this;

        this._debugNextWave();
    }

    _updateWave(dt) {
        this._myOncePerFrame = true;

        this._myVentTimer.update(dt);
        this._myBreakDelayTimer.update(dt);
        this._mySmallBreakDelayTimer.update(dt);
        this._myMrNOTTimer.update(dt);
        this._myNextWaveChanceBooster.update(dt, Global.myVentDuration);

        if (this._myCurrentWave != null) {
            let cloneSetups = this._myCurrentWave.update(dt);
            for (let cloneSetup of cloneSetups) {
                this.addClone(cloneSetup);
            }
        }

        this._myPulseRadar.update(dt);
        this._updateClones(dt);
        if (this._myMrNOT) {
            this._myMrNOT.update(dt);
            if (this._myMrNOT && this._myMrNOT.isDone()) {
                this._mrNOTDismissedDone();
            }
        }

        if (this._myFSM.isInState("wave")) {
            if (this._isVentCompleted()) {
                if (!this._myIsTesting && this._myOnVentCompletedCallback) {
                    this.ventCompletedDebug();

                    this._myOnVentCompletedCallback();
                }
            } else if (this._myCurrentWave != null && this._myCurrentWave.isDone()) {
                this._getNextWave();
                if (this._myCurrentWave != null) {
                    this._checkBreak();
                }
            } else if (this._myVentSetup.myMrNOTSetup.myMrNOTAppearenceEnabled && !this._myVentCompleted) {
                if (this._myMrNOTTimer.isDone()) {
                    this._myMrNOTTimer.reset();
                    this._mrNOTAppear();
                }
            }
        }
    }

    _getNextWave() {
        if (!this._myVentSetup.myIsEndless && this._myVentTimer.isDone() && this._myClonesLeft <= 0) {
            this._myVentCompleted = true;
            this._myCurrentWave = null;
        } else {
            this._myPreviousWave = this._myCurrentWave;
            this._myPreviousWaveID = this._myCurrentWaveID;

            this._myCurrentWaveID = this._myVentSetup.myNextWavesMap.get(this._myCurrentWaveID).getNextWave(Global.myVentDuration, this._myNextWaveChanceBooster);
            this._myNextWaveChanceBooster.nextWaveSelected(this._myCurrentWaveID, Global.myVentDuration);

            if (this._myDebugActive && this._myDebugActiveBoosterGroup) {
                let name = this._myNextWaveChanceBooster.getBoostGroupName(this._myCurrentWaveID);
                let value = this._myBoosterGroupCountMap.get(name);
                if (value == null) {
                    value = 0;
                }
                this._myBoosterGroupCountMap.set(name, value + 1);

                if (!this._myBoosterGroupDistanceCountMap.has(name)) {
                    this._myBoosterGroupDistanceCountMap.set(name, []);
                }

                let currentDistance = this._myBoosterGroupDistanceCountMap.get(name);
                currentDistance.push(0);

                for (let entry of this._myBoosterGroupDistanceCountMap.entries()) {
                    if (entry[0] != name) {
                        entry[1][entry[1].length - 1] = entry[1][entry[1].length - 1] + 1;
                    }
                }
            }

            let refDirection = Global.myPlayerForward;
            if (this._myVentSetup.myRefDirection != null) {
                refDirection = this._myVentSetup.myRefDirection.pp_clone();
            }

            this._myCurrentWave = this._myVentSetup.myWavesMap.get(this._myCurrentWaveID).createWave(this._myCurrentVentRuntimeSetup, Global.myVentDuration, refDirection);
        }
    }

    _checkBreak() {
        let skipBreak = !this._myVentSetup.myIsEndless && this._myVentTimer.getTimer() <= this._myVentSetup.mySkipBreakWhenTimerBelow.get(Global.myVentDuration);
        let skipSmallBreak = !this._myVentSetup.myIsEndless && this._myVentTimer.getTimer() <= this._myVentSetup.mySkipSmallBreakWhenTimerBelow.get(Global.myVentDuration);
        skipSmallBreak = skipSmallBreak || (!skipBreak && this._myBreakDelayTimer.getTimer() < this._myVentSetup.mySkipSmallBreakWhenBreakTimerBelow.get(Global.myVentDuration));
        if (!skipBreak && this._myBreakDelayTimer.isDone() && this._myBreakCloneCooldown <= 0) {
            this._myFSM.perform("startBreak");
        } else if (!skipSmallBreak && this._mySmallBreakDelayTimer.isDone() && this._mySmallBreakCloneCooldown <= 0) {
            this._myFSM.perform("startSmallBreak");
        } else {
            this._debugNextWave();
        }
    }

    _startBreak() {
        let multiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.myBreakTimeMultiplier.get(Global.myVentDuration);
        if (!this._myMrNOTBreak) {
            this._myBreakTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakDuration.get(Global.myVentDuration) * multiplier);
        } else {
            this._myBreakTimer = new PP.Timer(this._myVentSetup.myMrNOTSetup.myBreakDuration.get(Global.myVentDuration));
            this._myMrNOTBreak = false;
        }
        this._myIsSmallBreak = false;

        if (this._myDebugActive && this._myDebugActiveNextWave) {
            console.log("Break -", this._myBreakTimer.getDuration().toFixed(3));
        }
    }

    _startSmallBreak() {
        let multiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.mySmallBreakTimeMultiplier.get(Global.myVentDuration);
        this._myBreakTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakDuration.get(Global.myVentDuration) * multiplier);
        this._myIsSmallBreak = true;

        if (this._myDebugActive && this._myDebugActiveNextWave) {
            console.log("Small Break -", this._myBreakTimer.getDuration().toFixed(3));
        }
    }

    _break(dt) {
        this._myVentTimer.update(dt);
        this._myBreakTimer.update(dt);
        this._myBreakDelayTimer.update(dt);
        this._myMrNOTTimer.update(dt);
        this._myNextWaveChanceBooster.update(dt, Global.myVentDuration);

        this._myPulseRadar.update(dt);
        this._updateClones(dt);
        if (this._myMrNOT) {
            this._myMrNOT.update(dt);
        }

        if (this._myFSM.isInState("break") || this._myFSM.isInState("smallBreak")) {
            if (this._isVentCompleted()) {
                if (!this._myIsTesting && this._myOnVentCompletedCallback) {
                    this.ventCompletedDebug();

                    this._myOnVentCompletedCallback();
                }
            } else if (this._myBreakTimer.isDone()) {
                let skipBreak = !this._myVentSetup.myIsEndless && this._myVentTimer.getTimer() <= this._myVentSetup.mySkipBreakWhenTimerBelow.get(Global.myVentDuration);
                if (!skipBreak && this._myIsSmallBreak && this._myBreakDelayTimer.isDone() && this._myBreakCloneCooldown <= 0) {
                    this._myFSM.perform("startBreak");
                } else {
                    this._myFSM.perform("end");
                }
            }
        }
    }

    _endBreak() {
        let breakDelayMultiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.myBreakDelayTimeMultiplier.get(Global.myVentDuration);
        this._myBreakDelayTimer = new PP.Timer(this._myVentSetup.myBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration) * breakDelayMultiplier);
        this._myBreakCloneCooldown = this._myVentSetup.myBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        let smallBreakDelayMultiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier.get(Global.myVentDuration);
        this._mySmallBreakDelayTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration) * smallBreakDelayMultiplier);
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        if (this._myVentSetup.myMrNOTSetup.myMrNOTAppearenceEnabled && this._myMrNOTTimer.isStarted() &&
            this._myMrNOTTimer.getTimer() <= this._myVentSetup.myMrNOTSetup.myResetMrNOTTimerWhenBelowBreak.get(Global.myVentDuration)) {
            this._myMrNOTTimer = new PP.Timer(this._myVentSetup.myMrNOTSetup.myResetTimerAmountBreak.get(Global.myVentDuration));

            this._mySmallBreakDelayTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;

            this._myBreakDelayTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;
        }

        this._debugNextWave();
    }

    _endSmallBreak() {
        let smallBreakDelayMultiplier = this._myCurrentVentRuntimeSetup.myVentMultipliers.mySmallBreakDelayTimeMultiplier.get(Global.myVentDuration);
        this._mySmallBreakDelayTimer = new PP.Timer(this._myVentSetup.mySmallBreakSetup.myBreakTimeCooldown.get(Global.myVentDuration) * smallBreakDelayMultiplier);
        this._mySmallBreakCloneCooldown = this._myVentSetup.mySmallBreakSetup.myBreakCloneCooldown.get(Global.myVentDuration);

        if (this._myBreakDelayTimer.getTimer() < this._myVentSetup.myResetBreakWhenBreakTimerBelow.get(Global.myVentDuration)) {
            this._myBreakDelayTimer = new PP.Timer(this._myVentSetup.myResetBreakAmount.get(Global.myVentDuration));

            this._mySmallBreakDelayTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;
        }

        if (this._myVentSetup.myMrNOTSetup.myMrNOTAppearenceEnabled && this._myMrNOTTimer.isStarted() &&
            this._myMrNOTTimer.getTimer() <= this._myVentSetup.myMrNOTSetup.myResetMrNOTTimerWhenBelowSmallBreak.get(Global.myVentDuration)) {
            this._myMrNOTTimer = new PP.Timer(this._myVentSetup.myMrNOTSetup.myResetTimerAmountSmallBreak.get(Global.myVentDuration));

            this._mySmallBreakDelayTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;

            this._myBreakDelayTimer = new PP.Timer(0, false);
            this._mySmallBreakCloneCooldown = 0;
        }

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
            clone.hide();
        }

        if (this._myMrNOT) {
            this._myMrNOT.hide();
            this._myMrNOT = null;
        }

        this._myMrNOTClones = [];
    }

    clean(cleanDelay = 0) {
        this._myFSM.perform("startClean", cleanDelay);
    }

    _startClean(fsm, transition, cleanDelay) {
        this._myMrNOTCleanDelay = new PP.Timer(cleanDelay);
        if (this._myMrNOT) {
            this._myMrNOT.stop();
        }

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
                randomTimer += 0.3 + cleanDelay;
            }
            this._myUnspawnList.push([this._myMrNOTClones[index], new PP.Timer(randomTimer)]);
        }
    }

    _clean(dt) {
        if (this._myMrNOTCleanDelay.isRunning()) {
            this._myMrNOTCleanDelay.update(dt);
            if (this._myMrNOTCleanDelay.isDone()) {
                if (this._myMrNOT) {
                    this._myMrNOT.disappear();
                }
            }
        }

        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                first[0].unspawn();
                this._myUnspawnList.shift();
            }
        }

        this._updateClones(dt);
        if (this._myMrNOT) {
            this._myMrNOT.update(dt);
            if (this._myMrNOT && this._myMrNOT.isDone()) {
                this._myMrNOT = null;
            }
        }

        if (this._myMrNOTClones.length <= 0 && this._myMrNOT == null) {
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

        if (!this._myIsTesting) {
            let mrNOTClone = new MrNOTClone(startPosition, endPosition, cloneSetup.myTimeToReachTarget, this._myVentSetup.myCloneRotationSetup, this._mrNOTCloneDismissed.bind(this), this._mrNOTCloneReachYou.bind(this));
            this._myMrNOTClones.push(mrNOTClone);
        } else {
            this._mrNOTCloneDismissed();
        }
    }

    _mrNOTCloneDismissed() {
        this._myClonesLeft = Math.max(0, this._myClonesLeft - 1);
        this._myBreakCloneCooldown = Math.max(0, this._myBreakCloneCooldown - 1);
        this._mySmallBreakCloneCooldown = Math.max(0, this._mySmallBreakCloneCooldown - 1);

        this._myCloneDismissed++;
    }

    _mrNOTCloneReachYou() {
        if (!this._myIsTesting && this._myOnVentLostCallback && this._myOncePerFrame && this._myFSM.isInState("wave")) {
            this.ventLostDebug();

            this._myOnVentLostCallback();
            this._myOncePerFrame = false;
        }
    }

    ventCompletedDebug() {
        if (this._myDebugActive) {
            console.log("Vent Completed - Duration -", Global.myVentDuration.toFixed(3), "- Dismissed -", this._myCloneDismissed);

            this._boosterGroupDebug();
        }
    }

    ventLostDebug() {
        if (this._myDebugActive) {
            console.log("Vent Lost - Duration -", Global.myVentDuration.toFixed(3), "- Dismissed -", this._myCloneDismissed);

            this._boosterGroupDebug();
        }
    }

    _boosterGroupDebug() {
        if (this._myDebugActiveBoosterGroup) {
            console.log("Booster Group Stats");
            let total = 0;
            for (let entry of this._myBoosterGroupCountMap.entries()) {
                total += entry[1];
            }
            for (let entry of this._myBoosterGroupCountMap.entries()) {
                let distance = this._myBoosterGroupDistanceCountMap.get(entry[0]);
                let distanceSum = 0;
                for (let value of distance) {
                    distanceSum += value;
                }

                let averageDistance = distanceSum / distance.length;

                console.log("   ", entry[0], "-", entry[1], "-", (entry[1] / total).toFixed(3), "-", averageDistance.toFixed(3));
            }
            //console.log("   ", Global.myVentDuration.toFixed(3));
        }
    }

    _mrNOTReachYou() {
        if (PP.myEasyTuneVariables.get("Prevent Vent Lost")) {
            this._mrNOTDismissed();
        } else {
            this._mrNOTCloneReachYou();
        }
    }

    _updateClones(dt) {
        for (let clone of this._myMrNOTClones) {
            clone.update(dt);
        }

        this._myMrNOTClones.pp_removeAll(element => element.isDone());
    }

    _isVentCompleted() {
        return this._myVentCompleted && this._myMrNOTClones.length <= 0 && this._myMrNOT == null;
    }

    _debugNextWave() {
        if (this._myDebugActive) {
            if (this._myDebugActiveNextWave) {
                console.log("Next Wave -", this._myCurrentWaveID);
            }

            if (this._myDebugActivePreviousWaveStats && this._myPreviousWave) {
                try {
                    console.log("   Prev Wave ID -", this._myPreviousWaveID);
                    console.log("   Prev Wave Clones -", this._myPreviousWave.getActualClonesCount());
                    console.log("   Prev Wave Duration -", this._myPreviousWave.getDuration().toFixed(3));
                } catch (error) {
                    console.error("OMG", this._myPreviousWaveID, this._myPreviousWave);
                }
            }

            if (this._myDebugActiveWaveStats) {
                console.log("   Wave Average Clones -", this._myCurrentWave.getAverageClonesCount());
            }

            if (this._myDebugActiveVentStats) {
                console.log("   Vent Duration -", Global.myVentDuration.toFixed(3));
                console.log("   Dismissed -", this._myCloneDismissed);
            }

            if (this._myDebugActiveBreak) {
                console.log("   Break -", this._myBreakDelayTimer.getTimer().toFixed(3), " -", this._myBreakCloneCooldown);
                console.log("   Small Break -", this._mySmallBreakDelayTimer.getTimer().toFixed(3), " -", this._mySmallBreakCloneCooldown);
            }

            if (this._myDebugActiveMrNOT) {
                console.log("   mr NOT -", this._myMrNOTTimer.getTimer().toFixed(3));
            }
        }
    }

    _prepareVentRuntimeSetup() {
        this._myCurrentVentRuntimeSetup = new VentRuntimeSetup();
        this._myCurrentVentRuntimeSetup.myValidAngleRanges = this._myVentSetup.myValidAngleRanges;
        this._myCurrentVentRuntimeSetup.myVentMultipliers = this._myVentSetup.myVentMultipliers;
    }

    _mrNOTAppear() {
        let direction = Global.myPlayerForward.pp_clone();
        let startAngle = this._myVentSetup.myMrNOTSetup.myStartAngle.get(Global.myVentDuration) * Math.pp_randomSign();
        direction.vec3_rotateAxis(startAngle, [0, 1, 0], direction);

        let oldVentSetup = this._myCurrentVentRuntimeSetup;

        this._myCurrentVentRuntimeSetup = new VentRuntimeSetup();
        this._myCurrentVentRuntimeSetup.myValidAngleRanges = [];
        let timeToReachTarget = this._myVentSetup.myMrNOTSetup.myTimeToReachTarget.get(Global.myVentDuration);
        this._myCurrentVentRuntimeSetup.myValidAngleRanges.push([new RangeValueOverTime([30, 180], [90, 180], (timeToReachTarget / 5) + Global.myVentDuration, timeToReachTarget + Global.myVentDuration), direction.pp_clone()]);
        this._myCurrentVentRuntimeSetup.myValidAngleRanges.push([new RangeValueOverTime([-180, -30], [-180, -90], (timeToReachTarget / 5) + Global.myVentDuration, timeToReachTarget + Global.myVentDuration), direction.pp_clone()]);

        oldVentSetup.myValidAngleRanges = this._myCurrentVentRuntimeSetup.myValidAngleRanges;

        this._myCurrentVentRuntimeSetup.myVentMultipliers = this._myVentSetup.myMrNOTSetup.myVentMultipliers;

        let mrNOTSetup = new MrNOTVentSetup();
        mrNOTSetup.myDirection = direction;
        mrNOTSetup.myTimeToReachTarget = timeToReachTarget;
        mrNOTSetup.myMaxPatience = this._myVentSetup.myMrNOTSetup.myMaxPatience.get(timeToReachTarget);

        this._myMrNOT = new MrNOTVent(mrNOTSetup, this._myCurrentVentRuntimeSetup, this._mrNOTDismissed.bind(this), this._mrNOTReachYou.bind(this));

        this._myBreakDelayTimer.start(0);
        this._myBreakDelayTimer.update(0);
        this._myBreakCloneCooldown = 0;
        this._myMrNOTBreak = true;

        if (this._myDebugActive && this._myDebugActiveMrNOT) {
            console.log("mr NOT - Duration -", mrNOTSetup.myTimeToReachTarget.toFixed(3), " - Patience -", mrNOTSetup.myMaxPatience);
        }

        //this._boosterGroupDebug();
    }

    _mrNOTDismissed() {
        let oldVentSetup = this._myCurrentVentRuntimeSetup;
        this._prepareVentRuntimeSetup();
        oldVentSetup.myValidAngleRanges = this._myCurrentVentRuntimeSetup.myValidAngleRanges;

        this._myMrNOT.disappear();

        this._myBreakDelayTimer.start(0);
        this._myBreakDelayTimer.update(0);
        this._myBreakCloneCooldown = 0;
        this._myMrNOTBreak = true;

        if (this._myFSM.isInState("break") || this._myFSM.isInState("smallBreak")) {
            this._myFSM.perform("forceEnd");
            this._myCurrentWave = new ZeroWave();
        }
    }

    _mrNOTDismissedDone() {
        this._myMrNOT = null;
        this._myMrNOTTimer = new PP.Timer(this._myVentSetup.myMrNOTSetup.myMrNOTTimeCooldown.get(Global.myVentDuration));
    }

    _test(duration = 550, startDuration = 0, numberOfTest = 100) {
        this._myIsTesting = true;
        let dt = 1 / 72;

        let boosterGroupCountMaps = [];
        let boosterGroupDistanceCountMaps = [];

        //console.clear();

        while (numberOfTest > 0) {
            //console.log("Test Count -", numberOfTest);
            numberOfTest--;
            this._myFSM.perform("start");
            Global.myVentDuration = startDuration;
            while (Global.myVentDuration < duration) {
                this.update(dt);
                Global.myVentDuration += dt;
                //console.log(Global.myVentDuration.toFixed(3));
            }

            boosterGroupCountMaps.push(this._myBoosterGroupCountMap);
            boosterGroupDistanceCountMaps.push(this._myBoosterGroupDistanceCountMap);

            this.stop();
        }

        //console.clear();

        let resultMapGroupCount = new Map();
        let resultMapGroupCountPercentage = new Map();
        let resultMapGroupCountDistance = new Map();
        let groups = ["1", "2", "3", "4", "5"];
        for (let key of groups) {
            resultMapGroupCount.set(key, 0);
            resultMapGroupCountPercentage.set(key, 0);
            resultMapGroupCountDistance.set(key, 0);
        }

        for (let i = 0; i < boosterGroupCountMaps.length; i++) {
            let groupCountMap = boosterGroupCountMaps[i];
            let groupCountDistanceMap = boosterGroupDistanceCountMaps[i];

            let total = 0;
            for (let entry of groupCountMap.entries()) {
                total += entry[1];
            }
            for (let entry of groupCountMap.entries()) {
                let distance = groupCountDistanceMap.get(entry[0]);
                let distanceSum = 0;
                for (let value of distance) {
                    distanceSum += value;
                }

                let averageDistance = distanceSum / distance.length;

                resultMapGroupCount.set(entry[0], resultMapGroupCount.get(entry[0]) + entry[1]);
                resultMapGroupCountPercentage.set(entry[0], resultMapGroupCountPercentage.get(entry[0]) + entry[1] / total);
                resultMapGroupCountDistance.set(entry[0], resultMapGroupCountDistance.get(entry[0]) + averageDistance);
            }
        }

        for (let key of groups) {
            resultMapGroupCount.set(key, resultMapGroupCount.get(key) / boosterGroupCountMaps.length);
            resultMapGroupCountPercentage.set(key, resultMapGroupCountPercentage.get(key) / boosterGroupCountMaps.length);
            resultMapGroupCountDistance.set(key, resultMapGroupCountDistance.get(key) / boosterGroupCountMaps.length);
        }

        console.log("TEST");
        console.log("Booster Group Stats");
        for (let entry of resultMapGroupCount.entries()) {
            console.log("   ", entry[0], "-", entry[1], "-", resultMapGroupCountPercentage.get(entry[0]).toFixed(3), "-", resultMapGroupCountDistance.get(entry[0]).toFixed(3));
        }
        console.log("   ", Global.myVentDuration.toFixed(3));


    }
}