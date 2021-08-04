/*
    There is no need to inherit from this state
    It's more like an example of what is needed
    
    If you don't specify some methods the fsm will just skip them
    Or consider them always valid
        If you don't specify an isReadyForTransition function it will be like it's always true 
*/

PP.State = class State {

    update(dt, fsm) {
    }

    //Called when the fsm is started with this init state if no init function is specified
    init(fsm) {
    }

    //Called when entering this state if no transition function is specified
    start(fsm, transitionID) {
    }

    //Called when exiting this state if no transition function is specified
    end(fsm, transitionID) {
    }
};