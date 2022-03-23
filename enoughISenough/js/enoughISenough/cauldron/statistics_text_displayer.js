WL.registerComponent("statistics-text-displayer", {
}, {
    init: function () {
    },
    start: function () {
        this._myText = this.object.pp_getComponent("text");
        this._myTextPosition = this._myText.object.pp_getPosition();
        this._myTempDirection1 = [];
        this._myTempDirection2 = [];

        this._myTimer = new PP.Timer(0.5);

        this._mySendAnalytics = true;
        this._myAnalyticsTimer = new PP.Timer(0);
        this._myUp = [0, 1, 0];
    },
    update: function (dt) {
        this._myAnalyticsTimer.update(dt);

        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            this._myTimer.start();
            this._updateStatistics();
        }

        this._checkStatisticsViewed(dt);
    },
    _updateStatistics() {
        let text = "";
        text = text.concat("Total Play Time: ", this._convertTimeToString(Global.myStatistics.myTotalPlayTime), "\n\n");
        text = text.concat("Trial Play Time: ", this._convertTimeToString(Global.myStatistics.myTrialPlayTime), "\n");
        text = text.concat("Trial Best Time: ", this._convertTimeToString(Global.myStatistics.myTrialBestTime), "\n");
        text = text.concat("Trial Played: ", Global.myStatistics.myTrialPlayCount, "\n");
        text = text.concat("Trial Completed: ", Global.myStatistics.myTrialCompletedCount, "\n\n");
        text = text.concat("Chat Play Time: ", this._convertTimeToString(Global.myStatistics.myChatPlayTime), "\n");
        text = text.concat("Chat Best Time: ", this._convertTimeToString(Global.myStatistics.myChatBestTime), "\n");
        text = text.concat("Chat Played: ", Global.myStatistics.myChatPlayCount, "\n\n");
        text = text.concat("Dispute Play Time: ", this._convertTimeToString(Global.myStatistics.myDisputePlayTime), "\n");
        text = text.concat("Dispute Best Time: ", this._convertTimeToString(Global.myStatistics.myDisputeBestTime), "\n");
        text = text.concat("Dispute Played: ", Global.myStatistics.myDisputePlayCount, "\n\n");
        text = text.concat("Evidences Thrown: ", Global.myStatistics.myEvidencesThrown, "\n");
        text = text.concat("mr NOT Clones Dismissed: ", Global.myStatistics.myMrNOTClonesDismissed, "\n");
        text = text.concat("mr NOT Dismissed: ", Global.myStatistics.myMrNOTDismissed, "\n");
        text = text.concat(" ");

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
    },
    _checkStatisticsViewed() {
        if (this._myAnalyticsTimer.isDone()) {
            if (this._mySendAnalytics) {
                let height = Global.myPlayerPosition[1];
                if (height < 0.9) {
                    let angle = Global.myPlayerForward.vec3_angle(this._myUp);
                    if (Math.abs(angle) < 80 && Math.abs(Global.myPlayerPosition[0]) < 0.7 && Math.abs(Global.myPlayerPosition[2]) < 0.7) {
                        this._myTextPosition.vec3_sub(Global.myPlayerPosition, this._myTempDirection1);
                        this._myTempDirection1.vec3_removeComponentAlongAxis(this._myUp, this._myTempDirection1);
                        Global.myPlayerForward.vec3_removeComponentAlongAxis(this._myUp, this._myTempDirection2);

                        let angleToText = Math.abs(this._myTempDirection1.vec3_angle(this._myTempDirection2));
                        if (angleToText < 70) {
                            if (Global.myGoogleAnalytics) {
                                gtag("event", "statistics_viewed", {
                                    "value": 1
                                });
                            }
                            this._mySendAnalytics = false;
                            this._myAnalyticsTimer.start(20);
                        }
                    }
                }
            } else {
                let height = Global.myPlayerPosition[1];
                if (height > 1.2) {
                    this._mySendAnalytics = true;
                }
            }
        }
    }
});