class EIECADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount, callbackOnDone, callbackOnError) {
        let leaderboard = null;

        if (PP.CAUtils.isSDKAvailable()) {
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
        } else {
            if (isAroundPlayer) {
                leaderboard = [
                    { rank: 0, displayName: "Login", score: 0 },
                    { rank: 1, displayName: "And", score: 0 },
                    { rank: 2, displayName: "Play", score: 0 },
                    { rank: 3, displayName: "On", score: 0 },
                    { rank: 4, displayName: "Construct", score: 0 },
                    { rank: 5, displayName: "Arcade", score: 0 },
                    { rank: 6, displayName: "To", score: 0 },
                    { rank: 7, displayName: "Submit", score: 0 },
                    { rank: 8, displayName: "Your", score: 0 },
                    { rank: 9, displayName: "Score", score: 0 }
                ];
            } else {
                leaderboard = [
                    { rank: 0, displayName: "The", score: 0 },
                    { rank: 1, displayName: "Leaderboard", score: 0 },
                    { rank: 2, displayName: "Is", score: 0 },
                    { rank: 3, displayName: "Available", score: 0 },
                    { rank: 4, displayName: "Only", score: 0 },
                    { rank: 5, displayName: "When", score: 0 },
                    { rank: 6, displayName: "Playing", score: 0 },
                    { rank: 7, displayName: "On", score: 0 },
                    { rank: 8, displayName: "Construct", score: 0 },
                    { rank: 9, displayName: "Arcade", score: 0 }
                ];
            }
        }

        while (leaderboard.length > scoresAmount) {
            leaderboard.pop();
        }

        if (callbackOnDone) {
            callbackOnDone(leaderboard);
        }
    }

    submitScore(leaderboardID, scoreToSubmit, callbackOnDone, callbackOnError) {
        if (callbackOnDone) {
            callbackOnDone();
        }
    }

    getUser(callbackOnDone, callbackOnError) {
        let user = {};
        user.displayName = "mr NOT";

        if (callbackOnDone) {
            callbackOnDone(user);
        }
    }
}
