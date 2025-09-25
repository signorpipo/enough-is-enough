class EIECADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, ascending, aroundPlayer, scoresAmount, onDoneCallback = null, onErrorCallback = null, caError = PP.CAUtils.CAError.NONE) {
        let leaderboard = null;

        let firstAppName = "Construct";
        let secondAppName = "Arcade";
        if (PP.CAUtils.isViverse()) {
            firstAppName = "Viverse";
            secondAppName = "World";
        }

        if (caError != PP.CAUtils.CAError.CA_SDK_MISSING) {
            if (aroundPlayer && (caError == PP.CAUtils.CAError.USER_NOT_LOGGED_IN || caError == PP.CAUtils.CAError.USER_HAS_NO_SCORE)) {
                leaderboard = [
                    { rank: 0, displayName: "Login", score: 0 },
                    { rank: 1, displayName: "And", score: 0 },
                    { rank: 2, displayName: "Play", score: 0 },
                    { rank: 3, displayName: "On", score: 0 },
                    { rank: 4, displayName: firstAppName, score: 0 },
                    { rank: 5, displayName: secondAppName, score: 0 },
                    { rank: 6, displayName: "To", score: 0 },
                    { rank: 7, displayName: "Submit", score: 0 },
                    { rank: 8, displayName: "Your", score: 0 },
                    { rank: 9, displayName: "Score", score: 0 }
                ];
            } else {
                if (PP.CAUtils.isViverse() && caError == PP.CAUtils.CAError.USER_NOT_LOGGED_IN) {
                    leaderboard = [
                        { rank: 0, displayName: "Login", score: 0 },
                        { rank: 1, displayName: "And", score: 0 },
                        { rank: 2, displayName: "Play", score: 0 },
                        { rank: 3, displayName: "On", score: 0 },
                        { rank: 4, displayName: firstAppName, score: 0 },
                        { rank: 5, displayName: secondAppName, score: 0 },
                        { rank: 6, displayName: "To", score: 0 },
                        { rank: 7, displayName: "Submit", score: 0 },
                        { rank: 8, displayName: "Your", score: 0 },
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
            }
        } else {
            if (aroundPlayer) {
                leaderboard = [
                    { rank: 0, displayName: "Login", score: 0 },
                    { rank: 1, displayName: "And", score: 0 },
                    { rank: 2, displayName: "Play", score: 0 },
                    { rank: 3, displayName: "On", score: 0 },
                    { rank: 4, displayName: firstAppName, score: 0 },
                    { rank: 5, displayName: secondAppName, score: 0 },
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
                    { rank: 8, displayName: firstAppName, score: 0 },
                    { rank: 9, displayName: secondAppName, score: 0 }
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
        user.displayName = "mr NOT";

        if (onDoneCallback != null) {
            onDoneCallback(user);
        }
    }
}
