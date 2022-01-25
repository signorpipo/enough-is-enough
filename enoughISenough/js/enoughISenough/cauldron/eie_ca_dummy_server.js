class EIECADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount, callbackOnDone, callbackOnError) {
        let leaderboard = null;

        if (isAroundPlayer) {
            leaderboard = [
                { rank: 1, displayName: "Login", score: 0 },
                { rank: 2, displayName: "And", score: 0 },
                { rank: 3, displayName: "Play", score: 0 },
                { rank: 4, displayName: "On", score: 0 },
                { rank: 5, displayName: "Construct", score: 0 },
                { rank: 6, displayName: "Arcade", score: 0 },
                { rank: 7, displayName: "To", score: 0 },
                { rank: 8, displayName: "Submit", score: 0 },
                { rank: 9, displayName: "Your", score: 0 },
                { rank: 10, displayName: "Score", score: 0 }
            ];
        } else {
            leaderboard = [
                { rank: 1, displayName: "The", score: 0 },
                { rank: 2, displayName: "Leaderboard", score: 0 },
                { rank: 3, displayName: "Is", score: 0 },
                { rank: 4, displayName: "Available", score: 0 },
                { rank: 5, displayName: "Only", score: 0 },
                { rank: 6, displayName: "When", score: 0 },
                { rank: 7, displayName: "Playing", score: 0 },
                { rank: 8, displayName: "On", score: 0 },
                { rank: 9, displayName: "Construct", score: 0 },
                { rank: 10, displayName: "Arcade", score: 0 }
            ];
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
