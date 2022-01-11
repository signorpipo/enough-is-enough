class TalkState extends PP.State {
    constructor(sentences, isDefeat) {
        super();

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "        Talk");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(1.5, "end"));
        this._myFSM.addState("mr_not_appear", this._updateMrNOTAppear.bind(this));
        this._myFSM.addState("talk", this._updateTalk.bind(this));
        this._myFSM.addState("mr_not_disappear", this._updateMrNOTDisappear.bind(this));
        this._myFSM.addState("second_wait", new PP.TimerState(0, "end"));
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

        this._myFSM.addTransition("init", "done", "skip");
        this._myFSM.addTransition("first_wait", "done", "skip");
        this._myFSM.addTransition("mr_not_appear", "done", "skip", this._hideMrNOT.bind(this));
        this._myFSM.addTransition("talk", "done", "skip", this._hideTalk.bind(this));
        this._myFSM.addTransition("mr_not_disappear", "done", "skip", this._hideMrNOT.bind(this));
        this._myFSM.addTransition("second_wait", "done", "skip");

        this._myFSM.init("init");

        this._myParentFSM = null;

        this._myTimer = new PP.Timer(1);

        this._myBlather = new Blather(sentences);

        this._myMrNOTAppearAudio = Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_APPEAR);
        this._myMrNOTDisappearAudio = Global.myAudioManager.createAudioPlayer(SfxID.MR_NOT_DISAPPEAR);

        //Setup
        this._myFogAlphaMax = 0.7;
        this._myFogAlphaMin = 0;
        this._mySpawnTime = 3;
        this._myUnspawnTime = 3.5;
        this._myHideScale = 0.9;

        this._myMrNOT = Global.myGameObjects.get(GameObjectType.MR_NOT);
    }

    update(dt, fsm) {
        this._myFSM.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myRightGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                this._myFSM.perform("skip");
                this._startFight();
            }
        }
    }

    _prepareState(fsm, transition) {
        transition.myToState.myObject.start(fsm, transition);
    }

    _prepareMrNOTAppear() {
        this._myMrNOT.pp_setPosition([0, 11, -18]);
        this._myMrNOT.pp_setRotation([40, 0, 0]);
        this._myMrNOT.pp_setScale([5, 5, 5]);
        PP.MeshUtils.setFogColor(this._myMrNOT, [0, 0, 0, this._myFogAlphaMax]);

        Global.myLightFadeInTime = this._mySpawnTime * 2 / 3;

        this._myTimer.start(this._mySpawnTime);

        this._myMrNOT.pp_setActive(true);

        this._myMrNOTAppearAudio.setPosition(this._myMrNOT.pp_getPosition());
        this._myMrNOTDisappearAudio.setPosition(this._myMrNOT.pp_getPosition());
        this._myMrNOTAppearAudio.play();
    }

    _updateMrNOTAppear(dt, fsm) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);
            let easing = t => t * (2 - t);
            PP.MeshUtils.setFogColor(this._myMrNOT, [0, 0, 0, Math.pp_mapToNewInterval(easing(this._myTimer.getPercentage()), 0, 1, this._myFogAlphaMax, this._myFogAlphaMin)]);
            let currentScaleFactor = Math.pp_interpolate(this._myHideScale, 1, this._myTimer.getPercentage(), PP.EasingFunction.easeOut);

            this._myMrNOT.pp_setScale([5, 5, 5]);
            this._myMrNOT.pp_scaleObject([currentScaleFactor, currentScaleFactor, 1]);

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
        this._myTimer.start(this._myUnspawnTime);
        Global.myLightFadeInTime = this._myUnspawnTime;
        Global.myStartFadeOut = true;
        this._myMrNOTDisappearAudio.play();
    }

    _updateMrNOTDisappear(dt, fsm) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);
            let easing = t => t * t;
            PP.MeshUtils.setFogColor(this._myMrNOT, [0, 0, 0, Math.pp_mapToNewInterval(this._myTimer.getPercentage(), 0.05, 0.8, this._myFogAlphaMin, this._myFogAlphaMax)]);
            let currentScaleFactor = Math.pp_interpolate(1, this._myHideScale, this._myTimer.getPercentage(), easing);

            this._myMrNOT.pp_setScale([5, 5, 5]);
            this._myMrNOT.pp_scaleObject([currentScaleFactor, currentScaleFactor, 1]);

            if (this._myTimer.isDone()) {
                this._myTimer.reset();
                this._hideMrNOT();
                fsm.perform("end");
            }
        }
    }

    _startFight() {
        Global.myStartFadeOut = false;
        this._myParentFSM.perform("end");
    }

    _hideMrNOT() {
        this._myMrNOT.pp_setActive(false);
        Global.myStartFadeOut = false;
    }

    _hideTalk() {
        this._hideMrNOT();
        this._myBlather.skip();
    }

    start(fsm, transition) {
        this._myParentFSM = fsm;
        this._myFSM.perform("start");
    }

    end(fsm, transitionID) {
        if (!this._myFSM.isInState("done")) {
            this._myFSM.perform("skip");
        }
    }
}

