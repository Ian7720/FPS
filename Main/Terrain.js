class Terrain {
  constructor(objPath, mtlPath, texturePath, onLoad) {
    this.objPath = objPath;
    this.mtlPath = mtlPath;
    this.texturePath = texturePath;
    this.onLoad = onLoad;
    this.loadTerrain();
  }

  loadTerrain() {
    const textureLoader = new THREE.TextureLoader();
    const loader = new THREE.MTLLoader();
    loader.load(this.mtlPath, (materials) => {
      materials.preload();

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);

      // Load the OBJ file
      objLoader.load(this.objPath, (object) => {
        // Object loaded successfully

        // Load the texture
        textureLoader.load(this.texturePath, (texture) => {
          // Assign the texture to the object's material
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.map = texture;
            }
          });

          this.onLoad(object);
        }, undefined, (error) => {
          console.error('Error loading texture:', error);
        });
      }, undefined, (error) => {
        console.error('Error loading OBJ file:', error);
      });
    }, undefined, (error) => {
      console.error('Error loading MTL file:', error);
    });
  }
}
