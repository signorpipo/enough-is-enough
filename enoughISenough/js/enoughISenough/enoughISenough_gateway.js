WL.registerComponent("enough-IS-enough-gateway", {
    _myPlayerRumbleObject: { type: WL.Type.Object },
    _myRingAnimator: { type: WL.Type.Object },
    _myLeftHandAnimator: { type: WL.Type.Object },
    _myRightHandAnimator: { type: WL.Type.Object },
}, {
    init: function () {
        if (PP.myEasyTuneVariables == null) {
            PP.myEasyTuneVariables = new PP.EasyTuneVariables();
        }

        PP.CAUtils.initializeSDK();

        Global.myAnalyticsEnabled = true;

        Global.sendAnalytics("event", "game_init_started", {
            "value": 1
        });

        Global.myAudioManager = new PP.AudioManager();
        Global.myParticlesManager = new ParticlesManager();
        Global.myMeshObjectPoolMap = new PP.ObjectPoolManager();
        Global.myMeshNoFogObjectPoolMap = new PP.ObjectPoolManager();
        Global.myGameObjectPoolMap = new PP.ObjectPoolManager();
        Global.mySaveManager = new PP.SaveManager("enoughISenough");
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
        this._myUpdateReadyCountdown = 10;
        this._myLoadTimeSent = false;
        this._myVRSupportedSent = false;
        this._myLoadSaveObjectFailedEventSent = false;
        this._myLoadedSaveObjectParseFailedEventSent = false;

        this._myTimeUsingTrackedHands = 0;

        this._myDesiredFrameRate = null;
        this._mySetDesiredFrameRateMaxAttempts = 10;

        this._myResetXRSessionActiveOpenLinkExtraCheckTimer = new PP.Timer(2);

        this._myVRButtonVisibilityUpdated = false;
        this._myVRButtonDisabledOpacityUpdated = false;
        this._myVRButtonUsabilityUpdated = false;
        this._myXRButtonsContainer = document.getElementById("xr-buttons-container");
        this._myVRButton = document.getElementById("vr-button");

        if (window.location != null && window.location.host != null) {
            Global.myIsLocalhost = window.location.host == "localhost:8080";
        }

        Global.myAnalyticsEnabled = !Global.myIsLocalhost;

        this._myGestureStartEventListener = function (event) {
            event.preventDefault();
        };
        document.addEventListener("gesturestart", this._myGestureStartEventListener);
    },
    start: function () {
        Global.myGameVersion = "1.2.3";

        let trialEndedOnce = Global.mySaveManager.load("trial_ended_once", false);
        let trialPhase = Global.mySaveManager.load("trial_phase", 1);
        let trialCompleted = Global.mySaveManager.load("trial_completed", false);
        Global.myEnableSelectPhysx = trialCompleted || (trialEndedOnce && trialPhase >= 2);

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    },
    update: function (dt) {
        if (this._myFirstUpdate) {
            this._myFirstUpdate = false;
            this._start();
            PP.setEasyTuneWidgetActiveVariable("Float 1");
        } else {
            if (!this._myVRButtonUsabilityUpdated) {
                this._updateVRButtonVisibility();
            }

            if (!Global.myUpdateReady) {
                this._myUpdateReadyCountdown--;
                if (this._myUpdateReadyCountdown <= 0) {
                    Global.myUpdateReady = true;

                    console.log("Game Version:", Global.myGameVersion);

                    Global.sendAnalytics("event", "game_init_ended", {
                        "value": 1
                    });

                    if (!this._myLoadTimeSent) {
                        if (window.performance) {
                            Global.sendAnalytics("event", "load_seconds", {
                                "value": (window.performance.now() / 1000).toFixed(2)
                            });
                        }

                        this._myLoadTimeSent = true;
                    }
                }
            }
        }

        if (WL.xrSession != null && WL.xrSession.updateTargetFrameRate != null && this._myDesiredFrameRate != null && WL.xrSession.frameRate != this._myDesiredFrameRate) {
            try {
                WL.xrSession.updateTargetFrameRate(this._myDesiredFrameRate).catch(function () {
                    if (this._mySetDesiredFrameRateMaxAttempts > 0) {
                        this._mySetDesiredFrameRateMaxAttempts--;
                    } else {
                        this._myDesiredFrameRate = null;
                    }
                }.bind(this));
            } catch (error) {
                if (this._mySetDesiredFrameRateMaxAttempts > 0) {
                    this._mySetDesiredFrameRateMaxAttempts--;
                } else {
                    this._myDesiredFrameRate = null;
                }
            }
        }

        if (Global.myUpdateReady) {
            if (this._myIncreasePool) {
                this._increasePools();
            } else {
                if (!this._myVRSupportedSent) {
                    if (WL.vrSupported != null && WL.vrSupported != 0) {
                        this._myVRSupportedSent = true;
                        Global.sendAnalytics("event", "vr_supported", {
                            "value": 1
                        });
                    }
                }

                if (!this._myLoadSaveObjectFailedEventSent) {
                    this._myLoadSaveObjectFailedEventSent = true;
                    if (!Global.mySaveManager.hasLoadSavesSucceded()) {
                        Global.sendAnalytics("event", "load_saves_failed", {
                            "value": 1
                        });
                    }
                }

                if (!this._myLoadedSaveObjectParseFailedEventSent) {
                    this._myLoadedSaveObjectParseFailedEventSent = true;
                    if (Global.myLoadedSaveObjectParseFailed) {
                        Global.sendAnalytics("event", "parse_saves_failed", {
                            "value": 1
                        });
                    }
                }

                if (Global.myDebugShortcutsEnabled) {
                    if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.BOTTOM_BUTTON).isPressEnd(Global.myDebugShortcutsPress)) {
                        if (Global.myDeltaTimeSpeed == 1) {
                            Global.myDeltaTimeSpeed = 3;
                        } else if (Global.myDeltaTimeSpeed == 3) {
                            Global.myDeltaTimeSpeed = 10;
                        } else if (Global.myDeltaTimeSpeed == 10) {
                            Global.myDeltaTimeSpeed = 50;
                        } else {
                            Global.myDeltaTimeSpeed = 1;
                        }
                    }

                    if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.TOP_BUTTON).isPressEnd(Global.myDebugShortcutsPress)) {
                        if (!PP.myEasyTuneVariables.get("Prevent Vent Lost") && !PP.myEasyTuneVariables.get("Prevent Vent Lost Only Clone")) {
                            PP.myEasyTuneVariables.set("Prevent Vent Lost Only Clone", true);
                        } else if (!PP.myEasyTuneVariables.get("Prevent Vent Lost") && PP.myEasyTuneVariables.get("Prevent Vent Lost Only Clone")) {
                            PP.myEasyTuneVariables.set("Prevent Vent Lost", true);
                            PP.myEasyTuneVariables.set("Prevent Vent Lost Only Clone", false);
                        } else {
                            PP.myEasyTuneVariables.set("Prevent Vent Lost", false);
                            PP.myEasyTuneVariables.set("Prevent Vent Lost Only Clone", false);
                        }
                    }
                }

                if (PP.InputUtils.getInputSourceType(PP.Handedness.LEFT) == PP.InputSourceType.HAND &&
                    PP.InputUtils.getInputSourceType(PP.Handedness.RIGHT) == PP.InputSourceType.HAND
                ) {
                    Global.myIsUsingTrackedHands = true;
                } else {
                    Global.myIsUsingTrackedHands = false;
                }

                if (PP.XRUtils.isXRSessionActive() && !Global.myXRSessionActiveOpenLinkExtraCheck) {
                    this._myResetXRSessionActiveOpenLinkExtraCheckTimer.update(dt);
                    if (this._myResetXRSessionActiveOpenLinkExtraCheckTimer.isDone()) {
                        Global.myXRSessionActiveOpenLinkExtraCheck = true;
                        this._myResetXRSessionActiveOpenLinkExtraCheckTimer.start();
                    }
                } else {
                    this._myResetXRSessionActiveOpenLinkExtraCheckTimer.start();
                }

                if (Global.myElementToClick != null) {
                    Global.myElementToClickCounter--;
                    if (Global.myElementToClickCounter <= 0) {
                        Global.myElementToClickCounter = 0;
                        let elementToClick = Global.myElementToClick;
                        Global.myElementToClick = null;

                        try {
                            elementToClick.click();
                            document.body.removeChild(elementToClick);
                        } catch (error) {
                            // Do nothing
                        }
                    }
                }

                this.enoughISenough.update(dt * Global.myDeltaTimeSpeed);
                Global.myParticlesManager.update(dt * Global.myDeltaTimeSpeed);
                Global.mySaveManager.update(dt * Global.myDeltaTimeSpeed);

                if (Global.myIntroDone && Global.myIsUsingTrackedHands && this._myTimeUsingTrackedHands < 7) {
                    this._myTimeUsingTrackedHands += dt;
                    if (this._myTimeUsingTrackedHands >= 7) {
                        Global.sendAnalytics("event", "is_using_tracked_hands", {
                            "value": 1
                        });
                    }
                }
            }

            if (Global.myUnmute && PP.XRUtils.isXRSessionActive() && Global.myXRSessionActiveOpenLinkExtraCheck) {
                Global.myUnmute = false;
                Howler.mute(false);
            }

            if (!Global.myIsUsingTrackedHandsVentEventSent) {
                if (Global.myVentDurationWithTrackedHands >= 40) {
                    Global.myIsUsingTrackedHandsVentEventSent = true;

                    Global.sendAnalytics("event", "is_using_tracked_hands_vent", {
                        "value": 1
                    });
                }
            }
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
            } else if (entry[0] == GameObjectType.ZESTY_MARKET) {
                let zestyMeshes = entry[1].pp_getComponentsHierarchy("mesh");
                for (let zestyMesh of zestyMeshes) {
                    let zestyMeshName = zestyMesh.object.pp_getName();
                    if (zestyMeshName.includes("Frame")) {
                        zestyMesh.material = zestyMesh.material.clone();
                    }
                }
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
            } else if (entry[0] == GameObjectType.ZESTY_MARKET) {
                let zestyMeshes = entry[1].pp_getComponentsHierarchy("mesh");
                for (let zestyMesh of zestyMeshes) {
                    let zestyMeshName = zestyMesh.object.pp_getName();
                    if (zestyMeshName.includes("Frame")) {
                        zestyMesh.material = zestyMesh.material.clone();
                    }
                }
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
        PP.myEasyTuneVariables.add(new PP.EasyTuneBool("Prevent Vent Lost Only Clone", false));

        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particle Life", 0.15, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particles Duration", 0.5, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneNumber("Explosion Particles Delay", 0.05, 0.5, 3));
        PP.myEasyTuneVariables.add(new PP.EasyTuneInt("Explosion Particles Amount", 2, 10));

        PP.CAUtils.setDummyServer(new EIECADummyServer());
        PP.CAUtils.setUseDummyServerOnSDKMissing(true);
        PP.CAUtils.setUseDummyServerOnError(true);

        this.enoughISenough.start();

        if (this._myVRButton != null) {
            this._myVRButton.style.setProperty("display", "block");
        }

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
    },
    _updateVRButtonVisibility() {
        if (this._myVRButton != null) {
            if (!this._myVRButtonVisibilityUpdated) {
                this._myVRButton.style.setProperty("transform", "scale(1)");
                this._myVRButtonVisibilityUpdated = true;
            }

            if (!this._myVRButtonUsabilityUpdated) {
                if (WL.vrSupported != null && WL.vrSupported != 0) {
                    this._myVRButton.style.setProperty("opacity", "1");
                    this._myVRButton.style.setProperty("pointer-events", "all");

                    this._myVRButtonUsabilityUpdated = true;
                } else if (!this._myVRButtonDisabledOpacityUpdated) {
                    this._myVRButton.style.setProperty("opacity", "0.5");

                    this._myVRButtonDisabledOpacityUpdated = true;
                }
            }
        } else {
            this._myVRButtonUsabilityUpdated = true;
        }
    },
    _onXRSessionStart(session) {
        if (this._myXRButtonsContainer != null) {
            this._myXRButtonsContainer.style.setProperty("display", "none");
        }

        this._myDesiredFrameRate = null;
        this._mySetDesiredFrameRateMaxAttempts = 10;
        if (session.supportedFrameRates != null) {
            let desiredFrameRate = 72;

            let bestFrameRate = null;
            for (let supportedFrameRate of session.supportedFrameRates) {
                if (supportedFrameRate == desiredFrameRate) {
                    bestFrameRate = desiredFrameRate;
                    break;
                } else if (bestFrameRate == null) {
                    bestFrameRate = supportedFrameRate;
                } else if (supportedFrameRate > desiredFrameRate && (supportedFrameRate < bestFrameRate || bestFrameRate < desiredFrameRate)) {
                    bestFrameRate = supportedFrameRate;
                } else if (supportedFrameRate < desiredFrameRate && supportedFrameRate > bestFrameRate) {
                    bestFrameRate = supportedFrameRate;
                }
            }

            this._myDesiredFrameRate = bestFrameRate;
        }

        if (session.updateTargetFrameRate != null && this._myDesiredFrameRate != null) {
            try {
                session.updateTargetFrameRate(this._myDesiredFrameRate);
            } catch (error) {
                // Do nothing
            }
        }

        Global.myXRSessionActiveOpenLinkExtraCheck = true;
    },
    _onXRSessionEnd() {
        if (this._myXRButtonsContainer != null) {
            this._myXRButtonsContainer.style.removeProperty("display");
        }

        this._myDesiredFrameRate = null;

        Global.myXRSessionActiveOpenLinkExtraCheck = false;
    }
});

