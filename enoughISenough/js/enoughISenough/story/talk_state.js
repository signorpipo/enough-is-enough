class TalkState extends PP.State {
    constructor(sentences, isDefeat) {
        super();

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "   Talk");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("mr_not_appear", this._updateMrNOTAppear.bind(this));
        this._myFSM.addState("talk", this._updateTalk.bind(this));
        this._myFSM.addState("mr_not_disappear", this._updateMrNOTDisappear.bind(this));
        this._myFSM.addState("second_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("done");

        if (isDefeat) {
            this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
            this._myFSM.addTransition("first_wait", "talk", "end", this._prepareMrNOTAppear.bind(this));
            this._myFSM.addTransition("talk", "second_wait", "end", this._prepareMrNOTDisappear.bind(this));
            this._myFSM.addTransition("second_wait", "done", "end", this._startFight.bind(this));
            this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));
        } else {
            this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
            this._myFSM.addTransition("first_wait", "mr_not_appear", "end", this._prepareMrNOTAppear.bind(this));
            this._myFSM.addTransition("mr_not_appear", "talk", "end", this._prepareTalk.bind(this));
            this._myFSM.addTransition("talk", "mr_not_disappear", "end", this._prepareMrNOTDisappear.bind(this));
            this._myFSM.addTransition("mr_not_disappear", "second_wait", "end");
            this._myFSM.addTransition("second_wait", "done", "end", this._startFight.bind(this));
            this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));
        }

        this._myFSM.init("init");

        this._myParentFSM = null;

        this._myTimer = new PP.Timer(1);

        this._myTalk = new Talk(sentences);

        //Setup
        this._mySpawnTime = 1.5;
        this._myHideScale = 0.95;
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    _prepareState() {

    }

    _prepareMrNOTAppear() {
        this._myMrNOT = Global.myObjectPoolMap.getObject(GameObjectType.MR_NOT);
        this._myMrNOT.pp_setPosition([0, 11, -18]);
        this._myMrNOT.pp_setRotation([40, 0, 0]);
        this._myMrNOT.pp_setScale([5, 5, 1]);
        PP.MeshUtils.setAlpha(this._myMrNOT, 0);
        this._myMrNOT.pp_setActive(true);

        this._myTimer.start(this._mySpawnTime);
    }

    _updateMrNOTAppear(dt, fsm) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);
            PP.MeshUtils.setAlpha(this._myMrNOT, this._myTimer.getPercentage());
            let currentScaleFactor = Math.pp_interpolate(this._myHideScale, 1, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

            this._myMrNOT.pp_setScale([5, 5, 1]);
            this._myMrNOT.pp_scaleObject(currentScaleFactor);

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
                fsm.perform("end");
            }
        }
    }

    _prepareTalk() {
        this._myTalk.start();
    }

    _updateTalk(dt, fsm) {
        this._myTalk.update(dt);
        if (this._myTalk.isDone()) {
            fsm.perform("end");
        }
    }

    _prepareMrNOTDisappear() {
        this._myTimer.start(this._mySpawnTime);
    }

    _updateMrNOTDisappear(dt, fsm) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);
            PP.MeshUtils.setAlpha(this._myMrNOT, 1 - this._myTimer.getPercentage());
            let currentScaleFactor = Math.pp_interpolate(1, this._myHideScale, this._myTimer.getPercentage(), PP.EasingFunction.easeInOut);

            this._myMrNOT.pp_setScale([5, 5, 1]);
            this._myMrNOT.pp_scaleObject(currentScaleFactor);

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
                Global.myObjectPoolMap.releaseObject(GameObjectType.MR_NOT, this._myMrNOT);
                this._myMrNOT = null;
                fsm.perform("end");
            }
        }
    }

    _startFight() {
        this._myParentFSM.perform("end");
    }

    start(fsm, transition) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
    }
}

class Talk {
    constructor(sentences) {
        this._myTalkTextObject = WL.scene.addObject(Global.myScene);
        this._myTalkTextComponent = this._myTalkTextObject.pp_addComponent("text");
        this._myTalkTextComponent.text = " ";
        this._myTalkTextComponent.alignment = WL.Alignment.Left;
        this._myTalkTextComponent.justification = WL.Justification.Top;
        this._myTalkTextComponent.material = Materials.myText.clone();
        this._myTalkTextComponent.material.outlineRange = [0.5, 0.5];
        this._myTalkTextComponent.material.color = [1, 1, 1, 1];
        this._myTalkTextComponent.material.outlineColor = [1, 1, 1, 0];
        this._myTalkTextObject.pp_setActive(false);

        this._mySentences = sentences;
    }

    start() {

    }

    update(dt) {

    }

    isDone() {
        return true;
    }
}