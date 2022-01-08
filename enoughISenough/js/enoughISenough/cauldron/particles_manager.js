class ParticlesManager {
    constructor() {
        this._myParticlesList = [];
    }

    update(dt) {
        for (let particles of this._myParticlesList) {
            particles.update(dt);
        }

        this._myParticlesList.pp_removeAll(element => element.isDone());
    }

    explosion(position, radius, objectScale, objectType, noFog = false) {
        let explosionParticles = new ExplosionParticles(position, radius, objectScale, objectType, noFog);
        this._myParticlesList.push(explosionParticles);
    }

    fireworks(position, radius, objectScale) {
        let explosionParticles = new FireworkParticles(position, radius, objectScale);
        this._myParticlesList.push(explosionParticles);
    }

    mrNOTParticles(position) {
        let explosionParticles = new MrNOTParticles(position, 3, [1, 1, 1].vec3_scale(PP.myEasyTuneVariables.get("mr NOT Clone Scale")));
        this._myParticlesList.push(explosionParticles);
    }
}

class ExplosionParticles {
    constructor(position, radius, objectScale, objectType, noFog) {
        this._myPosition = position.slice(0);
        this._myScale = objectScale[0];
        this._myRadius = radius;
        this._myObjectType = objectType;
        this._myNoFog = noFog;

        this._myTimer = new PP.Timer(PP.myEasyTuneVariables.get("Explosion Particles Duration"));
        this._mySpawnTimer = new PP.Timer(0);
        this._myParticles = [];

        this._myLastScale = 1;
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                for (let i = 0; i < PP.myEasyTuneVariables.get("Explosion Particles Amount"); i++) {
                    this._myParticles.push(this._createParticle());
                }
                this._mySpawnTimer.start(PP.myEasyTuneVariables.get("Explosion Particles Delay"));
            }
        }

        for (let particle of this._myParticles) {
            particle.update(dt);
        }

        this._myParticles.pp_removeAll(element => element.isDone());

    }

    isDone() {
        return this._myTimer.isDone() && this._myParticles.length == 0;
    }

    _createParticle() {
        let direction = [0, 0, 1];
        direction = direction.vec3_rotate([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)]);

        let radius = Math.pp_random(this._myRadius * 0.75, this._myRadius * 1.25);
        let position = direction.vec3_scale(radius).vec3_add(this._myPosition);

        let minScale = 0.1;
        let maxScale = 0.25;
        let half = (maxScale + minScale) / 2;

        let scale = half;

        if (this._myLastScale >= 0) {
            let ottave = (maxScale - minScale) / 8;
            if (this._myLastScale > half) {
                scale = Math.pp_random(this._myScale * minScale, this._myScale * (half + ottave));
            } else {
                scale = Math.pp_random(this._myScale * (half - ottave), this._myScale * maxScale);
            }
        }

        this._myLastScale = scale;

        return new ExplosionParticle(position, scale, this._myObjectType, this._myNoFog);
    }
}

class FireworkParticles {
    constructor(position, radius, objectScale) {
        this._myPosition = position.slice(0);
        this._myScale = objectScale[0];
        this._myRadius = radius;

        this._myTimer = new PP.Timer(5);
        this._mySpawnTimer = new PP.Timer(0);
        this._myParticles = [];
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                for (let i = 0; i < 5; i++) {
                    this._myParticles.push(this._createParticle());
                }
                this._mySpawnTimer.start(PP.myEasyTuneVariables.get("Explosion Particles Delay"));
            }
        }

        for (let particle of this._myParticles) {
            particle.update(dt);
        }

        this._myParticles.pp_removeAll(element => element.isDone());

    }

    isDone() {
        return this._myTimer.isDone() && this._myParticles.length == 0;
    }

    _createParticle() {
        let direction = [0, 0, 1];
        direction = direction.vec3_rotate([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)]);

        let radius = Math.pp_random(this._myRadius * 0.2, this._myRadius);
        let position = direction.vec3_scale(radius).vec3_add(this._myPosition);
        let scale = Math.pp_random(this._myScale * 0.1, this._myScale * 0.25);

        let random = 0;
        while (random == 0) {
            random = Math.pp_randomInt(1, 39);
            if (random == 18 || random == 19 || random == 18) {
                random = 0;
            }
        }

        return new ExplosionParticle(position, scale, random, true);
    }
}

