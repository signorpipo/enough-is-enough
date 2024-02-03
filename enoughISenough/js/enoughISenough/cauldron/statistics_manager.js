class StatisticsManager {
    constructor() {

    }

    start() {
        Global.myStatistics = new Statistics();
        Global.myStatistics.load();

        this._mySaveTimer = new PP.Timer(Math.pp_random(15, 25));
        this._myCommitOnEndTimer = new PP.Timer(0);

        Global.mySaveManager.registerClearEventListener(this, this._onClear.bind(this));

        window.addEventListener('visibilitychange', function () {
            try {
                if (document.visibilityState != "visible") {
                    this._onXRSessionInterrupt();
                }
            } catch (error) {
                // Do Nothing
            }
        }.bind(this));

        if (WL.xrSession) {
            this._onXRSessionStart(WL.xrSession);
        }
        WL.onXRSessionStart.push(this._onXRSessionStart.bind(this));
        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));
    }

    update(dt) {
        this._myCommitOnEndTimer.update(dt);
        this._mySaveTimer.update(dt);
        if (this._mySaveTimer.isDone()) {
            this.saveStatistics();
        }
    }

    saveStatistics() {
        Global.myStatistics.save();
        this._mySaveTimer.start(Math.pp_random(15, 25));
    }

    _onXRSessionStart(session) {
        session.addEventListener('visibilitychange', function (event) {
            if (event.session.visibilityState != "visible") {
                this._onXRSessionInterrupt();
            }
        }.bind(this));
    }

    _onXRSessionEnd() {
        this._onXRSessionInterrupt();
    }

    _onXRSessionInterrupt() {
        this.saveStatistics();
        Global.mySaveManager.commitSaves();

        if (this._myCommitOnEndTimer.isDone()) {
            this._myCommitOnEndTimer.start(Math.pp_random(15, 25));

            this._sendAnalytics();
        }
    }

    _onClear() {
        this._myCommitOnEndTimer.start(Math.pp_random(15, 25));
        this._sendAnalytics();
        Global.myStatistics.load();
    }

    _sendAnalytics() {
        Global.sendAnalytics("event", "play_seconds", {
            "value": (Global.myStatistics.myTotalPlayTime - Global.myStatistics.myTotalPlayTimeOnLoad).toFixed(2)
        });

        if ((Global.myStatistics.myEvidencesThrown - Global.myStatistics.myEvidencesThrownOnLoad) > 0) {
            Global.sendAnalytics("event", "evidences_thrown", {
                "value": (Global.myStatistics.myEvidencesThrown - Global.myStatistics.myEvidencesThrownOnLoad)
            });
        }

        if ((Global.myStatistics.myEvidencesMissed - Global.myStatistics.myEvidencesMissedOnLoad) > 0) {
            Global.sendAnalytics("event", "evidences_missed", {
                "value": (Global.myStatistics.myEvidencesMissed - Global.myStatistics.myEvidencesMissedOnLoad)
            });
        }

        if ((Global.myStatistics.myEvidencesPunched - Global.myStatistics.myEvidencesPunchedOnLoad) > 0) {
            Global.sendAnalytics("event", "evidences_punched", {
                "value": (Global.myStatistics.myEvidencesPunched - Global.myStatistics.myEvidencesPunchedOnLoad)
            });
        }

        if ((Global.myStatistics.myMrNOTDismissed - Global.myStatistics.myMrNOTDismissedOnLoad) > 0) {
            Global.sendAnalytics("event", "mr_NOT_dismissed", {
                "value": (Global.myStatistics.myMrNOTDismissed - Global.myStatistics.myMrNOTDismissedOnLoad)
            });
        }

        if ((Global.myStatistics.myMrNOTClonesDismissed - Global.myStatistics.myMrNOTClonesDismissedOnLoad) > 0) {
            Global.sendAnalytics("event", "mr_NOT_clones_dismissed", {
                "value": (Global.myStatistics.myMrNOTClonesDismissed - Global.myStatistics.myMrNOTClonesDismissedOnLoad)
            });
        }

        Global.myStatistics.syncOnLoadVariables();
    }
}

class Statistics {

