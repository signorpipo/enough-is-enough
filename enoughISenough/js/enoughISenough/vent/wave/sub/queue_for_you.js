class QueueForYouWaveSetup extends IAmHereWaveSetup {
    constructor() {
        super();
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new QueueForYouWave(ventRuntimeSetup, this, timeElapsed, refDirection);
    }
}

class QueueForYouWave extends IAmHereWave {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);
        this._mySpawnConeAngle = 0;
    }
}