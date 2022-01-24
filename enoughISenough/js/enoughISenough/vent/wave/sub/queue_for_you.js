class QueueForYouWaveSetup extends IAmHereWaveSetup {
    constructor() {
        super();
    }

    createWave(ventSetup, timeElapsed, refDirection = null) {
        return new QueueForYouWave(ventSetup, this, timeElapsed, refDirection);
    }
}

class QueueForYouWave extends IAmHereWave {
    constructor(ventSetup, waveSetup, timeElapsed, refDirection) {
        super(ventSetup, waveSetup, timeElapsed, refDirection);
        this._mySpawnConeAngle = 0;
    }
}