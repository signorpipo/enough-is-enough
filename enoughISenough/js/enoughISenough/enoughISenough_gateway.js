WL.registerComponent("enough-IS-enough-gateway", {
    _myPlayerRumbleObject: { type: WL.Type.Object },
    _myRingAnimator: { type: WL.Type.Object },
    _myLeftHandAnimator: { type: WL.Type.Object },
    _myRightHandAnimator: { type: WL.Type.Object },
}, {
    init: function () {
        Global.myGoogleAnalytics = window.gtag != null;
        Global.myAudioManager = new PP.AudioManager();
        Global.myParticlesManager = new ParticlesManager();
        Global.myMeshObjectPoolMap = new PP.ObjectPoolManager();
        Global.myMeshNoFogObjectPoolMap = new PP.ObjectPoolManager();
        Global.myGameObjectPoolMap = new PP.ObjectPoolManager();
        Global.mySaveManager = new PP.SaveManager();
        //Global.mySaveManager.clear();
        Global.myScene = this.object;

        Global.myPlayerRumbleObject = this._myPlayerRumbleObject;
        Global.myRingAnimator = this._myRingAnimator.pp_getComponent("ring-animator");
        Global.myLeftHandAnimator = this._myLeftHandAnimator.pp_getComponent("hand-animator");
        Global.myRightHandAnimator = this._myRightHandAnimator.pp_getComponent("hand-animator");

        this.enoughISenough = new enoughISenough();

        Global.myAudioManager.setVolume(1);

        this._myFirstUpdate = true;
        this._myIncreasePool = false;
        this._myMeshObjectPoolSize = 20;
        this._myGameObjectPoolSize = 40;
    },
    start: function () {
        let version = Global.mySaveManager.loadNumber("game_version", 0);
        Global.myGameVersion = 5;

        let minVersionToReset = 4;
        if (version < minVersionToReset) {
            Global.mySaveManager.save("game_version", Global.myGameVersion);
            Global.mySaveManager.save("trial_started_once", false);
            Global.mySaveManager.save("trial_completed", false);
            Global.mySaveManager.save("trial_level", 1);
        } else if (version < Global.myGameVersion) {
            Global.mySaveManager.save("game_version", Global.myGameVersion);
        }

        let trialStartedOnce = Global.mySaveManager.loadBool("trial_started_once", false);
        let trialLevel = Global.mySaveManager.loadNumber("trial_level", 1);
        let trialCompleted = Global.mySaveManager.loadBool("trial_completed", false);
        Global.myEnableSelectPhysx = trialCompleted || (trialStartedOnce && trialLevel >= 2);
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._start();
            PP.setEasyTuneWidgetActiveVariable("Float 1");
        } else if (!Global.myFirstUpdateDone) {
            if (window.performance) {
                if (Global.myGoogleAnalytics) {
                    gtag("event", "load_time", {
                        "value": (performance.now() / 1000).toFixed(2)
                    });
                }
            }
            Global.myFirstUpdateDone = true;
        }

        if (this._myIncreasePool) {
            this._increasePools();
        } else {
            this.enoughISenough.update(dt * Global.myDeltaTimeSpeed);
            Global.myParticlesManager.update(dt * Global.myDeltaTimeSpeed);
            Global.mySaveManager.update(dt * Global.myDeltaTimeSpeed);
        }

        if (Global.myZestyToClick != null) {
            if (Global.myGoogleAnalytics) {
                gtag("event", "zesty_market_opened", {
                    "value": 1
                });
            }

            Global.myZestyToClick.onClick();
            Global.myZestyToClick = null;
        }
    },
    _start() {
        //let componentAmountMapBeforeLoad = Global.myScene.pp_getComponentAmountMapHierarchy();
        //console.error(componentAmountMapBeforeLoad);

        WL.scene.reserveObjects(10700, { "mesh": 5850, "text": 800, "collision": 70, "text-color-fog": 140 });

        {
            let staringCube = Global.myGameObjects.get(GameObjectType.STARING_CUBE);
            PP.MeshUtils.setClonedMaterials(staringCube);
            let cloneParams = new PP.CloneParams();
            cloneParams.myComponentsToInclude.push("mesh");
            Global.myMeshObjects.set(GameObjectType.STARING_CUBE, staringCube.pp_clone(cloneParams));
        }

        for (let entry of Global.myMeshObjects.entries()) {
            if (entry[0] != GameObjectType.STARING_CUBE && entry[0] != GameObjectType.ZESTY_MARKET) {
                PP.MeshUtils.setClonedMaterials(entry[1]);
                PP.TextUtils.setClonedMaterials(entry[1]);
            }
            entry[1].pp_setActive(false);

            let clonedMesh = entry[1].pp_clone();
            PP.MeshUtils.setClonedMaterials(clonedMesh);
            PP.TextUtils.setClonedMaterials(clonedMesh);
            PP.MeshUtils.setFogColor(clonedMesh, [0, 0, 0, 0]);
            Global.myMeshNoFogObjects.set(entry[0], clonedMesh);
        }

        for (let entry of Global.myGameObjects.entries()) {
            if (entry[0] != GameObjectType.STARING_CUBE && entry[0] != GameObjectType.ZESTY_MARKET) {
                PP.MeshUtils.setClonedMaterials(entry[1]);
                PP.TextUtils.setClonedMaterials(entry[1]);
            }
            entry[1].pp_setActive(false);
        }

        let meshObjectPoolParams = new PP.ObjectPoolParams();
        meshObjectPoolParams.myInitialPoolSize = 20;
        meshObjectPoolParams.myPercentageToAddWhenEmpty = 0.2;

        for (let entry of Global.myMeshObjects.entries()) {
            Global.myMeshObjectPoolMap.addPool(entry[0], entry[1], meshObjectPoolParams);
        }

        for (let entry of Global.myMeshNoFogObjects.entries()) {
            Global.myMeshNoFogObjectPoolMap.addPool(entry[0], entry[1], meshObjectPoolParams);
        }

        Global.myMeshObjectPoolMap.increasePoolPercentage(GameObjectType.MR_NOT, 1.2);
        Global.myMeshNoFogObjectPoolMap.increasePoolPercentage(GameObjectType.MR_NOT, 1.2);
        Global.myMeshObjectPoolMap.increasePoolPercentage(GameObjectType.MR_NOT_CLONE, 1.2);
        Global.myMeshNoFogObjectPoolMap.increasePoolPercentage(GameObjectType.MR_NOT_CLONE, 1.2);

        let cloneParams = new PP.CloneParams();
        cloneParams.myDeepCloneParams.deepCloneComponentVariable("mesh", "material", true);
        let mrNOTCloneObjectPoolParams = new PP.ObjectPoolParams();
        mrNOTCloneObjectPoolParams.myInitialPoolSize = 40;
        mrNOTCloneObjectPoolParams.myPercentageToAddWhenEmpty = 0.2;
        mrNOTCloneObjectPoolParams.myCloneParams = cloneParams;
        Global.myGameObjectPoolMap.addPool(GameObjectType.MR_NOT_CLONE, Global.myGameObjects.get(GameObjectType.MR_NOT_CLONE), mrNOTCloneObjectPoolParams);

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float 1", 0, 10, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float 2", 30, 5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float 3", 1.4, 5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Float 4", 4, 5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Int", 4, 1));
        PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Bool", false));

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("mr NOT Clone Scale", 0.35, 0.1, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Prevent Vent Lost", false));

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particle Life", 0.15, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particles Duration", 0.5, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particles Delay", 0.05, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Explosion Particles Amount", 2, 10));

        PP.CAUtils.setDummyServer(new EIECADummyServer());
        PP.CAUtils.setUseDummyServerOnSDKMissing(true);
        PP.CAUtils.setUseDummyServerOnError(true);

        this.enoughISenough.start();

        /*
        let componentAmountMapAfterLoad = Global.myScene.pp_getComponentAmountMapHierarchy();
        //console.error(componentAmountMapAfterLoad);

        let componentAmountMapDifference = new Map();
        for (let entry of componentAmountMapAfterLoad.entries()) {
            valueBefore = componentAmountMapBeforeLoad.get(entry[0]);
            valueBefore = valueBefore == null ? 0 : valueBefore;
            let result = entry[1] - valueBefore;
            if (result > 0) {
                componentAmountMapDifference.set(entry[0], result);
            }
        }
        console.error(componentAmountMapDifference);
        */
    },
    _increasePools() {
        let amountToIncrease = 5;

        if (this._myMeshObjectPoolSize > 0) {
            this._myMeshObjectPoolSize -= amountToIncrease;

            for (let entry of Global.myMeshObjects.entries()) {
                Global.myMeshObjectPoolMap.increasePool(entry[0], amountToIncrease);
            }

            for (let entry of Global.myMeshNoFogObjects.entries()) {
                Global.myMeshNoFogObjectPoolMap.increasePool(entry[0], amountToIncrease);
            }
        }

        if (this._myGameObjectPoolSize > 0) {
            this._myGameObjectPoolSize -= amountToIncrease;

            Global.myGameObjectPoolMap.increasePool(GameObjectType.MR_NOT_CLONE, amountToIncrease);
        }

        if (this._myGameObjectPoolSize <= 0 && this._myMeshObjectPoolSize <= 0) {
            this._myIncreasePool = false;
            if (WL.xrSession) {
                console.clear();
            }
        }
    }
});