class MrNOTParticles {
    constructor(position, radius, objectScale) {
        this._myPosition = position.slice(0);
        this._myScale = objectScale[0];
        this._myRadius = radius;

        this._myTimer = new PP.Timer(1);
        this._mySpawnTimer = new PP.Timer(0);
        this._myParticles = [];

        this._myIsInFrontOfPlayer = 0;
        this._myInFrontOfPlayerCreated = false;
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                let numberOfParticles = 3;
                for (let i = 0; i < numberOfParticles; i++) {
                    this._myParticles.push(this._createParticle(i == numberOfParticles - 1));
                }
                this._mySpawnTimer.start(PP.myEasyTuneVariables.get("Explosion Particles Delay"));

                this._myIsInFrontOfPlayer = (this._myIsInFrontOfPlayer + 1) % 2;
                this._myInFrontOfPlayerCreated = false;
            }
        }

        for (let particle of this._myParticles) {
            particle.update(dt);
        }

        this._myParticles.pp_removeAll(element => element.isDone());

    }

    isDone() {
        return this._myTimer.isDone() && this._myParticles.length == 0;
    }

    _createParticle(isLast) {
        let direction = [0, 0, 1];
        direction = direction.vec3_rotate([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)]);

        let radius = Math.pp_random(this._myRadius * 0.75, this._myRadius);
        let position = direction.vec3_scale(radius).vec3_add(this._myPosition);
        position.vec3_add([0, -0.6, 0], position);
        let scale = Math.pp_random(this._myScale * 1.5, this._myScale * (1.5 + 0.15));

        if (!this._myInFrontOfPlayerCreated && this._myIsInFrontOfPlayer == 0) {
            let checkFrontVector = position.vec3_sub(Global.myPlayerPosition);
            let angle = checkFrontVector.vec3_angle(Global.myPlayerForward);

            if (angle < 25) {
                this._myInFrontOfPlayerCreated = true;
            } else if (isLast) {
                let attempts = 100;
                while (attempts > 0 && angle >= 25) {
                    attempts--;
                    direction.vec3_set(0, 0, 1);
                    direction.vec3_rotate([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)], direction);
                    direction.vec3_scale(radius, position).vec3_add(this._myPosition, position);
                    position.vec3_add([0, -0.6, 0], position);

                    position.vec3_sub(Global.myPlayerPosition, checkFrontVector);
                    angle = checkFrontVector.vec3_angle(Global.myPlayerForward);
                }
            }
        }

        return new MrNOTParticle(position, scale, GameObjectType.MR_NOT, true);
    }
}

class ExplosionParticle {
    constructor(position, scale, objectType, noFog) {
        this._myNoFog = noFog;
        this._myObjectType = objectType;
        if (this._myNoFog) {
            this._myObject = Global.myMeshNoFogObjectPoolMap.getObject(objectType);
        } else {
            this._myObject = Global.myMeshObjectPoolMap.getObject(objectType);
        }
        this._myObject.pp_setPosition(position);
        this._myObject.pp_setScale(scale);
        this._myScale = this._myObject.pp_getScale();
        this._myObject.pp_setRotation([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)]);
        this._myObject.pp_setActive(true);

        this._myTimer = new PP.Timer(PP.myEasyTuneVariables.get("Explosion Particle Life"));
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
            this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

            if (this._myTimer.isDone()) {
                if (this._myNoFog) {
                    Global.myMeshNoFogObjectPoolMap.releaseObject(this._myObjectType, this._myObject);
                } else {
                    Global.myMeshObjectPoolMap.releaseObject(this._myObjectType, this._myObject);
                }
                this._myObject = null;
            }
        }
    }

    isDone() {
        return this._myTimer.isDone();
    }
}

class MrNOTParticle {
    constructor(position, scale, objectType, noFog) {
        this._myNoFog = noFog;
        this._myObjectType = objectType;
        if (this._myNoFog) {
            this._myObject = Global.myMeshNoFogObjectPoolMap.getObject(objectType);
        } else {
            this._myObject = Global.myMeshObjectPoolMap.getObject(objectType);
        }
        this._myObject.pp_setPosition(position);
        this._myObject.pp_setScale(scale);
        this._myScale = this._myObject.pp_getScale();
        this._myObject.pp_lookAt(Global.myPlayerPosition, [0, 1, 0]);
        this._myObject.pp_setActive(true);

        this._myTimer = new PP.Timer(PP.myEasyTuneVariables.get("Explosion Particle Life"));
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
            this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

            if (this._myTimer.isDone()) {
                if (this._myNoFog) {
                    Global.myMeshNoFogObjectPoolMap.releaseObject(this._myObjectType, this._myObject);
                } else {
                    Global.myMeshObjectPoolMap.releaseObject(this._myObjectType, this._myObject);
                }
                this._myObject = null;
            }
        }
    }

    isDone() {
        return this._myTimer.isDone();
    }
}