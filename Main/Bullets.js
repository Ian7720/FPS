class Bullets {
    
    constructor(maxBullets, scene, aMaterial) {
        this.material = aMaterial;
        this.objWidth = 1;
        this.maxBullets = maxBullets;
        this.bullets = [];
        this.launched = [];
        this.target = [];
        for(var i = 0; i < maxBullets; ++i) {
            this.launched[i] = false;
            this.target[i] = new THREE.Vector3( 0, 0, 0 );
            this.bullets[i] = this.createObject(i);
            scene.add(this.bullets[i]);
        }
    }

    getLaunched(i) {
        return this.launched[i];
    }

    setLaunched(i) {
        this.launched[i] = false;
    }

    getParameters(i) {
        var parameters = {x: this.bullets[i].position.x, y: this.bullets[i].position.y,
            z: this.bullets[i].position.z, radio: this.objWidth/2};
        return parameters;
    }

    reload() {
        for (var i = 0; i < this.maxBullets; ++i) {
            this.bullets[i].remove();
            this.launched[i] = false;
            this.target[i] = new THREE.Vector3( 0, 0, 0 );
            this.bullets[i] = this.createObject(i);
            scene.add(this.bullets[i]);
        }
    }

    createObject(i) {
        var bullet = new Physijs.SphereMesh(new THREE.SphereGeometry(this.objWidth/4, 20,20), this.material, 50);
        bullet.position.set(i, 5, 0.0);
        bullet.castShadow = true;
        return bullet;
    }

    setInitPosition(i) {
        this.bullets[i].position.x = i;
        this.bullets[i].position.y = 0;
        this.bullets[i].position.z = 0;
        this.bullets[i].__dirtyPosition = true;
    }

    shoot(i, position, target, weapon) {
        this.target[i].set(target.x, target.y, target.z);
        this.bullets[i].position.set(position.x-target.x, position.y+5, position.z-target.z);

        //Detect more collisions per second
        this.bullets[i].setCcdMotionThreshold(10);
        this.bullets[i].setCcdSweptSphereRadius(this.objWidth/4);

        this.bullets[i].__dirtyPosition = true;
        this.launched[i] = true;

        var power = null;
        var sound = null; 

            power = 35000;
            sound = new Howl({
              src: ['sounds/escopeta.mp3'], volume: 0.5
            });

        var fuerza = new THREE.Vector3(this.target[i].x*power, this.target[i].y*power, this.target[i].z*power);
        this.bullets[i].applyCentralImpulse( fuerza );
        
        sound.play();        
    }
}