define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Star(universe) {
    var edge = universe.edge;
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
    
    universe.scene.add(mesh);
    this.mesh = mesh;
  }
  
  Star.updateStars = function (universe) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
	  for (var i = 0; i < universe.stars.length; i++) {
      var star = universe.stars[i].mesh;
	    
	    if (-100 <= star.position.x && star.position.x <= 100 &&
	        -100 <= star.position.y && star.position.y <= 100 &&
	        -100 <= star.position.z && star.position.z <= 100) {
	      universe.scene.remove(universe.stars[i]);
	      delete universe.stars[i];
        universe.stars.splice(i, 1);
        star = new Star(universe);
        universe.stars.push(star);
        star = star.mesh;
      }
      
      star.lookAt(new THREE.Vector3(0, 0, 0));
      star.translateZ(100);
	  }
  };
  
  return Star;
});
