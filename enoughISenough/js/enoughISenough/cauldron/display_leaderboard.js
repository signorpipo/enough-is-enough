WL.registerComponent("display-leaderboard", {
    _myName: { type: WL.Type.String, default: '' },
    _myIsLocal: { type: WL.Type.Bool, default: false },
    _myNamesText: { type: WL.Type.Object },
    _myScoresText: { type: WL.Type.Object },
}, {
    init: function () {
    },
    start: function () {
        this._myNamesTextComponent = this._myNamesText.pp_getComponent("text");
        this._myScoresTextComponent = this._myScoresText.pp_getComponent("text");
    },
    update: function (dt) {
    },
    onActivate: function () {
        PP.CAUtils.getLeaderboard(this._myName, true, this._myIsLocal, 10, this._onLeaderboardRetrieved.bind(this));
    },
    _onLeaderboardRetrieved(leaderboard) {
        let namesText = "";
        let scoresText = "";

        let maxRankDigit = 0;
        for (let value of leaderboard) {
            let rank = value.rank + 1;
            if (rank.toFixed(0).length > maxRankDigit) {
                maxRankDigit = rank.toFixed(0).length;
            }
        }

        for (let value of leaderboard) {
            let rank = value.rank + 1;
            let fixedRank = rank.toFixed(0);
            while (fixedRank.length < maxRankDigit) {
                fixedRank = "0".concat(fixedRank);
            }

            namesText = namesText.concat(fixedRank, " - ", value.displayName, "\n\n");

            let convertedScore = this._convertTime(value.score);
            scoresText = scoresText.concat(convertedScore, "\n\n");
        }

        this._myNamesTextComponent.text = namesText;
        this._myScoresTextComponent.text = scoresText;
    },
    _convertTime(score) {
        let time = Math.floor(score / 1000);

        let hours = Math.floor(time / 3600);
        time -= hours * 3600;
        let minutes = Math.floor(time / 60);
        time -= minutes * 60;
        let seconds = Math.floor(time);


        let secondsText = (seconds.toFixed(0).length < 2) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0);
        let minutesText = (minutes.toFixed(0).length < 2) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0);
        let hoursText = (hours.toFixed(0).length < 2) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0);

        let convertedTime = hoursText.concat(":", minutesText, ":", secondsText);

        return convertedTime;
    }
});