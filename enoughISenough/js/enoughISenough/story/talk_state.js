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
            this._myFSM.addTransition("first_wait", "talk", "end", this._prepareTalk.bind(this));
            this._myFSM.addTransition("talk", "second_wait", "end");
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

        this._myBlather = new Blather(sentences);

        //Setup
        this._mySpawnTime = 1.5;
        this._myHideScale = 0.95;
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
    }

    _prepareState(fsm, transition) {
        transition.myToState.myObject.start(fsm, transition);
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
        this._myBlather.start();
    }

    _updateTalk(dt, fsm) {
        this._myBlather.update(dt);
        if (this._myBlather.isDone()) {
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

class Blather {
    constructor(sentences) {
        this._myBlatherTextObject = WL.scene.addObject(Global.myScene);
        this._myBlatherTextComponent = this._myBlatherTextObject.pp_addComponent("text");
        this._myBlatherTextComponent.text = " ";
        this._myBlatherTextComponent.text = "";
        this._myBlatherTextComponent.alignment = WL.Alignment.Left;
        this._myBlatherTextComponent.justification = WL.Justification.Top;
        this._myBlatherTextComponent.material = Global.myMaterials.myText.clone();
        this._myBlatherTextComponent.material.outlineRange = [0.5, 0.5];
        this._myBlatherTextComponent.material.color = [90 / 255, 90 / 255, 100 / 255, 1];
        this._myBlatherTextComponent.material.outlineColor = [90 / 255, 90 / 255, 100 / 255, 1];
        this._myBlatherTextObject.pp_setActive(false);

        this._mySentences = sentences;

        this._myFSM = new PP.FSM();
        this._myFSM.setDebugLogActive(true, "      Blather");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.WaitState(0.5, "end"));
        this._myFSM.addState("blather", this._updateBlather.bind(this));
        this._myFSM.addState("wait", new PP.WaitState(1, "end"));
        this._myFSM.addState("second_wait", new PP.WaitState(1.5, "end"));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "blather", "end", this._nextBlather.bind(this));
        this._myFSM.addTransition("blather", "wait", "next");
        this._myFSM.addTransition("wait", "blather", "end", this._nextBlather.bind(this));
        this._myFSM.addTransition("blather", "second_wait", "end");
        this._myFSM.addTransition("second_wait", "done", "end", this._done.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myIsDone = false;
        this._myCurrentSenteceIndex = 0;
        this._myCurrentCharacterIndex = 0;

        this._myCharacterTimer = new PP.Timer(0.1);
        this._myNextTimer = new PP.Timer(0.1);

        this._myCharAudios = [];
        this._myCharAudios[0] = Global.myAudioManager.createAudioPlayer(SfxID.BLABLA_2);
        this._myCharAudios[1] = Global.myAudioManager.createAudioPlayer(SfxID.BLABLA_1);

        this._myFSM.init("init");
    }

    start() {
        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);
    }

    isDone() {
        return this._myIsDone;
    }

    _prepareState() {
        this._myIsDone = false;
        this._myCurrentSenteceIndex = -1;
        this._myBlatherTextObject.pp_setActive(true);
    }

    _nextBlather() {
        this._myIsDone = false;
        this._myCurrentSenteceIndex++;
        this._myCurrentCharacterIndex = 0;

        this._setBlatherPosition();

        this._myCharacterTimer.start();
        this._myNextTimer.reset(1);
    }

    _updateBlather(dt, fsm) {
        if (!this._myNextTimer.isRunning()) {
            this._myCharacterTimer.update(dt);
            let sentence = this._mySentences[this._myCurrentSenteceIndex];

            if (this._myCharacterTimer.isDone()) {
                let character = sentence[this._myCurrentCharacterIndex];
                this._myBlatherTextComponent.text = this._myBlatherTextComponent.text.concat(character);

                if (character != ' ') {
                    let player = this._myCharAudios[this._myCurrentCharacterIndex % 2];
                    player.play();
                }

                if (this._myCurrentCharacterIndex + 1 < sentence.length && sentence[this._myCurrentCharacterIndex + 1] == '.') {
                    this._myCharacterTimer.start(0.3);
                } else {
                    this._myCharacterTimer.start(0.13);
                }

                this._myCurrentCharacterIndex++;
            }

            if (this._myCurrentCharacterIndex == sentence.length) {
                if (this._myCurrentSenteceIndex < this._mySentences.length - 1) {
                    this._myNextTimer.start(1);
                } else {
                    this._myNextTimer.start(2);
                }
            }
        } else {
            this._myNextTimer.update(dt);
            if (this._myNextTimer.isDone()) {
                if (this._myCurrentSenteceIndex < this._mySentences.length - 1) {
                    this._myBlatherTextComponent.text = "";
                    fsm.perform("next");
                } else {
                    this._myBlatherTextComponent.text = "";
                    fsm.perform("end");
                }
            }
        }
    }

    _done() {
        this._myBlatherTextObject.pp_setActive(false);
        this._myIsDone = true;
    }

    _setBlatherPosition() {
        this._myBlatherTextObject.pp_setPosition([0, 2.4, -9]);
        this._myBlatherTextObject.pp_setRotation([0, 0, 0]);
        this._myBlatherTextObject.pp_setScale([3.5, 3.5, 3.5]);

        this._myCharAudios[0].setPosition(this._myBlatherTextObject.pp_getPosition());
        this._myCharAudios[1].setPosition(this._myBlatherTextObject.pp_getPosition());

        let sentenceLength = this._mySentences[this._myCurrentSenteceIndex].length;
        let displacement = sentenceLength * 0.096;
        this._myBlatherTextObject.translateObject([-displacement, 0, 0]);
    }
}