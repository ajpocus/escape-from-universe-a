define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Ship(universe) {
    this.universe = universe;
    
    var geom = new THREE.Geometry();
	  var bottomLeft = new THREE.Vector3(-32, 0, 0);
	  var bottomRight = new THREE.Vector3(32, 0, 0);
	  var bottomFront = new THREE.Vector3(0, 0, -64);
    var topFront = new THREE.Vector3(0, 8, -56);
    
	  geom.vertices.push(bottomLeft);
	  geom.vertices.push(bottomFront);
	  geom.vertices.push(bottomRight);
	  geom.vertices.push(topFront);
	  
	  geom.faces.push(new THREE.Face3(2, 1, 0));

	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
	  this.mesh = new THREE.Mesh(geom, mat);
	  universe.scene.add(this.mesh);
  }
  
  return Ship;
});