var Global = {
    myDeltaTimeSpeed: 1,
    myScene: null,
    myFirstUpdateDone: false,
    myAudioManager: null,
    myParticlesManager: null,
    myPlayerRumbleObject: null,
    myRingAnimator: null,
    myLeftHandAnimator: null,
    myRightHandAnimator: null,
    myGameObjects: new Map(),
    myMeshObjects: new Map(),
    myMeshNoFogObjects: new Map(),
    myRingRadius: 0,
    myRingHeight: 0,
    myTitlesObject: null,
    myTitlesRumbleObject: null,
    myTitleObject: null,
    mySubtitleObject: null,
    myMeshObjectPoolMap: null,
    myMeshNoFogObjectPoolMap: null,
    myGameObjectPoolMap: null,
    myMaterials: null,
    myTrialDuration: 0,
    myArcadeDuration: 0,
    myVentDuration: 0,
    myDebugShortcutsEnabled: false,
    myDebugShortcutsPress: 2,
    myPlayerPosition: [0, 0, 0],
    myPlayerRotation: [0, 0, 0],
    myPlayerForward: [0, 0, 1],
    myPlayerUp: [0, 1, 0],
    myLightFadeInTime: 0,
    myStartFadeOut: false,
    myStatistics: null,
    myIsInMenu: false,
    myIsInArcadeResult: false,
    myZestyToClick: null,
    myEnableSelectPhysx: false,
    mySaveManager: null,
    myDebugCurrentVentObject: null,
    myPlayMusic: false,
    myStopMusic: false,
    myGameVersion: 0,
    myGoogleAnalytics: false
};