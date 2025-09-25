PP.CAUtils = {
    _myDummyServer: null,
    _myUseDummyServerOnSDKMissing: false,
    _myUseDummyServerOnError: false,
    _myLeaderboardSDKReady: false,
    _myViverseAppID: "kyb8susx6r",
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
        return window.heyVR != null || window.viverseClient != null;
    },
    initializeSDK: async function () {
        if (window.viverse != null) {
            window.viverseClient = new window.viverse.client({
                clientId: PP.CAUtils._myViverseAppID,
                domain: "account.htcvive.com",
            });

            const accessToken = await window.viverseClient.getToken();

            if (accessToken != null) {
                window.viverseLeaderboard = new window.viverse.gameDashboard({
                    baseURL: 'https://www.viveport.com/',
                    communityBaseURL: 'https://www.viverse.com/',
                    token: accessToken
                });
            } else {
                window.viverseLeaderboard = null;
            }
        }

        PP.CAUtils._myLeaderboardSDKReady = true;
    },
    isLeaderboardSDKReady: function () {
        return PP.CAUtils.isSDKAvailable() && PP.CAUtils._myLeaderboardSDKReady;
    },
    isHeyVR: function () {
        return window.heyVR != null;
    },
    isViverse: function () {
        return window.viverseClient != null;
    },
    getSDK: function () {
        if (PP.CAUtils.isHeyVR()) {
            return window.heyVR;
        } else if (PP.CAUtils.isViverse()) {
            return window.viverseClient;
        }

        return null;
    },
    getLeaderboardSDK: function () {
        if (PP.CAUtils.isHeyVR()) {
            return window.heyVR.leaderboard;
        } else if (PP.CAUtils.isViverse()) {
            return window.viverseLeaderboard;
        }

        return null;
    },
    getLeaderboard: function (leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, useDummyServerOverride = null) {
        if (PP.CAUtils.isLeaderboardSDKReady()) {
            try {
                PP.CAUtils._getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount).then(function (result) {
                    if (result.leaderboard != null) {
                        if (!aroundPlayer) {
                            if (PP.CAUtils.isViverse() && result.leaderboard == PP.CAUtils.CAError.USER_NOT_LOGGED_IN) {
                                if (PP.CAUtils._myDummyServer != null && PP.CAUtils._myDummyServer.getLeaderboard != null &&
                                    (PP.CAUtils._myUseDummyServerOnError && useDummyServerOverride == null) || (useDummyServerOverride != null && useDummyServerOverride)) {
                                    PP.CAUtils.getLeaderboardDummy(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback, onErrorCallback, PP.CAUtils.CAError.USER_NOT_LOGGED_IN);
                                } else if (onErrorCallback != null) {
                                    let error = {};
                                    error.reason = "User not logged in";
                                    error.type = PP.CAUtils.CAError.USER_NOT_LOGGED_IN;
                                    onErrorCallback(error, null);
                                }
                            } else if (onDoneCallback != null) {
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
                                        if (PP.CAUtils.isViverse() && userLeaderboard.length > scoresAmount) {
                                            let userIndex = userLeaderboard.findIndex(entry => entry.displayName === userName);

                                            const half = Math.ceil(scoresAmount / 2);
                                            let start = userIndex - (half - 1);
                                            let end = userIndex + half + (scoresAmount % 2 === 0 ? 0 : -1);

                                            if (start < 0) {
                                                end += -start;
                                                start = 0;
                                            }

                                            if (end >= userLeaderboard.length) {
                                                start -= (end - userLeaderboard.length + 1);
                                                end = userLeaderboard.length - 1;
                                            }

                                            if (start < 0) start = 0;

                                            userLeaderboard = userLeaderboard.slice(start, end + 1);
                                        }

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
        if (PP.CAUtils.isLeaderboardSDKReady()) {
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
        if (PP.CAUtils.isHeyVR()) {
            let leaderboardSDK = PP.CAUtils.getLeaderboardSDK();

            if (aroundPlayer) {
                return leaderboardSDK.getMy(leaderboardID, scoresAmount).then(function (result) {
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
                return leaderboardSDK.get(leaderboardID, scoresAmount).then(function (result) {
                    let adjustedLeaderboard = [];
                    for (let leaderboardEntry of result) {
                        adjustedLeaderboard.push({ rank: leaderboardEntry.rank - 1, displayName: leaderboardEntry.user, score: leaderboardEntry.score });
                    }
                    return { leaderboard: adjustedLeaderboard };
                }).catch(function () {
                    return { leaderboard: null };
                });
            }
        } else if (PP.CAUtils.isViverse()) {
            let leaderboardSDK = PP.CAUtils.getLeaderboardSDK();

            if (leaderboardSDK != null) {
                let leaderboardConfig = {
                    name: leaderboardID,
                    range_start: 0,
                    range_end: scoresAmount,
                    region: "global",
                    time_range: "alltime",
                    around_user: aroundPlayer
                };

                if (aroundPlayer) {
                    leaderboardConfig = {
                        name: leaderboardID,
                        range_start: scoresAmount,
                        range_end: scoresAmount,
                        region: "global",
                        time_range: "alltime",
                        around_user: aroundPlayer
                    };
                }

                leaderboardSDK.getLeaderboard(PP.CAUtils._myViverseAppID, leaderboardConfig).then(function (leaderboard) {
                    if (!aroundPlayer) {
                        leaderboard.ranking.length = Math.min(leaderboard.ranking.length, scoresAmount);
                    }

                    let adjustedLeaderboard = [];
                    for (let leaderboardEntry of leaderboard.ranking) {
                        adjustedLeaderboard.push({ rank: leaderboardEntry.rank, displayName: leaderboardEntry.name, score: leaderboardEntry.value });
                    }
                    return { leaderboard: adjustedLeaderboard };
                }).catch(function () {
                    return { leaderboard: null };
                });
            } else {
                if (aroundPlayer) {
                    return Promise.resolve({ leaderboard: [] });
                } else {
                    return Promise.resolve({ leaderboard: PP.CAUtils.CAError.USER_NOT_LOGGED_IN });
                }
            }
        }
    },
    _submitScore(leaderboardID, scoreToSubmit) {
        if (PP.CAUtils.isHeyVR()) {
            let leaderboardSDK = PP.CAUtils.getLeaderboardSDK();
            return leaderboardSDK.postScore(leaderboardID, scoreToSubmit).then(function () {
                return { scoreSubmitted: true };
            }).catch(function (error) {
                if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                    return { scoreSubmitted: false };
                } else {
                    return { scoreSubmitted: null };
                }
            });
        } else if (PP.CAUtils.isViverse()) {
            let leaderboardSDK = PP.CAUtils.getLeaderboardSDK();
            if (leaderboardSDK != null) {
                return leaderboardSDK.uploadLeaderboardScore(PP.CAUtils._myViverseAppID, { name: leaderboardID, value: scoreToSubmit }).then(function () {
                    return { scoreSubmitted: true };
                }).catch(function (error) {
                    return { scoreSubmitted: null };
                });
            } else {
                return Promise.resolve({ scoreSubmitted: false });
            }
        }
    },
    _getUser() {
        if (PP.CAUtils.isHeyVR()) {
            let sdk = PP.CAUtils.getSDK();
            return sdk.user.getName().then(result => {
                return { user: { displayName: result } };
            }).catch(function (error) {
                if (error != null && error.status != null && error.status.debug == "err_unauthenticated") {
                    return { user: { displayName: null } };
                } else {
                    return { user: null };
                }
            });
        } else if (PP.CAUtils.isViverse()) {
            let sdk = PP.CAUtils.getSDK();
            if (sdk != null) {
                return sdk.checkAuth().then(result => {
                    if (result == null) {
                        return { user: { displayName: result.account_id } };
                    }

                    return { user: { displayName: result } };
                }).catch(function (error) {
                    return { user: null };
                });
            } else {
                return Promise.resolve({ user: null });
            }
        }
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