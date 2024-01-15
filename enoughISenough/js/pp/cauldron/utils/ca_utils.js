PP.CAUtils = {
    _myDummyServer: null,
    _myUseDummyServerOnSDKMissing: false,
    _myUseDummyServerOnError: false,
    setUseDummyServerOnSDKMissing: function (useDummyServer) {
        PP.CAUtils._myUseDummyServerOnSDKMissing = useDummyServer;
    },
    setUseDummyServerOnError: function (useDummyServer) {
        PP.CAUtils._myUseDummyServerOnError = useDummyServer;
    },
    setDummyServer: function (dummyServer) {
        PP.CAUtils._myDummyServer = dummyServer;
    },
    isUseDummyServerOnSDKMissing: function () {
        return PP.CAUtils._myUseDummyServerOnSDKMissing;
    },
    isUseDummyServerOnError: function () {
        return PP.CAUtils._myUseDummyServerOnError;
    },
    getDummyServer: function () {
        return PP.CAUtils._myDummyServer;
    },
    isSDKAvailable: function () {
        return window.heyVR != null;
    },
    getSDK: function () {
        return window.heyVR;
    },
    getLeaderboard: function (leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
        if (PP.CAUtils.isSDKAvailable()) {
            try {
                PP.CAUtils._getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount).then(function (result) {
                    if (result.leaderboard != null) {
                        if (!aroundPlayer) {
                            if (onDoneCallback != null) {
                                onDoneCallback(result.leaderboard);
                            }
                        } else {
                            let userLeaderboard = result.leaderboard;
                            PP.CAUtils.getUser(
                                function (user) {
                                    let userName = user.displayName;
                                    let userValid = false;
                                    for (let userLeaderboardEntry of userLeaderboard) {
                                        if (userLeaderboardEntry.displayName == userName) {
                                            userValid = true;
                                            break;
                                        }
                                    }
                                    if (userValid) {
                                        if (onDoneCallback != null) {
                                            onDoneCallback(userLeaderboard);
                                        }
                                    } else {
                                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                            PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.USER_HAS_NO_SCORE);
                                        } else if (onErrorCallback != null) {
                                            let error = {};
                                            error.reason = "Searching for around player but the user has not submitted a score yet";
                                            error.type = PP.CAUtils.CAError.USER_HAS_NO_SCORE;
                                            onErrorCallback(error, null);
                                        }
                                    }
                                },
                                function (error, result) {
                                    if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                                        (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                        PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, error.type);
                                    } else if (onErrorCallback != null) {
                                        onErrorCallback(error, result);
                                    }
                                },
                                false);
                        }
                    } else {
                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_LEADERBOARD_FAILED);
                        } else if (onErrorCallback != null) {
                            let error = {};
                            error.reason = "Get leaderboard failed";
                            error.type = PP.CAUtils.CAError.GET_LEADERBOARD_FAILED;
                            onErrorCallback(error, result);
                        }
                    }
                }).catch(function (result) {
                    if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                        (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_LEADERBOARD_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Get leaderboard failed";
                        error.type = PP.CAUtils.CAError.GET_LEADERBOARD_FAILED;
                        onErrorCallback(error, result);
                    }
                });
            } catch (error) {
                if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                    (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_LEADERBOARD_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Get leaderboard failed";
                    error.type = PP.CAUtils.CAError.GET_LEADERBOARD_FAILED;
                    onErrorCallback(error, null);
                }
            }
        } else {
            if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                (PP.CAUtils._myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.CA_SDK_MISSING);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Construct Arcade SDK missing";
                error.type = PP.CAUtils.CAError.CA_SDK_MISSING;
                onErrorCallback(error, null);
            }
        }
    },
    getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        if (PP.CAUtils._myDummyServer) {
            PP.CAUtils._myDummyServer.getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, caError);
        } else {
            if (onErrorCallback != null) {
                let error = {};
                error.reason = "Dummy server not initialized";
                error.type = PP.CAUtils.CAError.DUMMY_NOT_INITIALIZED;
                onErrorCallback(error, null);
            }
        }
    },
    submitScore(leaderboardID, scoreToSubmit, onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
        if (PP.CAUtils.isSDKAvailable()) {
            try {
                PP.CAUtils._submitScore(leaderboardID, scoreToSubmit).then(function (result) {
                    if (result.scoreSubmitted) {
                        if (onDoneCallback != null) {
                            onDoneCallback();
                        }
                    } else if (result.scoreSubmitted != null) {
                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.submitScore != null &&
                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            PP.CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.USER_NOT_LOGGED_IN);
                        } else if (onErrorCallback != null) {
                            let error = {};
                            error.reason = "The score can't be submitted because the user is not logged in";
                            error.type = PP.CAUtils.CAError.USER_NOT_LOGGED_IN;
                            onErrorCallback(error, result);
                        }
                    } else {
                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.submitScore != null &&
                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            PP.CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.SUBMIT_SCORE_FAILED);
                        } else if (onErrorCallback != null) {
                            let error = {};
                            error.reason = "Submit score failed";
                            error.type = PP.CAUtils.CAError.SUBMIT_SCORE_FAILED;
                            onErrorCallback(error, result);
                        }
                    }
                }).catch(function (result) {
                    if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.submitScore != null &&
                        (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        PP.CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.SUBMIT_SCORE_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Submit score failed";
                        error.type = PP.CAUtils.CAError.SUBMIT_SCORE_FAILED;
                        onErrorCallback(error, result);
                    }
                });
            } catch (error) {
                if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.submitScore != null &&
                    (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    PP.CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.SUBMIT_SCORE_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Submit score failed";
                    error.type = PP.CAUtils.CAError.SUBMIT_SCORE_FAILED;
                    onErrorCallback(error, null);
                }
            }
        } else {
            if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.submitScore != null &&
                (PP.CAUtils._myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                PP.CAUtils.submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.CA_SDK_MISSING);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Construct Arcade SDK missing";
                error.type = PP.CAUtils.CAError.CA_SDK_MISSING;
                onErrorCallback(error, null);
            }
        }
    },
    submitScoreDummy(leaderboardID, scoreToSubmit, onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        if (PP.CAUtils._myDummyServer) {
            PP.CAUtils._myDummyServer.submitScore(leaderboardID, scoreToSubmit, onDoneCallback, onErrorCallback, caError);
        } else {
            if (onErrorCallback != null) {
                let error = {};
                error.reason = "Dummy server not initialized";
                error.type = PP.CAUtils.CAError.DUMMY_NOT_INITIALIZED;
                onErrorCallback(error, null);
            }
        }
    },
    getUser(onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
        if (PP.CAUtils.isSDKAvailable()) {
            try {
                PP.CAUtils._getUser().then(function (result) {
                    if (result.user != null && result.user.displayName != null) {
                        if (onDoneCallback != null) {
                            onDoneCallback(result.user);
                        }
                    } else if (result.user != null) {
                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getUser != null &&
                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            PP.CAUtils.getUserDummy(onDoneCallback, onErrorCallback, PP.CAUtils.CAError.USER_NOT_LOGGED_IN);
                        } else if (onErrorCallback != null) {
                            let error = {};
                            error.reason = "User not logged in";
                            error.type = PP.CAUtils.CAError.USER_NOT_LOGGED_IN;
                            onErrorCallback(error, result);
                        }
                    } else {
                        if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getUser != null &&
                            (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                            PP.CAUtils.getUserDummy(onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_USER_FAILED);
                        } else if (onErrorCallback != null) {
                            let error = {};
                            error.reason = "Get user failed";
                            error.type = PP.CAUtils.CAError.GET_USER_FAILED;
                            onErrorCallback(error, result);
                        }
                    }
                }).catch(function (result) {
                    if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getUser != null &&
                        (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                        PP.CAUtils.getUserDummy(onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_USER_FAILED);
                    } else if (onErrorCallback != null) {
                        let error = {};
                        error.reason = "Get user failed";
                        error.type = PP.CAUtils.CAError.GET_USER_FAILED;
                        onErrorCallback(error, result);
                    }
                });
            } catch (error) {
                if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getUser != null &&
                    (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                    PP.CAUtils.getUserDummy(onDoneCallback, onErrorCallback, PP.CAUtils.CAError.GET_USER_FAILED);
                } else if (onErrorCallback != null) {
                    let error = {};
                    error.reason = "Get user failed";
                    error.type = PP.CAUtils.CAError.GET_USER_FAILED;
                    onErrorCallback(error, null);
                }
            }
        } else {
            if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getUser != null &&
                (PP.CAUtils._myUseDummyServerOnSDKMissing && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                PP.CAUtils.getUserDummy(onDoneCallback, onErrorCallback, PP.CAUtils.CAError.CA_SDK_MISSING);
            } else if (onErrorCallback != null) {
                let error = {};
                error.reason = "Construct Arcade SDK missing";
                error.type = PP.CAUtils.CAError.CA_SDK_MISSING;
                onErrorCallback(error, null);
            }
        }
    },
    getUserDummy(onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        if (PP.CAUtils._myDummyServer) {
            PP.CAUtils._myDummyServer.getUser(onDoneCallback, onErrorCallback, caError);
        } else {
            if (onErrorCallback != null) {
                let error = {};
                error.reason = "Dummy server not initialized";
                error.type = PP.CAUtils.CAError.DUMMY_NOT_INITIALIZED;
                onErrorCallback(error, null);
            }
        }
    },
    _getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount) {
        let heyVR = PP.CAUtils.getSDK();

        if (aroundPlayer) {
            return heyVR.leaderboard.getMy(leaderboardID, scoresAmount).then(function (result) {
                let adjustedLeaderboard = [];
                for (let leaderboardEntry of result) {
                    adjustedLeaderboard.push({ rank: leaderboardEntry.rank - 1, displayName: leaderboardEntry.user, score: leaderboardEntry.score });
                }
                return { leaderboard: adjustedLeaderboard };
            }).catch(function (error) {
                if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                    return { leaderboard: [] };
                } else {
                    return { leaderboard: null };
                }
            });
        } else {
            return heyVR.leaderboard.get(leaderboardID, scoresAmount).then(function (result) {
                let adjustedLeaderboard = [];
                for (let leaderboardEntry of result) {
                    adjustedLeaderboard.push({ rank: leaderboardEntry.rank - 1, displayName: leaderboardEntry.user, score: leaderboardEntry.score });
                }
                return { leaderboard: adjustedLeaderboard };
            }).catch(function () {
                return { leaderboard: null };
            });
        }
    },
    _submitScore(leaderboardID, scoreToSubmit) {
        let heyVR = PP.CAUtils.getSDK();
        return heyVR.leaderboard.postScore(leaderboardID, scoreToSubmit).then(function () {
            return { scoreSubmitted: true };
        }).catch(function (error) {
            if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                return { scoreSubmitted: false };
            } else {
                return { scoreSubmitted: null };
            }
        });
    },
    _getUser() {
        let heyVR = PP.CAUtils.getSDK();
        return heyVR.user.getName().then(result => {
            return { user: { displayName: result } };
        }).catch(function (error) {
            if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                return { user: { displayName: null } };
            } else {
                return { user: null };
            }
        });
    },
    CAError: {
        NONE: 0,
        CA_SDK_MISSING: 1,
        DUMMY_NOT_INITIALIZED: 2,
        GET_LEADERBOARD_FAILED: 3,
        SUBMIT_SCORE_FAILED: 4,
        GET_USER_FAILED: 5,
        USER_NOT_LOGGED_IN: 6,
        USER_HAS_NO_SCORE: 7
    }
};