class Blather {
    constructor(sentences) {
        this._myBlatherTextObject = WL.scene.addObject(Global.myScene);
        this._myBlatherTextComponent = this._myBlatherTextObject.pp_addComponent("text");
        this._myBlatherTextComponent.text = " ";
        this._myBlatherTextComponent.text = "";
        this._myBlatherTextComponent.alignment = WL.Alignment.Left;
        this._myBlatherTextComponent.justification = WL.Justification.Line;
        this._myBlatherTextComponent.material = Global.myMaterials.myText.clone();
        this._myBlatherTextComponent.material.outlineRange = [0.5, 0.5];
        //this._myBlatherTextObject.pp_addComponent("pp-easy-text-color", { "_myVariableName": "ciao", "_myColorType": 0, "_myColorModel": 1 });


        //this._myBlatherTextComponent.material.color = [90 / 255, 90 / 255, 100 / 255, 1];
        //this._myBlatherTextComponent.material.outlineColor = [90 / 255, 90 / 255, 100 / 255, 1];
        this._myBlatherTextObject.pp_setActive(false);

        this._myBigBlatherTextObject = WL.scene.addObject(Global.myScene);
        this._myBigBlatherTextComponent = this._myBigBlatherTextObject.pp_addComponent("text");
        this._myBigBlatherTextComponent.text = " ";
        this._myBigBlatherTextComponent.text = "";
        this._myBigBlatherTextComponent.alignment = WL.Alignment.Left;
        this._myBigBlatherTextComponent.justification = WL.Justification.Line;
        this._myBigBlatherTextComponent.material = Global.myMaterials.myBigText.clone();
        this._myBigBlatherTextComponent.material.outlineRange = [0.5, 0.5];
        //this._myBigBlatherTextObject.pp_addComponent("pp-easy-text-color", { "_myVariableName": "ciao2", "_myColorType": 0, "_myColorModel": 1 });
        //this._myBigBlatherTextComponent.material.color = [90 / 255, 90 / 255, 100 / 255, 1];
        //this._myBigBlatherTextComponent.material.outlineColor = [90 / 255, 90 / 255, 100 / 255, 1];
        this._myBigBlatherTextObject.pp_setActive(false);

        this._mySentences = sentences;

        this._myTimerState = new PP.TimerState(1, "end");

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "            Blather");
        this._myFSM.addState("init");
        this._myFSM.addState("first_wait", new PP.TimerState(1, "end"));
        this._myFSM.addState("blather", this._updateBlather.bind(this));
        this._myFSM.addState("wait", this._myTimerState);
        this._myFSM.addState("second_wait", this._myTimerState);
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "first_wait", "start", this._prepareState.bind(this));
        this._myFSM.addTransition("first_wait", "blather", "end", this._nextBlather.bind(this, true));
        this._myFSM.addTransition("blather", "wait", "next");
        this._myFSM.addTransition("wait", "blather", "end", this._nextBlather.bind(this, false));
        this._myFSM.addTransition("blather", "second_wait", "end");
        this._myFSM.addTransition("second_wait", "done", "end", this._done.bind(this));
        this._myFSM.addTransition("done", "first_wait", "start", this._prepareState.bind(this));

        this._myFSM.addTransition("init", "done", "skip");
        this._myFSM.addTransition("first_wait", "done", "skip");
        this._myFSM.addTransition("blather", "done", "skip", this._done.bind(this));
        this._myFSM.addTransition("wait", "done", "skip");
        this._myFSM.addTransition("blather", "done", "skip", this._done.bind(this));
        this._myFSM.addTransition("second_wait", "done", "skip");

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

    skip(dt) {
        this._myFSM.perform("skip");
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
        this._myBigBlatherTextObject.pp_setActive(true);
    }

    _nextBlather(speedStart) {
        this._myIsDone = false;
        this._myCurrentSenteceIndex++;
        this._myCurrentCharacterIndex = 0;

        if (this._mySentences[this._myCurrentSenteceIndex].myIsBigBlather) {
            this._setBigBlatherPosition();
        } else {
            this._setBlatherPosition();
        }

        this._myCharacterTimer.start(speedStart ? 0 : 0.13);
        this._myNextTimer.reset(1);
    }

    _updateBlather(dt, fsm) {
        let sentence = this._mySentences[this._myCurrentSenteceIndex];

        let textComponent = this._myBlatherTextComponent;
        if (sentence.myIsBigBlather) {
            textComponent = this._myBigBlatherTextComponent;
        }

        if (!this._myNextTimer.isRunning()) {
            this._myCharacterTimer.update(dt);

            if (this._myCharacterTimer.isDone()) {
                let character = sentence.mySentence[this._myCurrentCharacterIndex];
                textComponent.text = textComponent.text.concat(character);

                if (character != ' ') {
                    let player = this._myCharAudios[this._myCurrentCharacterIndex % 2];
                    player.play();
                }

                if (sentence.myIsBigBlather) {
                    this._myCharacterTimer.start(0.5);
                } else {
                    if (this._myCurrentCharacterIndex + 1 < sentence.mySentence.length &&
                        (sentence.mySentence[this._myCurrentCharacterIndex + 1] == '.') ||
                        (sentence.mySentence.includes("KNOW") && this._myCurrentCharacterIndex > 2)) {
                        this._myCharacterTimer.start(0.3);
                    } else {
                        this._myCharacterTimer.start(0.13);
                    }
                }

                this._myCurrentCharacterIndex++;
            }

            if (this._myCurrentCharacterIndex == sentence.mySentence.length) {
                this._myNextTimer.start(sentence.myTimeToWaitBeforeDisappearing);
            }
        } else {
            this._myNextTimer.update(dt);
            if (this._myNextTimer.isDone()) {
                this._myTimerState.setDuration(sentence.myTimeToWaitAfterDisappearing);
                if (this._myCurrentSenteceIndex < this._mySentences.length - 1) {
                    textComponent.text = "";
                    fsm.perform("next");
                } else {
                    textComponent.text = "";
                    fsm.perform("end");
                }
            }
        }
    }

    _done() {
        this._myBlatherTextComponent.text = "";
        this._myBigBlatherTextComponent.text = "";
        this._myBlatherTextObject.pp_setActive(false);
        this._myBigBlatherTextObject.pp_setActive(false);
        this._myIsDone = true;
    }

    _setBlatherPosition() {
        this._myBlatherTextObject.pp_setPosition([0, 2.074, -9]);
        this._myBlatherTextObject.pp_setRotation([0, 0, 0]);
        this._myBlatherTextObject.pp_setScale([3.5, 3.5, 3.5]);

        this._myCharAudios[0].setPosition(this._myBlatherTextObject.pp_getPosition());
        this._myCharAudios[1].setPosition(this._myBlatherTextObject.pp_getPosition());

        let sentenceLength = this._mySentences[this._myCurrentSenteceIndex].mySentence.length;
        let displacement = sentenceLength * 0.0945;
        if (this._mySentences[this._myCurrentSenteceIndex].mySentence.includes("...")) {
            displacement = sentenceLength * 0.0905;
        }
        this._myBlatherTextObject.translateObject([-displacement, 0, 0]);
    }

    _setBigBlatherPosition() {
        this._myBigBlatherTextObject.pp_setPosition([0, 4, -10.5]);
        this._myBigBlatherTextObject.pp_setRotation([20, 0, 0]);
        this._myBigBlatherTextObject.pp_setScale(19);

        this._myCharAudios[0].setPosition(this._myBigBlatherTextObject.pp_getPosition());
        this._myCharAudios[1].setPosition(this._myBigBlatherTextObject.pp_getPosition());

        let sentenceLength = this._mySentences[this._myCurrentSenteceIndex].mySentence.length;
        let displacement = sentenceLength * 0.585;
        this._myBigBlatherTextObject.translateObject([-displacement, 0, 0]);
    }
}

class Sentence {
    constructor(sentence, timeToWaitBeforeDisappearing = 1, timeToWaitAfterDisappearing = 1, isBigBlather = false) {
        this.mySentence = sentence;
        this.myTimeToWaitBeforeDisappearing = timeToWaitBeforeDisappearing;
        this.myTimeToWaitAfterDisappearing = timeToWaitAfterDisappearing;
        this.myIsBigBlather = isBigBlather;
    }
}