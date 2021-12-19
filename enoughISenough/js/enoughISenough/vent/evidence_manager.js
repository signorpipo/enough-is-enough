class EvidenceManager {
    constructor(evidenceSetupList) {
        this._myInactiveEvidences = [];
        this._myToUnspawnEvidences = [];
        this._myActiveEvidences = [];
        this._myToSpawnEvidences = [];

        this._buildEvidences(evidenceSetupList);

        this._myFSM = new PP.FSM();
        //this._myFSM.setDebugLogActive(true, "            Evidence");
        this._myFSM.addState("init");
        this._myFSM.addState("manage", this._updateManage.bind(this));
        this._myFSM.addState("clean", this._updateClean.bind(this));
        this._myFSM.addState("explode", this._updateExplode.bind(this));
        this._myFSM.addState("done");

        this._myFSM.addTransition("init", "manage", "start", this._prepareManage.bind(this));
        this._myFSM.addTransition("manage", "clean", "startClean", this._prepareClean.bind(this));
        this._myFSM.addTransition("manage", "explode", "startExplode", this._prepareExplode.bind(this));
        this._myFSM.addTransition("clean", "done", "end", this._evidencesHidden.bind(this));
        this._myFSM.addTransition("explode", "done", "end", this._evidencesHidden.bind(this));
        this._myFSM.addTransition("done", "manage", "start", this._prepareManage.bind(this));

        this._myFSM.init("init");

        this._myCardinalPositionsMap = new Map();
        this._buildCardinalPositionsMap();
    }

    start() {
        this._myFSM.perform("start");
    }

    update(dt) {
        this._myFSM.update(dt);

        if (Global.myDebugShortcutsEnabled) {
            //TEMP REMOVE THIS
            if (PP.myLeftGamepad.getButtonInfo(PP.ButtonType.SELECT).isPressEnd(Global.myDebugShortcutsPress)) {
                for (let evidence of this._myActiveEvidences) {
                    evidence[0].unspawn();
                }
            }
        }
    }

    explode() {
        this._myFSM.perform("startExplode");
    }

    clean() {
        this._myFSM.perform("startClean");
    }

    hide() {
        this._myFSM.init("done");

        for (let evidence of this._myActiveEvidences) {
            evidence[0].hide();
        }

        this._evidencesHidden();
    }

    isDone() {
        return this._myFSM.isInState("done");
    }

    _prepareManage(fsm) {
        let cardinalPositions = [];
        for (let key in CardinalPosition) {
            cardinalPositions.push(CardinalPosition[key]);
        }

        let times = [];
        times[0] = Math.pp_random(0.15, 0.55);
        for (let i = 1; i < cardinalPositions.length; i++) {
            times[i] = times[i - 1] + Math.pp_random(0.15, 0.55);
        }

        this._myToSpawnEvidences = [];

        while (cardinalPositions.length > 0) {
            let randomIndex = Math.pp_randomInt(0, cardinalPositions.length - 1);
            let cardinalPosition = cardinalPositions.pp_removeIndex(randomIndex);

            let evidence = this._getInactiveEvidence(cardinalPosition);
            if (evidence) {
                let time = times.shift();
                this._myToSpawnEvidences.push([evidence, cardinalPosition, new PP.Timer(time)]);
            }
        }
    }

    _updateManage(dt, fsm) {
        for (let evidenceToSpawn of this._myToSpawnEvidences) {
            evidenceToSpawn[2].update(dt);
            if (evidenceToSpawn[2].isDone()) {
                let evidence = evidenceToSpawn[0];
                let cardinalPosition = evidenceToSpawn[1];
                evidence.spawn(this._myCardinalPositionsMap.get(cardinalPosition));
                this._myActiveEvidences.push([evidence, cardinalPosition]);
            }
        }

        this._myToSpawnEvidences.pp_removeAll(element => element[2].isDone());

        for (let evidenceToUnspawn of this._myToUnspawnEvidences) {
            evidenceToUnspawn[1].update(dt);
            if (evidenceToUnspawn[1].isDone()) {
                let evidence = evidenceToUnspawn[0];
                this._myInactiveEvidences.push(evidence);
            }
        }

        this._myToUnspawnEvidences.pp_removeAll(element => element[1].isDone());

        for (let evidence of this._myActiveEvidences) {
            evidence[0].update(dt);
        }
    }

    _prepareExplode(fsm) {
        for (let evidence of this._myActiveEvidences) {
            evidence[0].unspawn();
        }
    }

    _updateExplode(dt, fsm) {
        for (let evidence of this._myActiveEvidences) {
            evidence[0].update(dt);
        }

        let done = true;
        for (let item of this._myActiveEvidences) {
            done = done && item[0].isInactive();
        }

        if (done) {
            fsm.perform("end");
        }
    }

    _prepareClean(fsm) {
        this._myUnspawnList = [];

        let indexList = [];
        for (let i = 0; i < this._myActiveEvidences.length; i++) {
            if (this._myActiveEvidences[i][0].canUnspawn()) {
                indexList.push(i);
            }
        }

        while (indexList.length > 0) {
            let randomIndex = Math.pp_randomInt(0, indexList.length - 1);
            let index = indexList.pp_removeIndex(randomIndex);

            let randomTimer = Math.pp_random(0.20, 0.25);
            if (this._myUnspawnList.length == 0) {
                randomTimer += 0.2;
            }
            this._myUnspawnList.push([this._myActiveEvidences[index][0], new PP.Timer(randomTimer)]);
        }
    }

    _updateClean(dt, fsm) {
        if (this._myUnspawnList.length > 0) {
            let first = this._myUnspawnList[0];
            first[1].update(dt);
            if (first[1].isDone()) {
                first[0].unspawn();
                this._myUnspawnList.shift();
            }
        }

        for (let evidence of this._myActiveEvidences) {
            evidence[0].update(dt);
        }

        let done = true;
        for (let item of this._myActiveEvidences) {
            done = done && item[0].isInactive();
        }

        if (done) {
            fsm.perform("end");
        }
    }

    _buildEvidences(evidenceSetupList) {
        for (let evidenceSetup of evidenceSetupList) {
            this._myInactiveEvidences.push(new Evidence(evidenceSetup, this._evidenceUnspawned.bind(this)));
        }
    }

    _evidenceUnspawned(evidence) {
        let evidenceRemoved = this._myActiveEvidences.pp_remove(element => element[0] === evidence);
        this._myToUnspawnEvidences.push([evidenceRemoved[0], new PP.Timer(1)]);

        let evidenceToSpawn = this._getInactiveEvidence(evidenceRemoved[1]);
        this._myToSpawnEvidences.push([evidenceToSpawn, evidenceRemoved[1], new PP.Timer(0.5)]);
    }

    _evidencesHidden() {
        for (let activeEvidence of this._myActiveEvidences) {
            this._myInactiveEvidences.push(activeEvidence[0]);
        }

        for (let toUnspawnEvidence of this._myToUnspawnEvidences) {
            this._myInactiveEvidences.push(toUnspawnEvidence[0]);
        }

        for (let toSpawnEvidence of this._myToSpawnEvidences) {
            this._myInactiveEvidences.push(toSpawnEvidence[0]);
        }

        this._myToUnspawnEvidences = [];
        this._myToSpawnEvidences = [];
        this._myActiveEvidences = [];
    }

    _buildCardinalPositionsMap() {
        let ringHeight = Global.myRingHeight;
        let ringRadius = Global.myRingRadius;
        let rotation = 45;

        let initialPosition = [0, ringHeight, -ringRadius];

        this._myCardinalPositionsMap.set(CardinalPosition.NORTH, initialPosition.vec3_clone());
        this._myCardinalPositionsMap.set(CardinalPosition.NORTH_WEST, initialPosition.vec3_rotateAxis([0, 1, 0], rotation));
        this._myCardinalPositionsMap.set(CardinalPosition.NORTH_EAST, initialPosition.vec3_rotateAxis([0, 1, 0], -rotation));
        this._myCardinalPositionsMap.set(CardinalPosition.WEST, initialPosition.vec3_rotateAxis([0, 1, 0], rotation * 2));
        this._myCardinalPositionsMap.set(CardinalPosition.EAST, initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 2));
        this._myCardinalPositionsMap.set(CardinalPosition.SOUTH_WEST, initialPosition.vec3_rotateAxis([0, 1, 0], rotation * 3));
        this._myCardinalPositionsMap.set(CardinalPosition.SOUTH_EAST, initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 3));
        this._myCardinalPositionsMap.set(CardinalPosition.SOUTH, initialPosition.vec3_rotateAxis([0, 1, 0], -rotation * 4));
    }

    _getInactiveEvidence(cardinalPosition) {
        let randomEvidence = null;

        let validEvidences = [];
        for (let evidence of this._myInactiveEvidences) {
            let setup = evidence.getEvidenceSetup();
            if ((setup.myCardinalPositions == null || setup.myCardinalPositions.includes(cardinalPosition)) &&
                (setup.myStartSpawnTime == null || setup.myStartSpawnTime < Global.myVentDuration) &&
                (setup.myEndSpawnTime == null || setup.myEndSpawnTime > Global.myVentDuration)) {
                validEvidences.push(evidence);
            }
        }

        // TEMP change with random unspawn instead of first one
        if (validEvidences.length == 0) {
            for (let unspawnEvidence of this._myToUnspawnEvidences) {
                let setup = unspawnEvidence[0].getEvidenceSetup();
                if ((setup.myCardinalPositions == null || setup.myCardinalPositions.includes(cardinalPosition)) &&
                    (setup.myStartSpawnTime == null || setup.myStartSpawnTime < Global.myVentDuration) &&
                    (setup.myEndSpawnTime == null || setup.myEndSpawnTime > Global.myVentDuration)) {
                    validEvidences.push(unspawnEvidence[0]);
                }
            }
        }

        let randomChanceSum = 0;
        for (let evidence of validEvidences) {
            randomChanceSum += evidence.getEvidenceSetup().myRandomChance;
        }

        let random = Math.pp_randomInt(0, randomChanceSum - 1);
        let currentSum = 0;
        for (let evidence of validEvidences) {
            currentSum += evidence.getEvidenceSetup().myRandomChance;
            if (random < currentSum) {
                randomEvidence = evidence;
                break;
            }
        }

        this._myInactiveEvidences.pp_removeEqual(randomEvidence);
        this._myToUnspawnEvidences.pp_remove(element => element[0] == randomEvidence);

        return randomEvidence;
    }
}