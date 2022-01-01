class ShowTitleState extends PP.State {
    constructor() {
        super();
        this._myTitlesObject = WL.scene.addObject(Global.myScene);
        this._myTitlesRumbleObject = WL.scene.addObject(this._myTitlesObject);
        this._myTitle = WL.scene.addObject(null);
        this._mySubtitle = WL.scene.addObject(null);

        Global.myTitlesObject = this._myTitlesObject;
        Global.myTitlesRumbleObject = this._myTitlesRumbleObject;
        Global.myTitleObject = this._myTitle;
        Global.mySubtitleObject = this._mySubtitle;

        this._myTitleTextComponent = this._myTitle.addComponent('text');
        this._myTitleTextComponent.alignment = WL.Alignment.Left;
        this._myTitleTextComponent.justification = WL.Justification.Line;
        this._myTitleTextComponent.material = Global.myMaterials.myTitle.clone();
        this._myTitleTextComponent.text = " ";

        this._mySubtitleTextComponent = this._mySubtitle.addComponent('text');
        this._mySubtitleTextComponent.alignment = WL.Alignment.Left;
        this._mySubtitleTextComponent.justification = WL.Justification.Line;
        this._mySubtitleTextComponent.material = Global.myMaterials.mySubtitle.clone();
        this._mySubtitleTextComponent.text = " ";

        this._myTitlesObjectPosition = [-10, 133, -164];
        this._myTitlesObject.pp_setPosition(this._myTitlesObjectPosition);

        this._myTitle.pp_setPosition([-97, 153, -196]);
        this._myTitle.pp_setScale(550);
        this._myTitle.pp_setRotation([40, 0, 0]);

        this._mySubtitle.pp_setPosition([-138, 77, -148]);
        this._mySubtitle.pp_setScale(290);
        this._mySubtitle.pp_setRotation([40, 0, 0]);

        this._myTitle.pp_setParent(this._myTitlesRumbleObject);
        this._mySubtitle.pp_setParent(this._myTitlesRumbleObject);

        this._myTitleCenterPosition = [0, 168, -184];
        this._mySubtitleCenterPosition = [-7, 83, -143];

        this._myCharAudios = [];
        this._myCharAudios[0] = Global.myAudioManager.createAudioPlayer(SfxID.BLABLA_2);
        this._myCharAudios[1] = Global.myAudioManager.createAudioPlayer(SfxID.BLABLA_1);

        this._myNotEnough = new NotEnough(this._mySubtitleCenterPosition);

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "        Show Title");
        this._myFSM.addState("show_title", this.showTitle.bind(this));
        this._myFSM.addState("show_sub_1", this.showSub1.bind(this));
        this._myFSM.addState("show_sub_IS", this.showSubIS.bind(this));
        this._myFSM.addState("show_sub_2", this.showSub2.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("show_title", "show_sub_1", "end", this.prepareShowSub1.bind(this));
        this._myFSM.addTransition("show_sub_1", "show_sub_IS", "end", this.prepareShowSubIS.bind(this));
        this._myFSM.addTransition("show_sub_IS", "show_sub_2", "end", this.prepareShowSub2.bind(this));
        this._myFSM.addTransition("show_sub_2", "done", "end");

        this._myCharMinTime = 0.1;
        this._myCharMaxTime = 0.1;
    }

    start() {
        this._myFSM.init("show_title", this.prepareShowTitle.bind(this));
    }

    end(fsm, transition, state) {
        if (transition.myID == "skip") {
            this._skip();
        }
    }

    update(dt, fsm) {
        this._myFSM.update(dt);
        if (this._myFSM.isInState("done")) {
            fsm.perform("end");
        }
    }

    prepareShowTitle(fsm) {
        this._myCharAudios[0].setPosition(this._myTitleCenterPosition);
        this._myCharAudios[1].setPosition(this._myTitleCenterPosition);

        this._myCharMinTime = 0.5;
        this._myCharMaxTime = 0.5;

        this._myCharTimer = new PP.Timer(Math.pp_random(this._myCharMinTime, this._myCharMaxTime));
        this._myWaitTimer = new PP.Timer(1);
        this._myChars = "mr NOT";
        this._myCurrChar = 0;
    }

    showTitle(dt, fsm) {
        if (this._myCurrChar != this._myChars.length) {
            this._myCharTimer.update(dt);
            if (this._myCharTimer.isDone()) {
                this._myCharTimer.start(Math.pp_random(this._myCharMinTime, this._myCharMaxTime));

                let currentCharacter = this._myChars[this._myCurrChar];

                if (currentCharacter != ' ') {
                    let player = this._myCharAudios[this._myCurrChar % 2];
                    player.play();
                }

                this._myTitleTextComponent.text = this._myTitleTextComponent.text.concat(currentCharacter);

                this._myCurrChar++;
            }
        } else {
            this._myWaitTimer.update(dt);
            if (this._myWaitTimer.isDone()) {
                fsm.perform("end");
            }
        }
    }

    prepareShowSub1(fsm) {
        this._myCharAudios[0].setPosition(this._mySubtitleCenterPosition);
        this._myCharAudios[1].setPosition(this._mySubtitleCenterPosition);

        this._myCharMinTime = 0.15;
        this._myCharMaxTime = 0.15;

        this._myCharTimer = new PP.Timer(Math.pp_random(this._myCharMinTime, this._myCharMaxTime));
        this._myWaitTimer = new PP.Timer(0.1);
        this._myChars = "enough";
        this._myCurrChar = 0;
    }

    showSub1(dt, fsm) {
        if (this._myCurrChar != this._myChars.length) {
            this._myCharTimer.update(dt);
            if (this._myCharTimer.isDone()) {
                this._myCharTimer.start(Math.pp_random(this._myCharMinTime, this._myCharMaxTime));

                let currentCharacter = this._myChars[this._myCurrChar];

                if (currentCharacter != ' ') {
                    let player = this._myCharAudios[this._myCurrChar % 2];
                    player.play();
                }

                this._mySubtitleTextComponent.text = this._mySubtitleTextComponent.text.concat(currentCharacter);

                this._myCurrChar++;
            }
        } else {
            this._myWaitTimer.update(dt);
            if (this._myWaitTimer.isDone()) {
                fsm.perform("end");
            }
        }
    }

    prepareShowSubIS(fsm) {
        this._myNotEnough.start();

        this._mySubtitleTextComponent.text = this._mySubtitleTextComponent.text.concat(" IS ");
    }

    showSubIS(dt, fsm) {
        this._myNotEnough.update(dt);
        if (!this._myNotEnough.isNotEnoughing()) {
            fsm.perform("end");
        }
    }

    prepareShowSub2(fsm) {
        this._myCharAudios[0].setPosition(this._mySubtitleCenterPosition);
        this._myCharAudios[1].setPosition(this._mySubtitleCenterPosition);

        this._myCharMinTime = 0.15;
        this._myCharMaxTime = 0.15;

        this._myCharTimer = new PP.Timer(Math.pp_random(this._myCharMinTime, this._myCharMaxTime));
        this._myChars = "enough";
        this._myCurrChar = 0;

        this._myWaitTimer = new PP.Timer(1);
    }

    showSub2(dt, fsm) {
        this.showSub1(dt, fsm);
    }

    _skip() {
        this._myCharAudios[0].stop();
        this._myCharAudios[1].stop();

        this._myNotEnough.stop();

        this._myTitleTextComponent.text = "mr NOT";
        this._mySubtitleTextComponent.text = "enough IS enough";
    }
}