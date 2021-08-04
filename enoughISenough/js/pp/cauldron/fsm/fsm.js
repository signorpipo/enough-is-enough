/*
    Signatures:
        initFunction(fsm, initStateData)
        transitionFunction(fsm, fromStateData, toStateData)
*/

PP.FSM = class FSM {

    constructor() {
        this._myCurrentStateID = null;

        this._myStateMap = new Map();
        this._myTransitionMap = new Map();
    }

    addState(stateID, stateObject = null) {
        let stateData = new StateData(stateID, stateObject);
        this._myStateMap.set(stateID, stateData);
        this._myTransitionMap.set(fromStateID, new Map());
    }

    addTransition(fromStateID, toStateID, transitionID, transitionFunction = null) {
        if (this.hasState(fromStateID) && this.hasState(toStateID)) {
            let fromMap = this.getTransitionMapFromState(fromStateID);

            let transitionData = new TransitionData(transitionID, fromStateID, toStateID, transitionFunction);
            fromMap.set(transitionID, transitionData);
        } else {
            console.error("can't add the transition, states not found inside the fsm");
        }
    }

    start(initStateID, initFunction = null) {
        if (this.hasState(initStateID)) {
            this._myCurrentStateID = initStateID;
            let stateData = this._myStateMap.get(initStateID);
            if (initFunction) {
                initFunction(this, stateData);
            } else if (stateData.myStateObject && stateData.myStateObject.init) {
                stateData.myStateObject.init(this);
            }
        }
    }

    update(dt) {
        let currentState = this._myStateMap.get(this._myCurrentStateID);
        if (currentState.myStateObject && currentState.myStateObject.update) {
            currentState.myStateObject.update(dt, this);
        }
    }

    perform(transitionID) {
        if (this.canPerform(transitionID)) {
            let transitions = this.getCurrentTransitions();
            let transitionToPerform = transitions.get(transitionID);

            let fromState = this._myStateMap.get(this._myCurrentStateID);
            let toState = this._myStateMap.get(transitionToPerform.myToStateID);

            if (transitionToPerform.myTransitionFunction) {
                transitionToPerform.myTransitionFunction(this, fromState, toState);
            } else {
                if (fromState.myStateObject && fromState.myStateObject.end) {
                    fromState.myStateObject.end(this, transitionID);
                }

                if (toState.myStateObject && toState.myStateObject.end) {
                    toState.myStateObject.start(this, transitionID);
                }
            }

            this._myCurrentStateID = transitionToPerform.myToStateID;

            return true;
        }

        return false;
    }

    canPerform(transitionID) {
        return this.hasTransitionFromState(this._myCurrentStateID, transitionID);
    }

    isInState(stateID) {
        return this._myCurrentStateID == stateID;
    }

    getCurrentState() {
        return this._myStateMap.get(this._myCurrentStateID);
    }

    getCurrentTransitions() {
        return this.getTransitionsFromState(this._myCurrentStateID);
    }

    getCurrentTransitionsToState(stateID) {
        return this.getTransitionsFromStateToState(this._myCurrentStateID, stateID);
    }

    getCurrentTransitionMap() {
        return this.getTransitionMapFromState(this._myCurrentStateID);
    }

    getState(stateID) {
        return this._myStateMap.get(stateID);
    }

    getTransitionsFromState(fromStateID) {
        let transitionMap = this.getTransitionMapFromState(fromStateID);
        return Array.from(transitionMap.keys());
    }

    getTransitionsFromStateToState(fromStateID, toStateID) {
        let transitionMap = this.getTransitionMapFromState(fromStateID);

        let transitionsToState = [];
        for (let [transitionID, transitionData] of transitionMap.entries()) {
            if (transitionData.myToStateID == toStateID) {
                transitionsToState.push(transitionID);
            }
        }

        return transitionsToState;
    }

    getTransitionMapFromState(fromStateID) {
        return this._myTransitionMap.get(fromStateID);
    }

    removeState(stateID) {
        if (this.hasState(stateID)) {
            this._myStateMap.delete(stateID);
            this._myTransitionMap.delete(stateID);

            for (let transitionMap of this._myTransitionMap.values()) {
                let toDelete = [];
                for (let [transitionID, transitionData] of transitionMap.entries()) {
                    if (transitionData.myToStateID == stateID) {
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
        let fromTransitions = this.getTransitionMapFromState(fromStateID);
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
        return transitions.includes(transitionID);
    }

    hasTransitionFromStateToState(fromStateID, toStateID, transitionID = null) {
        let transitions = this.getTransitionsFromStateToState(fromStateID, toStateID);

        let hasTransition = false;
        if (transitionID) {
            hasTransition = transitions.includes(transitionID);
        } else {
            hasTransition = transitions.length > 0;
        }

        return hasTransition;
    }
};

PP.StateData = class StateData {
    constructor(stateID, stateObject) {
        this.myStateID = stateID;
        this.myStateObject = stateObject;
    }
};

PP.TransitionData = class TransitionData {
    constructor(transitionID, fromStateID, toStateID, transitionFunction) {
        this.myTransitionID = transitionID;
        this.myFromStateID = fromStateID;
        this.myToStateID = toStateID;
        this.myTransitionFunction = transitionFunction;
    }
};