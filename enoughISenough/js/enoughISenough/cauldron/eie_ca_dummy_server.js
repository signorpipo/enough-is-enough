class EIECADummyServer {

    constructor() {
    }

    getLeaderboard(leaderboardID, isAscending, isAroundPlayer, scoresAmount) {
        let leaderboard = null;

        leaderboard = [
            { rank: 1, displayName: "Pipo", score: 0 },
            { rank: 2, displayName: "Srile", score: 0 },
            { rank: 3, displayName: "Jonathan", score: 0 },
            { rank: 4, displayName: "Yinch", score: 0 },
            { rank: 5, displayName: "Wondermelon", score: 0 },
            { rank: 6, displayName: "Zesty Market", score: 0 },
            { rank: 7, displayName: "Sorskoot", score: 0 },
            { rank: 8, displayName: "Wonderland", score: 0 },
            { rank: 9, displayName: "mr NOT", score: 0 }
        ];

        while (leaderboard.length > scoresAmount) {
            leaderboard.pop();
        }

        return leaderboard;
    }

    submitScore(leaderboardID, scoreToSubmit) {
    }
};