    constructor() {
        this.myTotalPlayTime = 0;
        this.myTrialPlayTime = 0;
        this.myTrialPlayCount = 0;
        this.myTrialCompletedCount = 0;
        this.myTrialBestTime = 0;
        this.myChatPlayTime = 0;
        this.myChatPlayCount = 0;
        this.myChatBestTime = 0;
        this.myDisputePlayTime = 0;
        this.myDisputePlayCount = 0;
        this.myDisputeBestTime = 0;
        this.myEvidencesThrown = 0;
        this.myEvidencesMissed = 0;
        this.myEvidencesPunched = 0;
        this.myMrNOTClonesDismissed = 0;
        this.myMrNOTDismissed = 0;

        this.myTotalPlayTimeOnLoad = 0;
        this.myEvidencesThrownOnLoad = 0;
        this.myEvidencesMissedOnLoad = 0;
        this.myEvidencesPunchedOnLoad = 0;
        this.myMrNOTClonesDismissedOnLoad = 0;
        this.myMrNOTDismissedOnLoad = 0;
    }

    load() {
        this.myTotalPlayTime = Global.mySaveManager.load("total_play_time", 0);

        this.myTrialPlayTime = Global.mySaveManager.load("trial_play_time", 0);
        this.myTrialPlayCount = Global.mySaveManager.load("trial_play_count", 0);
        this.myTrialCompletedCount = Global.mySaveManager.load("trial_completed_count", 0);
        this.myTrialBestTime = Global.mySaveManager.load("trial_best_time", -1);

        this.myChatPlayTime = Global.mySaveManager.load("chat_play_time", 0);
        this.myChatPlayCount = Global.mySaveManager.load("chat_play_count", 0);
        this.myChatBestTime = Global.mySaveManager.load("chat_best_time", -1);

        this.myDisputePlayTime = Global.mySaveManager.load("dispute_play_time", 0);
        this.myDisputePlayCount = Global.mySaveManager.load("dispute_play_count", 0);
        this.myDisputeBestTime = Global.mySaveManager.load("dispute_best_time", -1);

        this.myEvidencesThrown = Global.mySaveManager.load("evidences_thrown", 0);
        this.myEvidencesMissed = Global.mySaveManager.load("evidences_missed", 0);
        this.myEvidencesPunched = Global.mySaveManager.load("evidences_punched", 0);
        this.myMrNOTClonesDismissed = Global.mySaveManager.load("mr_NOT_clones_dismissed", 0);
        this.myMrNOTDismissed = Global.mySaveManager.load("mr_NOT_dismissed", 0);

        this.syncOnLoadVariables();
    }

    syncOnLoadVariables() {
        this.myTotalPlayTimeOnLoad = this.myTotalPlayTime;
        this.myEvidencesThrownOnLoad = this.myEvidencesThrown;
        this.myEvidencesMissedOnLoad = this.myEvidencesMissed;
        this.myEvidencesPunchedOnLoad = this.myEvidencesPunched;
        this.myMrNOTClonesDismissedOnLoad = this.myMrNOTClonesDismissed;
        this.myMrNOTDismissedOnLoad = this.myMrNOTDismissed;
    }

    save() {
        Global.mySaveManager.save("total_play_time", this.myTotalPlayTime);

        Global.mySaveManager.save("trial_play_time", this.myTrialPlayTime);
        Global.mySaveManager.save("trial_play_count", this.myTrialPlayCount);
        Global.mySaveManager.save("trial_completed_count", this.myTrialCompletedCount);
        Global.mySaveManager.save("trial_best_time", this.myTrialBestTime);

        Global.mySaveManager.save("chat_play_time", this.myChatPlayTime);
        Global.mySaveManager.save("chat_play_count", this.myChatPlayCount);
        Global.mySaveManager.save("chat_best_time", this.myChatBestTime);

        Global.mySaveManager.save("dispute_play_time", this.myDisputePlayTime);
        Global.mySaveManager.save("dispute_play_count", this.myDisputePlayCount);
        Global.mySaveManager.save("dispute_best_time", this.myDisputeBestTime);

        Global.mySaveManager.save("evidences_thrown", this.myEvidencesThrown);
        Global.mySaveManager.save("evidences_missed", this.myEvidencesMissed);
        Global.mySaveManager.save("evidences_punched", this.myEvidencesPunched);
        Global.mySaveManager.save("mr_NOT_clones_dismissed", this.myMrNOTClonesDismissed);
        Global.mySaveManager.save("mr_NOT_dismissed", this.myMrNOTDismissed);
    }
}