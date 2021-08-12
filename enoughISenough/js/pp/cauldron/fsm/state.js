/*
    There is no need to inherit from this state, especially since states can be only functions
    It's more like an example of what is needed
    
    If you don't specify some methods the fsm will just skip them
    Or consider them always valid
        If you don't specify an isReadyForTransition function it will be like it's always true 

    The param state (forwarded at the end every function) is of type PP.StateData and can be used to retrieve the stateID and other data
    The param transition is of type PP.TransitionData and can be used to retrieve the transitionID and other data
*/

PP.State = class State {

    //Called every frame if this is the current state
    update(dt, fsm, state) {
    }

    //Called when the fsm is started with this init state if no init transition object is specified or it does not have a performInit function
    init(fsm, state) {
    }

    //Called when entering this state if no transition object is specified or it does not have a perform function
    start(fsm, transition, state) {
    }

    //Called when exiting this state if no transition function is specified
    end(fsm, transition, state) {
    }

};