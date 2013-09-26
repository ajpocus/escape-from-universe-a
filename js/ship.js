define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Ship(universe) {
    this.universe = universe;
    var geom = new THREE.CubeGeometry(32, 32, 32);	  
	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
	  this.mesh = new THREE.Mesh(geom, mat);
	  
	  universe.scene.add(this.mesh);
  }
  
  return Ship;
});
