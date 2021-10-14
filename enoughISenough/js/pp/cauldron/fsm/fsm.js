/*
    You can also use plain functions for state/transition if u want to do something simpler and faster

    Signatures:
        stateUpdateFunction(dt, fsm)
        initFunction(fsm, initStateData)
        transitionFunction(fsm, transitionData)
*/

PP.StateData = class StateData {
    constructor(stateID, stateObject) {
        this.myID = stateID;
        this.myObject = stateObject;
    }
};

PP.TransitionData = class TransitionData {
    constructor(transitionID, fromStateData, toStateData, transitionObject) {
        this.myID = transitionID;
        this.myFromState = fromStateData;
        this.myToState = toStateData;
        this.myObject = transitionObject;
    }
};

PP.PendingPerform = class PendingPerform {
    constructor(transitionID, ...args) {
        this.myID = transitionID;
        this.myArgs = args;
    }
};

PP.PerformType = {
    IMMEDIATE: 0,
    DELAYED: 1
};

PP.PerformDelayedType = {
    QUEUE: 0,
    KEEP_FIRST: 1,
    KEEP_LAST: 2
};

PP.FSM = class FSM {

    constructor(performType = PP.PerformType.IMMEDIATE, performDelayedType = PP.PerformDelayedType.QUEUE) {
        this._myCurrentStateData = null;

        this._myStateMap = new Map();
        this._myTransitionMap = new Map();

        this._myDebugLogActive = false;
        this._myDebugShowDelayedInfo = false;
        this._myDebugLogName = "FSM";

        this._myPerformType = performType;
        this._myPerformDelayedType = performDelayedType;
        this._myPendingPerforms = [];
    }

    addState(stateID, state = null) {
        let stateObject = null;
        if (!state || typeof state == 'function') {
            stateObject = {};
            if (typeof state == 'function') {
                stateObject.update = state;
            } else {
                stateObject.update = null;
            }
            stateObject.clone = function () {
                let cloneObject = {};
                cloneObject.update = this.update;
                cloneObject.clone = this.clone;
                return cloneObject;
            };
        } else {
            stateObject = state;
        }

        let stateData = new PP.StateData(stateID, stateObject);
        this._myStateMap.set(stateID, stateData);
        this._myTransitionMap.set(stateID, new Map());
    }

    addTransition(fromStateID, toStateID, transitionID, transition = null) {
        let transitionObject = null;
        if (!transition || typeof transition == 'function') {
            transitionObject = {};
            if (typeof transition == 'function') {
                transitionObject.perform = transition;
            } else {
                transitionObject.perform = null;
            }
            transitionObject.clone = function () {
                let cloneObject = {};
                cloneObject.perform = this.perform;
                cloneObject.clone = this.clone;
                return cloneObject;
            };
        } else {
            transitionObject = transition;
        }

        if (this.hasState(fromStateID) && this.hasState(toStateID)) {
            let fromMap = this._getTransitionMapFromState(fromStateID);

            let transitionData = new PP.TransitionData(transitionID, this.getState(fromStateID), this.getState(toStateID), transitionObject);
            fromMap.set(transitionID, transitionData);
        } else {
            console.error("can't add the transition, states not found inside the fsm");
        }
    }

    init(initStateID, initTransition = null, ...args) {
        let initTransitionObject = initTransition;
        if (initTransition && typeof initTransition == 'function') {
            initTransitionObject = {};
            initTransitionObject.performInit = initTransition;
        }

        if (this.hasState(initStateID)) {
            let initStateData = this._myStateMap.get(initStateID);
            if (initTransitionObject && initTransitionObject.performInit) {
                initTransitionObject.performInit(this, initStateData, ...args);
            } else if (initStateData.myObject && initStateData.myObject.init) {
                initStateData.myObject.init(this, initStateData, ...args);
            }

            this._myCurrentStateData = initStateData;

            if (this._myDebugLogActive) {
                console.log(this._myDebugLogName, "- Init:", initStateID);
            }
        } else if (this._myDebugLogActive) {
            console.warn(this._myDebugLogName, "- Init state not found:", initStateID);
        }
    }

    update(dt, ...args) {
        if (this._myPendingPerforms.length > 0) {
            for (let i = 0; i < this._myPendingPerforms.length; i++) {
                this._perform(this._myPendingPerforms[i].myID, true, ...this._myPendingPerforms[i].myArgs);
            }
            this._myPendingPerforms = [];
        }

        if (this._myCurrentStateData && this._myCurrentStateData.myObject && this._myCurrentStateData.myObject.update) {
            this._myCurrentStateData.myObject.update(dt, this, ...args);
        }
    }

    perform(transitionID, ...args) {
        if (this._myPerformType == PP.PerformType.DELAYED) {
            this.performDelayed(transitionID, ...args);
        } else {
            this.performImmediate(transitionID, ...args);
        }
    }

    performDelayed(transitionID, ...args) {
        let performDelayed = false;

        switch (this._myPerformDelayedType) {
            case PP.PerformDelayedType.QUEUE:
                this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
            case PP.PerformDelayedType.KEEP_FIRST:
                if (!this.hasPendingPerforms()) {
                    this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                    performDelayed = true;
                }
                break;
            case PP.PerformDelayedType.KEEP_LAST:
                this.resetPendingPerforms();
                this._myPendingPerforms.push(new PP.PendingPerform(transitionID, ...args));
                performDelayed = true;
                break;
        }

        return performDelayed;
    }

    performImmediate(transitionID, ...args) {
        return this._perform(transitionID, false, ...args);
    }

    canPerform(transitionID) {
        return this.hasTransitionFromState(this._myCurrentStateData.myID, transitionID);
    }

    canGoTo(stateID, transitionID = null) {
        return this.hasTransitionFromStateToState(this._myCurrentStateData.myID, stateID, transitionID);
    }

    isInState(stateID) {
        return this._myCurrentStateData != null && this._myCurrentStateData.myID == stateID;
    }

    hasBeenInit() {
        return this._myCurrentStateData != null;
    }

    reset() {
        this.resetState();
        this.resetPendingPerforms();
    }

    resetState() {
        this._myCurrentStateData = null;
    }

    resetPendingPerforms() {
        this._myPendingPerforms = [];
    }

    getCurrentState() {
        return this._myCurrentStateData;
    }

    getCurrentTransitions() {
        return this.getTransitionsFromState(this._myCurrentStateData.myID);
    }

    getCurrentTransitionsToState(stateID) {
        return this.getTransitionsFromStateToState(this._myCurrentStateData.myID, stateID);
    }

    getState(stateID) {
        return this._myStateMap.get(stateID);
    }

    getStates() {
        return this._myStateMap.values();
    }

    getTransitions() {
        let transitions = [];

        for (let transitionsPerStateMap of this._myTransitionMap.values()) {
            for (let transitionData of transitionsPerStateMap.values()) {
                transitions.push(transitionData);
            }
        }

        return transitions;
    }

    getTransitionsFromState(fromStateID) {
        let transitionMap = this._getTransitionMapFromState(fromStateID);
        return Array.from(transitionMap.values());
    }

    getTransitionsFromStateToState(fromStateID, toStateID) {
        let transitionMap = this._getTransitionMapFromState(fromStateID);

        let transitionsToState = [];
        for (let transitionData of transitionMap.values()) {
            if (transitionData.myToState.myID == toStateID) {
                transitionsToState.push(transitionData);
            }
        }

        return transitionsToState;
    }

    removeState(stateID) {
        if (this.hasState(stateID)) {
            this._myStateMap.delete(stateID);
            this._myTransitionMap.delete(stateID);

            for (let transitionMap of this._myTransitionMap.values()) {
                let toDelete = [];
                for (let [transitionID, transitionData] of transitionMap.entries()) {
                    if (transitionData.myToState.myID == stateID) {
                        toDelete.push(transitionID);
                    }
                }

                for (let transitionID of toDelete) {
                    transitionMap.delete(transitionID);
                }
            }

            return true;
        }
        return false;
    }

    removeTransitionFromState(fromStateID, transitionID) {
        let fromTransitions = this._getTransitionMapFromState(fromStateID);
        if (fromTransitions) {
            return fromTransitions.delete(transitionID);
        }

        return false;
    }

    hasState(stateID) {
        return this._myStateMap.has(stateID);
    }

    hasTransitionFromState(fromStateID, transitionID) {
        let transitions = this.getTransitionsFromState(fromStateID);

        let transitionIndex = transitions.findIndex(function (transition) {
            return transition.myID == transitionID;
        });

        return transitionIndex >= 0;
    }

    hasTransitionFromStateToState(fromStateID, toStateID, transitionID = null) {
        let transitions = this.getTransitionsFromStateToState(fromStateID, toStateID);

        let hasTransition = false;
        if (transitionID) {
            let transitionIndex = transitions.findIndex(function (transition) {
                return transition.myID == transitionID;
            });

            hasTransition = transitionIndex >= 0;
        } else {
            hasTransition = transitions.length > 0;
        }

        return hasTransition;
    }

    setPerformType(performType) {
        this._myPerformType = performType;
    }

    getPerformType() {
        return this._myPerformType;
    }

    setPerformDelayedType(performDelayedType) {
        this._myPerformDelayedType = performDelayedType;
    }

    getPerformDelayedType() {
        return this._myPerformDelayedType;
    }

    hasPendingPerforms() {
        return this._myPendingPerforms.length > 0;
    }

    getPendingPerforms() {
        return this._myPendingPerforms.slice(0);
    }

    clone(deepClone = false) {
        if (!this.isCloneable(deepClone)) {
            return null;
        }

        let cloneFSM = new PP.FSM();

        cloneFSM._myDebugLogActive = this._myDebugLogActive;
        cloneFSM._myDebugShowDelayedInfo = this._myDebugShowDelayedInfo;
        cloneFSM._myDebugLogName = this._myDebugLogName.slice(0);

        cloneFSM._myPerformType = this._myPerformType;
        cloneFSM._myPerformDelayedType = this._myPerformDelayedType;
        cloneFSM._myPendingPerforms = this._myPendingPerforms.slice(0);

        for (let entry of this._myStateMap.entries()) {
            let stateData = null;

            if (deepClone) {
                stateData = new PP.StateData(entry[1].myID, entry[1].myObject.clone());
            } else {
                stateData = new PP.StateData(entry[1].myID, entry[1].myObject);
            }

            cloneFSM._myStateMap.set(entry[0], stateData);
        }

        for (let entry of this._myTransitionMap.entries()) {
            let fromStateMap = new Map();
            cloneFSM._myTransitionMap.set(entry[0], fromStateMap);

            for (let tEntry of entry[1].entries()) {
                let transitionData = null;

                let fromState = cloneFSM.getState(tEntry[1].myFromState.myID);
                let toState = cloneFSM.getState(tEntry[1].myToState.myID);

                if (deepClone) {
                    transitionData = new PP.TransitionData(tEntry[1].myID, fromState, toState, tEntry[1].myObject.clone());
                } else {
                    transitionData = new PP.TransitionData(tEntry[1].myID, fromState, toState, tEntry[1].myObject);
                }

                fromStateMap.set(transitionData.myID, transitionData);
            }
        }

        if (this._myCurrentStateData) {
            cloneFSM._myCurrentStateData = cloneFSM.getState(this._myCurrentStateData.myID);
        }

        return cloneFSM;
    }

    isCloneable(deepClone = false) {
        if (!deepClone) {
            return true;
        }

        let isDeepCloneable = true;

        for (let entry of this._myStateMap.entries()) {
            isDeepCloneable = isDeepCloneable && entry[1].myObject.clone != null;
        }

        for (let entry of this._myTransitionMap.entries()) {
            for (let tEntry of entry[1].entries()) {
                isDeepCloneable = isDeepCloneable && tEntry[1].myObject.clone != null;
            }
        }

        return isDeepCloneable;
    }

    setDebugLogActive(active, debugLogName = null, showDelayedInfo = false) {
        this._myDebugLogActive = active;
        this._myDebugShowDelayedInfo = showDelayedInfo;
        if (debugLogName) {
            this._myDebugLogName = "FSM: ".concat(debugLogName);
        }
    }

    _perform(transitionID, isDelayed, ...args) {
        if (this._myCurrentStateData) {
            if (this.canPerform(transitionID)) {
                let transitions = this._myTransitionMap.get(this._myCurrentStateData.myID);
                let transitionToPerform = transitions.get(transitionID);

                let fromState = this._myCurrentStateData;
                let toState = this._myStateMap.get(transitionToPerform.myToState.myID);

                if (transitionToPerform.myObject && transitionToPerform.myObject.perform) {
                    transitionToPerform.myObject.perform(this, transitionToPerform, ...args);
                } else {
                    if (fromState.myObject && fromState.myObject.end) {
                        fromState.myObject.end(this, transitionToPerform, ...args);
                    }

                    if (toState.myObject && toState.myObject.start) {
                        toState.myObject.start(this, transitionToPerform, ...args);
                    }
                }

                this._myCurrentStateData = transitionToPerform.myToState;

                if (this._myDebugLogActive) {
                    let consoleArguments = [this._myDebugLogName, "- From:", fromState.myID, "- To:", toState.myID, "- With:", transitionID];
                    if (this._myDebugShowDelayedInfo) {
                        consoleArguments.push(isDelayed ? "- Delayed" : "- Immediate");
                    }
                    console.log(...consoleArguments);
                }

                return true;
            } else if (this._myDebugLogActive) {
                let consoleArguments = [this._myDebugLogName, "- No Transition:", transitionID, "- From:", this._myCurrentStateData.myID];
                if (this._myDebugShowDelayedInfo) {
                    consoleArguments.push(isDelayed ? "- Delayed" : "- Immediate");
                }
                console.warn(...consoleArguments);
            }
        } else if (this._myDebugLogActive) {
            console.warn(this._myDebugLogName, "- FSM not initialized yet", isDelayed ? "- Delayed" : "- Immediate");
        }

        return false;
    }


    _getTransitionMapFromState(fromStateID) {
        return this._myTransitionMap.get(fromStateID);
    }
};