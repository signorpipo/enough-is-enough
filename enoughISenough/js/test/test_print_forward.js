WL.registerComponent('test-print-axes', {
}, {
    init: function () {
        this._myCounter = 70;
    },
    start: function () {
        this._myDebugForward = new DebugLine();
        this._myDebugForward.setColor([0, 0, 1, 1]);

        this._myDebugUp = new DebugLine();
        this._myDebugUp.setColor([0, 1, 0, 1]);

        this._myDebugRight = new DebugLine();
        this._myDebugRight.setColor([1, 0, 0, 1]);

        this._myDebugTest = new DebugLine();
    },
    update: function (dt) {
        if (this._myCounter >= 0) {
            this._myCounter--;
            if (this._myCounter == 0) {
                this._myCounter = 70;

                console.log(this.object.pp_getRight()[0].toFixed(4), this.object.pp_getRight()[1].toFixed(4), this.object.pp_getRight()[2].toFixed(4));
                console.log(this.object.pp_getUp()[0].toFixed(4), this.object.pp_getUp()[1].toFixed(4), this.object.pp_getUp()[2].toFixed(4));
                console.log(this.object.pp_getForward()[0].toFixed(4), this.object.pp_getForward()[1].toFixed(4), this.object.pp_getForward()[2].toFixed(4));

                /*
                let right = [];
                let up = [];
                let forward = [];

                this.object.getRight(right);
                this.object.getUp(up);
                this.object.getForward(forward);

                console.log(right[0].toFixed(4), right[1].toFixed(4), right[2].toFixed(4));
                console.log(up[0].toFixed(4), up[1].toFixed(4), up[2].toFixed(4));
                console.log(forward[0].toFixed(4), forward[1].toFixed(4), forward[2].toFixed(4));
                */

                console.log("   ");
            }
        }

        /*
        let right = [];
        let up = [];
        let forward = [];

        this.object.getRight(right);
        this.object.getUp(up);
        this.object.getForward(forward);

        this._myDebugForward.setStartDirectionLength(this.object.pp_getPosition(), forward, 0.1);
        this._myDebugForward.update(dt);

        this._myDebugUp.setStartDirectionLength(this.object.pp_getPosition(), up, 0.1);
        this._myDebugUp.update(dt);

        this._myDebugRight.setStartDirectionLength(this.object.pp_getPosition(), right, 0.1);
        this._myDebugRight.update(dt);
        */

        this._myDebugForward.setStartDirectionLength(this.object.pp_getPosition(), this.object.pp_getForward(), 0.1);
        this._myDebugForward.update(dt);

        this._myDebugUp.setStartDirectionLength(this.object.pp_getPosition(), this.object.pp_getUp(), 0.1);
        this._myDebugUp.update(dt);

        this._myDebugRight.setStartDirectionLength(this.object.pp_getPosition(), this.object.pp_getRight(), 0.1);
        this._myDebugRight.update(dt);

        this._myDebugTest.setStartEnd(this.object.pp_getPosition(), [0.5, 2, 0]);
        console.log(this.object.pp_getPosition()[1]);
        this._myDebugTest.update(dt);
    }
});