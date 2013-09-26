define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Ship(scene) {
    var geom = new THREE.Geometry();
	  
	  var bottomLeft = new THREE.Vector3(-32, 0, 0);
	  var bottomRight = new THREE.Vector3(32, 0, 0);
	  var bottomFront = new THREE.Vector3(0, 0, 64);
	  var topBack = new THREE.Vector3(0, 32, 16);
	  
	  geom.vertices.push(bottomLeft);
	  geom.vertices.push(bottomRight);
	  geom.vertices.push(bottomFront);
	  geom.vertices.push(topBack);
	  
	  geom.faces.push(new THREE.Face3(0, 1, 2));
	  geom.faces.push(new THREE.Face3(0, 1, 3));
	  geom.faces.push(new THREE.Face3(0, 2, 3));
	  geom.faces.push(new THREE.Face3(0, 1, 2));
	  
	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
	  this.mesh = new THREE.Mesh(geom, mat);
	  
	  scene.add(this.mesh);
  }
  
  return Ship;
});
