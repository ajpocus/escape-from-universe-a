define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Ship(universe) {
    this.universe = universe;
    var geom = new THREE.CubeGeometry(32, 32, 32);	  
	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
	  this.mesh = new THREE.Mesh(geom, mat);
	  
	  universe.scene.add(this.mesh);
  }
  
  Ship.prototype.center = function (universe) {
    var camera = this.universe.camera;
    var vec = new THREE.Vector3(0, 0, -100);
    vec.applyMatrix4(camera.matrixWorld);
    console.log(vec);
    this.mesh.position.set(vec.x, vec.y, vec.z);
  };
  
  return Ship;
});
