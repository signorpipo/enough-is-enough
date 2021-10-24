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

    explosion(position, objectScale, objectType) {
        let explosionParticles = new ExplosionParticles(position, objectScale, objectType);
        this._myParticlesList.push(explosionParticles);
    }
}

class ExplosionParticles {
    constructor(position, objectScale, objectType) {
        this._myPosition = position.slice(0);
        this._myScale = objectScale.vec3_length();
        this._myRadius = this._myScale * 1.25;
        this._myObjectType = objectType;

        this._myTimer = new PP.Timer(0.5);
        this._mySpawnTimer = new PP.Timer(0);
        this._myParticles = [];
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            this._mySpawnTimer.update(dt);
            if (this._mySpawnTimer.isDone()) {
                for (let i = 0; i < 2; i++) {
                    this._myParticles.push(this._createParticle());
                }
                this._mySpawnTimer.start(0.1);
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
        let scale = this._myScale * 0.075;

        return new ExplosionParticle(position, scale, this._myObjectType);
    }
}

class ExplosionParticle {
    constructor(position, scale, objectType) {
        this._myObjectType = objectType;
        this._myObject = Global.myObjectPoolMap.getObject(objectType);
        this._myObject.pp_setPosition(position);
        this._myObject.pp_setScale(scale);
        this._myScale = this._myObject.pp_getScale();
        this._myObject.pp_setRotation([Math.pp_random(-180, 180), Math.pp_random(-180, 180), Math.pp_random(-180, 180)]);
        this._myObject.pp_setActive(true);

        this._myTimer = new PP.Timer(0.15);
    }

    update(dt) {
        if (this._myTimer.isRunning()) {
            this._myTimer.update(dt);

            let scaleMultiplier = Math.pp_interpolate(1, PP.myEasyTuneVariables.get("Unspawn Menu Scale"), this._myTimer.getPercentage());
            this._myObject.pp_setScale(this._myScale.vec3_scale(scaleMultiplier));

            if (this._myTimer.isDone()) {
                Global.myObjectPoolMap.releaseObject(this._myObjectType, this._myObject);
                this._myObject = null;
            }
        }
    }

    isDone() {
        return this._myTimer.isDone();
    }
}