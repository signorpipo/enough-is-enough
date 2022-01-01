WL.registerComponent("statistics-text-displayer", {
}, {
    init: function () {
    },
    start: function () {
        this._myText = this.object.pp_getComponent("text");
        this._myTimer = new PP.Timer(0.5);
    },
    update: function (dt) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            this._myTimer.start();
            this._updateStatistics();
        }
    },
    _updateStatistics() {
        let text = "";
        text = text.concat("Total Play Time: ", this._convertTimeToString(Global.myStatistics.myTotalPlayTime), "\n\n");
        text = text.concat("Trial Play Time: ", this._convertTimeToString(Global.myStatistics.myTrialPlayTime), "\n");
        text = text.concat("Trial Best Time: ", this._convertTimeToString(Global.myStatistics.myTrialBestTime), "\n");
        text = text.concat("Trial Play Count: ", Global.myStatistics.myTrialPlayCount, "\n");
        text = text.concat("Trial Completed Count: ", Global.myStatistics.myTrialCompletedCount, "\n\n");
        text = text.concat("Chat Play Time: ", this._convertTimeToString(Global.myStatistics.myChatPlayTime), "\n");
        text = text.concat("Chat Best Time: ", this._convertTimeToString(Global.myStatistics.myChatBestTime), "\n");
        text = text.concat("Chat Play Count: ", Global.myStatistics.myChatPlayCount, "\n\n");
        text = text.concat("Dispute Play Time: ", this._convertTimeToString(Global.myStatistics.myDisputePlayTime), "\n");
        text = text.concat("Dispute Best Time: ", this._convertTimeToString(Global.myStatistics.myDisputeBestTime), "\n");
        text = text.concat("Dispute Play Count: ", Global.myStatistics.myDisputePlayCount, "\n\n");
        text = text.concat("Evidences Thrown: ", Global.myStatistics.myEvidencesThrown, "\n");
        text = text.concat("mr NOT Clone Dismissed: ", Global.myStatistics.myMrNOTCloneDismissed);

        this._myText.text = text;
    },
    _convertTimeToString(time) {
        if (time < 0) {
            return "-";
        }

        time = Math.floor(time);

        let hours = Math.floor(time / 3600);
        time -= hours * 3600;
        let minutes = Math.floor(time / 60);
        time -= minutes * 60;
        let seconds = Math.floor(time);

        let string = "";
        string = string.concat((hours.toFixed(0).length < 2) ? "0".concat(hours.toFixed(0)) : hours.toFixed(0), ":");
        string = string.concat((minutes.toFixed(0).length < 2) ? "0".concat(minutes.toFixed(0)) : minutes.toFixed(0), ":");
        string = string.concat((seconds.toFixed(0).length < 2) ? "0".concat(seconds.toFixed(0)) : seconds.toFixed(0));

        return string;
    }
});