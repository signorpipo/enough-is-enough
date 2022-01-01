class StatisticsManager {
    constructor() {

    }

    start() {
        Global.myStatistics = new Statistics();
        Global.myStatistics.load();

        WL.onXRSessionEnd.push(this._onXRSessionEnd.bind(this));

        this._myTimer = new PP.Timer(5);
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
}

class Statistics {

    constructor() {
        this.myTotalPlayTime = 0;
        this.myStoryPlayTime = 0;
        this.myStoryPlayCount = 0;
        this.myStoryCompletedCount = 0;
        this.myStoryBestTime = 0;
        this.myChatPlayTime = 0;
        this.myChatPlayCount = 0;
        this.myChatBestTime = 0;
        this.myDisputePlayTime = 0;
        this.myDisputePlayCount = 0;
        this.myDisputeBestTime = 0;
        this.myEvidencesThrown = 0;
        this.myMrNOTCloneDismissed = 0;
    }

    load() {
        this.myTotalPlayTime = PP.SaveUtils.loadNumber("total_play_time", 0);

        this.myStoryPlayTime = PP.SaveUtils.loadNumber("story_play_time", 0);
        this.myStoryPlayCount = PP.SaveUtils.loadNumber("story_play_count", 0);
        this.myStoryCompletedCount = PP.SaveUtils.loadNumber("story_completed_count", 0);
        this.myStoryBestTime = PP.SaveUtils.loadNumber("story_best_time", -1);

        this.myChatPlayTime = PP.SaveUtils.loadNumber("chat_play_time", 0);
        this.myChatPlayCount = PP.SaveUtils.loadNumber("chat_play_count", 0);
        this.myChatBestTime = PP.SaveUtils.loadNumber("chat_best_time", -1);

        this.myDisputePlayTime = PP.SaveUtils.loadNumber("dispute_play_time", 0);
        this.myDisputePlayCount = PP.SaveUtils.loadNumber("dispute_play_count", 0);
        this.myDisputeBestTime = PP.SaveUtils.loadNumber("dispute_best_time", -1);

        this.myEvidencesThrown = PP.SaveUtils.loadNumber("evidences_thrown", 0);
        this.myMrNOTCloneDismissed = PP.SaveUtils.loadNumber("mr_NOT_clone_dismissed", 0);
    }

    save() {
        if (this.myTotalPlayTime < this.myStoryPlayTime + this.myChatPlayTime + this.myDisputePlayTime) {
            this.myTotalPlayTime = this.myStoryPlayTime + this.myChatPlayTime + this.myDisputePlayTime;
        }

        PP.SaveUtils.save("total_play_time", this.myTotalPlayTime);

        PP.SaveUtils.save("story_play_time", this.myStoryPlayTime);
        PP.SaveUtils.save("story_play_count", this.myStoryPlayCount);
        PP.SaveUtils.save("story_completed_count", this.myStoryCompletedCount);
        PP.SaveUtils.save("story_best_time", this.myStoryBestTime);

        PP.SaveUtils.save("chat_play_time", this.myChatPlayTime);
        PP.SaveUtils.save("chat_play_count", this.myChatPlayCount);
        PP.SaveUtils.save("chat_best_time", this.myChatBestTime);

        PP.SaveUtils.save("dispute_play_time", this.myDisputePlayTime);
        PP.SaveUtils.save("dispute_play_count", this.myDisputePlayCount);
        PP.SaveUtils.save("dispute_best_time", this.myDisputeBestTime);

        PP.SaveUtils.save("evidences_thrown", this.myEvidencesThrown);
        PP.SaveUtils.save("mr_NOT_clone_dismissed", this.myMrNOTCloneDismissed);

    }
}