define(["jquery-2.0.3", "three.min"], function (jquery, three) {
  function Star(universe, params) {
    this.universe = universe;
    var edge = universe.edge;
    var starMaterial = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
	  var sizeMin = 800,
	    sizeMax = 2600;
	 
	  if (!params) { params = {}; }
	  
	  var starRadius = params.radius ||
      Math.floor(Math.random() * (sizeMax - sizeMin) + sizeMin);
    var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
    var mesh = new THREE.Mesh(starGeometry, starMaterial);
    this.gravity = starRadius;
    this.radius = starRadius;
    
    if (params.position) {
      var pos = params.position;
      this.position = pos;
    } else {
      var vecIdx = Math.floor(Math.random() * edge.geometry.vertices.length);
      var vec = edge.geometry.vertices[vecIdx];
      
      this.position = { x: vec.x, y: vec.y, z: 100000 };
    }
    
    mesh.position.set(0, 0, 0);
    universe.scene.add(mesh);
    this.mesh = mesh;
  }
  
  Star.updateStars = function (universe) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
    if (universe.stars.length < 100) {
      var star = new Star(universe);
      universe.stars.push(star);
    }
    
	  for (var i = 0; i < universe.stars.length; i++) {
      var star = universe.stars[i];
      if (!star) { continue; }
      
	    var mesh = star.mesh;
      mesh.lookAt(star.position);
      mesh.translateZ(150);  
	  }
	  
	  Star.checkCollisions(universe);
  };
  
  Star.checkCollisions = function (universe) {
    var stars = universe.stars;
    
    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      
      if (star.mesh.position.z >= star.position.z) {
        universe.scene.remove(star.mesh);
        delete universe.stars[i];
        universe.stars.splice(i, 1);
      }
    }
  };
  
  Star.applyGravity = function (biggerStar, otherStar) {
    var universe = biggerStar.universe;
    var distance2 = Math.pow(biggerStar.mesh.position.distanceTo(otherStar.mesh.position), 2);
    var gravityPower = biggerStar.gravity * 0.001 * distance2;

    var bigScale = biggerStar.mesh.scale.x + 0.01;
    if (bigScale < 5) {
      biggerStar.mesh.scale.x = bigScale;
      biggerStar.mesh.scale.y = bigScale;
      biggerStar.mesh.scale.z = bigScale;  
    }
    
    var otherScale = otherStar.mesh.scale.x - 0.01;
    if (otherScale < 0.5) {
      universe.scene.remove(otherStar.mesh);
      var idx = universe.stars.indexOf(otherStar);
      delete universe.stars[idx];
      universe.stars.splice(idx, 1);
    } else {
      otherStar.mesh.scale.x = otherScale;
      otherStar.mesh.scale.y = otherScale;
      otherStar.mesh.scale.z = otherScale;
    }
  };
  
  return Star;
});
