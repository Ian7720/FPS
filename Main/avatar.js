class Avatar {

    constructor(camera, scene) {

        var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial ({color: 0x000000}), 1, 0);
        this.avatar = new THREE.Mesh (new THREE.BoxGeometry (5, 5, 5), mat);
        this.avatar.material.transparent = true;
        this.avatar.material.opacity = 0.0;
        this.avatar.position.y = 2.5;
        this.avatar.__dirtyPosition = true;
        scene.add(this.avatar);
        this.camera = camera;
        this.controls = controls;
        this.activeWeapon = null;
        this.goingUp = true;
        this.recoil = true;
        this.rifle = null;
 
        this.avatar.add(this.camera);
    }

    getPosition() {
        var pos = new THREE.Vector3();
        pos.x = this.avatar.position.x;
        pos.y = this.avatar.position.y;
        pos.z = this.avatar.position.z;
        return pos;
    }

    setInitialPosition() {
        this.avatar.position.set(0, 2.5, 0);
    }

    getActiveWeapon() {
        return this.activeWeapon;
    }

    jump() {
        if (this.goingUp) {
            if (this.avatar.position.y > 15) this.goingUp = false;
            else this.avatar.position.y += 0.5;
        } else {
            if (this.avatar.position.y >= 2 && this.avatar.position.y <= 2.5) {
                jumping = false;
                this.goingUp = true;
            } else this.avatar.position.y -= 0.5;
        }
    }

    updateControls() {
        controls.getObject().position.set(this.avatar.position.x, this.avatar.position.y+5, this.avatar.position.z);
    }

    moveForward() {
        var target = this.camera.getWorldDirection();
            this.avatar.translateX( target.x );
            this.avatar.translateZ( target.z );
    }

    moveBackward() {
        var target = this.camera.getWorldDirection();
            this.avatar.translateX( -target.x );
            this.avatar.translateZ( -target.z );
    }

    moveLeft() {
        var target = this.camera.getWorldDirection();
            this.avatar.translateX( target.z );
            this.avatar.translateZ( -target.x );
    }

    moveRight() {
        var target = this.camera.getWorldDirection();
            this.avatar.translateX( -target.z );
            this.avatar.translateZ( target.x );
    }

    animateWeapon() {
            if (this.recoil) {
                if (this.rifle.rotation.x >= 0.2) this.recoil = false;
                else this.rifle.rotation.x += 0.1;
            } else {
                if (this.rifle.rotation.x >= 0 && this.rifle.rotation.x <= 0.1) {
                    shooting = false;
                    this.recoil = true;
                } else this.rifle.rotation.x -= 0.1;
            }
    }

    loadWeapon() {
        var thatCamera = this.camera;
        var that = this;

        var mtlLoader = new THREE.MTLLoader();
        var objLoader = new THREE.OBJLoader();
        var texture = null;

        mtlLoader.setPath( "models/" );
        mtlLoader.load( "material.mtl" , function ( materials ) {
            materials.preload();
            
            objLoader.setMaterials( materials );
            objLoader.setPath( "models/" );
            objLoader.load( "m4a1_s.obj", function ( object ) {
                texture = THREE.ImageUtils.loadTexture('models/m4a1_stext.png');
                object.children[1].material = new THREE.MeshLambertMaterial({map: texture});
                //m4a1_s
                object.children[1].position.set(0, 0, 0);
                object.children[1].scale.set(0.2, 0.2, 0.2);
                object.children[1].rotation.set(0.1, 3.4, 0);
                object.children[1].position.set(2, -0.8, -2);
                that.rifle = object.children[1];
                thatCamera.add(that.rifle);
                that.activeWeapon = 0;
            });
        });
    }
  
}