var Global = {
    myDeltaTimeSpeed: 1,
    myScene: null,
    myUpdateReady: false,
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
    myTitlePatchObject: null,
    myBigBlatherPatchObject: null,
    myMeshObjectPoolMap: null,
    myMeshNoFogObjectPoolMap: null,
    myGameObjectPoolMap: null,
    myAudioPoolMap: null,
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
    myStatisticsManager: null,
    myIsInMenu: false,
    myIsInArcadeResult: false,
    myEnableSelectPhysx: false,
    mySaveManager: null,
    myDebugCurrentVentObject: null,
    myPlayMusic: false,
    myStopMusic: false,
    myGameVersion: 0,
    myGoogleAnalytics: false,
    myUnmute: false,
    myXRSessionActiveOpenLinkExtraCheck: false,
    myIsUsingTrackedHands: false,
    myHasGrabbedTrackedHandsEventSent: false,
    myIsUsingTrackedHandsVentEventSent: false,
    myVentDurationWithTrackedHands: 0,
    myIntroDone: false,
    myAnalyticsEnabled: false,
    myIsLocalhost: false,
    myIsTrialPhase1: false,
    myMrNOTClonesNotDismissedPhase1PlayCount: 0,
    myTotalTimeUpdated: false,
    myActivatePhysXHandEventSent: false,
    myElementToClick: null,
    myElementToClickCounter: 0,
    myMusic: null,
    myLoadedSaveObjectParseFailed: false
};

Global.sendAnalytics = function sendAnalytics(eventType, eventName, eventValue) {
    try {
        if (Global.myAnalyticsEnabled) {
            if (window.gtag != null) {
                window.gtag(eventType, eventName, eventValue);
            }
        }
    } catch (error) {
        // Do nothing
    }
};