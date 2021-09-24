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

PP.FSM = class FSM {

    constructor() {
        this._myCurrentStateData = null;

        this._myStateMap = new Map();
        this._myTransitionMap = new Map();

        this._myDebugLogActive = false;
        this._myDebugLogName = "FSM";
    }

    addState(stateID, state = null) {
        let stateObject = state;
        if (state && typeof state == 'function') {
            stateObject = {};
            stateObject.update = state;
        }

        let stateData = new PP.StateData(stateID, stateObject);
        this._myStateMap.set(stateID, stateData);
        this._myTransitionMap.set(stateID, new Map());
    }

    addTransition(fromStateID, toStateID, transitionID, transition = null) {
        let transitionObject = transition;
        if (transition && typeof transition == 'function') {
            transitionObject = {};
            transitionObject.perform = transition;
        }

        if (this.hasState(fromStateID) && this.hasState(toStateID)) {
            let fromMap = this._getTransitionMapFromState(fromStateID);

            let transitionData = new PP.TransitionData(transitionID, this.getState(fromStateID), this.getState(toStateID), transitionObject);
            fromMap.set(transitionID, transitionData);
        } else {
            console.error("can't add the transition, states not found inside the fsm");
        }
    }

    init(initStateID, initTransition = null) {
        let initTransitionObject = initTransition;
        if (initTransition && typeof initTransition == 'function') {
            initTransitionObject = {};
            initTransitionObject.performInit = initTransition;
        }

        if (this.hasState(initStateID)) {
            let initStateData = this._myStateMap.get(initStateID);
            if (initTransitionObject && initTransitionObject.performInit) {
                initTransitionObject.performInit(this, initStateData);
            } else if (initStateData.myObject && initStateData.myObject.init) {
                initStateData.myObject.init(this, initStateData);
            }

            this._myCurrentStateData = initStateData;

            if (this._myDebugLogActive) {
                console.log(this._myDebugLogName, "- Init:", initStateID);
            }
        } else if (this._myDebugLogActive) {
            console.warn(this._myDebugLogName, "- Init state not found:", initStateID);
        }
    }

    update(dt) {
        if (this._myCurrentStateData && this._myCurrentStateData.myObject && this._myCurrentStateData.myObject.update) {
            this._myCurrentStateData.myObject.update(dt, this, this._myCurrentStateData);
        }
    }

    perform(transitionID) {
        if (this._myCurrentStateData) {
            if (this.canPerform(transitionID)) {
                let transitions = this._myTransitionMap.get(this._myCurrentStateData.myID);
                let transitionToPerform = transitions.get(transitionID);

                let fromState = this._myCurrentStateData;
                let toState = this._myStateMap.get(transitionToPerform.myToState.myID);

                if (transitionToPerform.myObject && transitionToPerform.myObject.perform) {
                    transitionToPerform.myObject.perform(this, transitionToPerform);
                } else {
                    if (fromState.myObject && fromState.myObject.end) {
                        fromState.myObject.end(this, transitionToPerform);
                    }

                    if (toState.myObject && toState.myObject.end) {
                        toState.myObject.start(this, transitionToPerform);
                    }
                }

                this._myCurrentStateData = transitionToPerform.myToState;

                if (this._myDebugLogActive) {
                    console.log(this._myDebugLogName, "- From:", fromState.myID, "- To:", toState.myID, "- With:", transitionID);
                }

                return true;
            } else if (this._myDebugLogActive) {
                console.warn(this._myDebugLogName, "- No Transition:", transitionID, "- From:", this._myCurrentStateData.myID);
            }
        } else if (this._myDebugLogActive) {
            console.warn(this._myDebugLogName, "- FSM not initialized yet");
        }

        return false;
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

    setDebugLogActive(active, debugLogName = null) {
        this._myDebugLogActive = active;
        if (debugLogName) {
            this._myDebugLogName = "FSM: ".concat(debugLogName);
        }
    }

    _getTransitionMapFromState(fromStateID) {
        return this._myTransitionMap.get(fromStateID);
    }
};