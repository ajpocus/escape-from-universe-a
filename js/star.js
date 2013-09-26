define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Star(scene) {
    var edge = scene.edge;
    var starMaterial = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
	  var sizeMin = 80,
	    sizeMax = 1000;
	  
    var starRadius = Math.floor(Math.random() * (sizeMax - sizeMin) + sizeMin);
    var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
    var mesh = new THREE.Mesh(starGeometry, starMaterial);
    this.gravity = Math.pow(starRadius, 2);
    this.radius = starRadius;
    
    var vecIdx = Math.floor(Math.random() * edge.geometry.vertices.length);
    var vec = edge.geometry.vertices[vecIdx];
    
    var zSub = 20000;
    var randZ = vec.z - Math.floor(Math.random() * zSub);
    mesh.position.set(vec.x, vec.y, randZ);
    
    scene.add(mesh);
    this.mesh = mesh;
  }
  
  return Star;
});
