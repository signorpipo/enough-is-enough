
class ZeroWaveSetup {
    constructor() {
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new ZeroWave();
    }

    getAverageClonesCount(timeElapsed) {
        return 0;
    }
}

class ZeroWave {
    constructor() {
    }

    update(dt) {
        let cloneSetups = [];
        return cloneSetups;
    }

    getDuration() {
        return 0;
    }

    getActualClonesCount() {
        return 0;
    }

    getAverageClonesCount() {
        return 0;
    }

    isDone() {
        return true;
    }
}