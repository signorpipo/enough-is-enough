PP.CAUtils = {
    _myDummyServer: null,
    setDummyServer: function (dummyServer) {
        PP.CAUtils._myDummyServer = dummyServer;
    },
    getLeaderboard: function (leaderboardID, isAscending, isAroundPlayer, scoresAmount, callbackOnDone) {
        if ("casdk" in window) {
            casdk.getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount).then(function (result) {
                callbackOnDone(result.leaderboard);
            });
        } else if (PP.CAUtils._myDummyServer) {
            let leaderboard = PP.CAUtils._myDummyServer.getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount);
            if (callbackOnDone) {
                callbackOnDone(leaderboard);
            }
        }
    },
    submitScore: function (leaderboardID, scoreToSubmit, callbackOnDone) {
        if ("casdk" in window) {
            casdk.submitScore(leaderboardID, scoreToSubmit).then(function () {
                callbackOnDone();
            });
        } else if (PP.CAUtils._myDummyServer) {
            PP.CAUtils._myDummyServer.submitScore(leaderboardID, scoreToSubmit);
            if (callbackOnDone) {
                callbackOnDone();
            }
        }
    },
};

PP.CADummyServer = class CADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount) {
        let leaderboard = null;

        if (isAroundPlayer) {
            leaderboard = [{ rank: 7, displayName: "Player 1", score: 1000000 },
            { rank: 8, displayName: "Player 2", score: 1000000 },
            { rank: 9, displayName: "Player 3", score: 900000 },
            { rank: 10, displayName: "Player 4", score: 800000 },
            { rank: 11114, displayName: "VeryLongName_05", score: 70000000 },
            { rank: 1111, displayName: "Player 6", score: 600000 },
            { rank: 2222, displayName: "Player 7", score: 500000 },
            { rank: 3333, displayName: "Player 8", score: 400000 },
            { rank: 444, displayName: "Player 9", score: 300000 },
            { rank: 66666, displayName: "Player 10", score: 200000 },
            { rank: 66644, displayName: "Player 11", score: 100000 }];
        } else {
            leaderboard = [{ rank: 0, displayName: "Player 1", score: 1000000 },
            { rank: 1, displayName: "Player 2", score: 1000000 },
            { rank: 2, displayName: "Player 3", score: 900000 },
            { rank: 3, displayName: "Player 4", score: 800000 },
            { rank: 4, displayName: "Player 5", score: 700000 },
            { rank: 5, displayName: "Player 6", score: 600000 },
            { rank: 6, displayName: "Player 7", score: 500000 },
            { rank: 7, displayName: "Player 8", score: 400000 },
            { rank: 8, displayName: "Player 9", score: 300000 },
            { rank: 9, displayName: "Player 10", score: 200000 },
            { rank: 10, displayName: "Player 11", score: 100000 }];
        }

        while (leaderboard.length > scoresAmount) {
            leaderboard.pop();
        }

        return leaderboard;
    }

    submitScore(leaderboardID, scoreToSubmit) {
    }
};