PP.CADummyServer = class CADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        let leaderboard = null;

        if (caError != PP.CAUtils.CAError.CA_SDK_MISSING) {
            if (aroundPlayer && (caError == PP.CAUtils.CAError.USER_NOT_LOGGED_IN || caError == PP.CAUtils.CAError.USER_HAS_NO_SCORE)) {
                leaderboard = [
                    { rank: 0, displayName: "Sign In", score: 0 },
                    { rank: 1, displayName: "And", score: 0 },
                    { rank: 2, displayName: "Play", score: 0 },
                    { rank: 3, displayName: "On", score: 0 },
                    { rank: 4, displayName: "HeyVR", score: 0 },
                    { rank: 5, displayName: "To", score: 0 },
                    { rank: 6, displayName: "Submit", score: 0 },
                    { rank: 7, displayName: "Your", score: 0 },
                    { rank: 8, displayName: "Own", score: 0 },
                    { rank: 9, displayName: "Score", score: 0 }
                ];
            } else {
                leaderboard = [
                    { rank: 0, displayName: "An", score: 0 },
                    { rank: 1, displayName: "Error", score: 0 },
                    { rank: 2, displayName: "Has", score: 0 },
                    { rank: 3, displayName: "Occurred", score: 0 },
                    { rank: 4, displayName: "While", score: 0 },
                    { rank: 5, displayName: "Trying", score: 0 },
                    { rank: 6, displayName: "To", score: 0 },
                    { rank: 7, displayName: "Retrieve", score: 0 },
                    { rank: 8, displayName: "The", score: 0 },
                    { rank: 9, displayName: "Leaderboard", score: 0 }
                ];
            }
        } else {
            if (aroundPlayer) {
                leaderboard = [
                    { rank: 0, displayName: "Sign In", score: 0 },
                    { rank: 1, displayName: "And", score: 0 },
                    { rank: 2, displayName: "Play", score: 0 },
                    { rank: 3, displayName: "On", score: 0 },
                    { rank: 4, displayName: "HeyVR", score: 0 },
                    { rank: 5, displayName: "To", score: 0 },
                    { rank: 6, displayName: "Submit", score: 0 },
                    { rank: 7, displayName: "Your", score: 0 },
                    { rank: 8, displayName: "Own", score: 0 },
                    { rank: 9, displayName: "Score", score: 0 }
                ];
            } else {
                leaderboard = [
                    { rank: 0, displayName: "The", score: 0 },
                    { rank: 1, displayName: "Top 10", score: 0 },
                    { rank: 2, displayName: "Leaderboard", score: 0 },
                    { rank: 3, displayName: "Is", score: 0 },
                    { rank: 4, displayName: "Available", score: 0 },
                    { rank: 5, displayName: "Only", score: 0 },
                    { rank: 5, displayName: "When", score: 0 },
                    { rank: 7, displayName: "Playing", score: 0 },
                    { rank: 8, displayName: "On", score: 0 },
                    { rank: 9, displayName: "HeyVR", score: 0 },
                ];
            }
        }

        while (leaderboard.length > scoresAmount) {
            leaderboard.pop();
        }

        if (onDoneCallback != null) {
            onDoneCallback(leaderboard);
        }
    }

    submitScore(leaderboardID, scoreToSubmit, onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        if (onDoneCallback != null) {
            onDoneCallback();
        }
    }

    getUser(onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        let user = {};
        user.displayName = "Jonathan";

        if (onDoneCallback != null) {
            onDoneCallback(user);
        }
    }
};