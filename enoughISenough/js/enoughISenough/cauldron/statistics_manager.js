class StatisticsManager {
    constructor() {

    }

    start() {
        Global.myStatistics = new Statistics();
        Global.myStatistics.load();

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myTimer = new PP.Timer(5);

        Global.mySaveManager.registerClearEventListener(this, this._onClear.bind(this));
    }

    update(dt) {
        this._myTimer.update(dt);
        if (this._myTimer.isDone()) {
            this._myTimer.start();
            Global.myStatistics.save();
        }
    }

    _onXRSessionEnd() {
        Global.myStatistics.save();
    }

    _onClear() {
        Global.myStatistics.load();
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
        this.myMrNOTCloneDismissed = 0;
        this.myMrNOTDismissed = 0;
    }

    load() {
        this.myTotalPlayTime = Global.mySaveManager.loadNumber("total_play_time", 0);

        this.myTrialPlayTime = Global.mySaveManager.loadNumber("trial_play_time", 0);
        this.myTrialPlayCount = Global.mySaveManager.loadNumber("trial_play_count", 0);
        this.myTrialCompletedCount = Global.mySaveManager.loadNumber("trial_completed_count", 0);
        this.myTrialBestTime = Global.mySaveManager.loadNumber("trial_best_time", -1);

        this.myChatPlayTime = Global.mySaveManager.loadNumber("chat_play_time", 0);
        this.myChatPlayCount = Global.mySaveManager.loadNumber("chat_play_count", 0);
        this.myChatBestTime = Global.mySaveManager.loadNumber("chat_best_time", -1);

        this.myDisputePlayTime = Global.mySaveManager.loadNumber("dispute_play_time", 0);
        this.myDisputePlayCount = Global.mySaveManager.loadNumber("dispute_play_count", 0);
        this.myDisputeBestTime = Global.mySaveManager.loadNumber("dispute_best_time", -1);

        this.myEvidencesThrown = Global.mySaveManager.loadNumber("evidences_thrown", 0);
        this.myMrNOTCloneDismissed = Global.mySaveManager.loadNumber("mr_NOT_clone_dismissed", 0);
        this.myMrNOTDismissed = Global.mySaveManager.loadNumber("mr_NOT_dismissed", 0);
    }

    save() {
        if (this.myTotalPlayTime < this.myTrialPlayTime + this.myChatPlayTime + this.myDisputePlayTime) {
            this.myTotalPlayTime = this.myTrialPlayTime + this.myChatPlayTime + this.myDisputePlayTime;
        }

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
        Global.mySaveManager.save("mr_NOT_clone_dismissed", this.myMrNOTCloneDismissed);
        Global.mySaveManager.save("mr_NOT_dismissed", this.myMrNOTDismissed);

    }
}