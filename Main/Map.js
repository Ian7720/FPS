class Map {

  constructor () {

    this.map_size = 0;
    this.map = [];

    var loader = new THREE.TextureLoader();
    var texturaMetal = loader.load ("imgs/Ice.jpg");
    var texturaBase = loader.load("imgs/snow.jpg");

    var mat = Physijs.createMaterial(new THREE.MeshPhongMaterial ({map: texturaMetal}),0,0);
    var mat1 = Physijs.createMaterial(new THREE.MeshPhongMaterial ({map: texturaBase}),0,0);
    
    var start1 = new Physijs.BoxMesh (new THREE.BoxGeometry (400, 1, 200, 1, 1, 1), mat1, 0);
    start1.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, 0));
    start1.receiveShadow = true;
    start1.autoUpdateMatrix = false; 
    this.map.push(start1);
    ++this.map_size;

    var enemies2 = new Physijs.BoxMesh (new THREE.BoxGeometry (410, 2, 400, 1, 1, 1), mat, 0);
    enemies2.applyMatrix (new THREE.Matrix4().makeTranslation (0, 0, -300));
    enemies2.receiveShadow = true;
    enemies2.autoUpdateMatrix = false;
    this.map.push(enemies2);
    ++this.map_size;
    
    return this;
  }

  getMap(i) {
    return this.map[i];
  }

  getMapSize() {
    return this.map_size;
  }
}

