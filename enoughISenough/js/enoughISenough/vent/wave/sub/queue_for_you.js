class QueueForYouWaveSetup extends IAmHereWaveSetup {
    constructor() {
        super();
    }

    createWave(ventRuntimeSetup, timeElapsed, refDirection = null) {
        return new QueueForYouWave(ventRuntimeSetup, this, timeElapsed, refDirection);
    }

    getPrecomputed(timeElapsed) {
        let setup = new QueueForYouWaveSetup();

        setup.myClonesCount = this.myClonesCount.get(timeElapsed);
        setup.mySpawnConeAngle = this.mySpawnConeAngle.get(timeElapsed);
        setup.myMinAngleBetweenClones = this.myMinAngleBetweenClones.get(timeElapsed);
        setup.myWaveStartAngle = this.myWaveStartAngle.get(timeElapsed);
        setup.mySameTimeBetweenClones = this.mySameTimeBetweenClones.get(timeElapsed);
        if (setup.mySameTimeBetweenClones >= 0) {
            setup.myTimeBetweenClones = this.myTimeBetweenClones.get(timeElapsed);
        } else {
            setup.myTimeBetweenClones = this.myTimeBetweenClones;
        }

        setup.myFirstCloneInTheMiddle = this.myFirstCloneInTheMiddle;
        setup.myDoneDelay = this.myDoneDelay.get(timeElapsed);
        setup.myTimeBeforeStart = this.myTimeBeforeStart.get(timeElapsed);

        setup.myDiscardOutsideValidAngle = this.myDiscardOutsideValidAngle.get(timeElapsed);

        setup.myRefDirection = this.myRefDirection;

        return setup;
    }
}

class QueueForYouWave extends IAmHereWave {
    constructor(ventRuntimeSetup, waveSetup, timeElapsed, refDirection) {
        super(ventRuntimeSetup, waveSetup, timeElapsed, refDirection);
        this._mySpawnConeAngle = 0;
    }
}