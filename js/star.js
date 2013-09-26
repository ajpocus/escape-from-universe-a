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
      mesh.position.set(pos.x, pos.y, pos.z);
    } else {
      var vecIdx = Math.floor(Math.random() * edge.geometry.vertices.length);
      var vec = edge.geometry.vertices[vecIdx];
      
      var zSub = 40000;
      var randZ = vec.z - Math.floor(Math.random() * zSub);
      mesh.position.set(vec.x, vec.y, randZ);
    }
    
    universe.scene.add(mesh);
    this.mesh = mesh;
  }
  
  Star.updateStars = function (universe) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    
	  for (var i = 0; i < universe.stars.length; i++) {
      var star = universe.stars[i];
      if (!star) { continue; }
      
	    var mesh = star.mesh;
	    
	    if (-100 <= mesh.position.x && mesh.position.x <= 100 &&
	        -100 <= mesh.position.y && mesh.position.y <= 100 &&
	        -100 <= mesh.position.z && mesh.position.z <= 100)
	    {
	      universe.scene.remove(universe.stars[i]);
	      delete universe.stars[i];
        universe.stars.splice(i, 1);
        
        star = new Star(universe);
        universe.stars.push(star);
        star = star
        mesh = star.mesh;
      }
      
      mesh.lookAt(new THREE.Vector3(0, 0, 0));
      mesh.translateZ(50);
	  }
	  
	  Star.checkCollisions(universe);
  };
  
  Star.checkCollisions = function (universe) {
    var stars = universe.stars;

    for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
      if (!star) { continue; }
      var starMesh = star.mesh;
      
      for (var j = 0; j < stars.length; j++) {
        var otherStar = stars[j];
        if (!otherStar) { continue; }
        
        var otherMesh = otherStar.mesh;
        var range = starMesh.geometry.radius * 2 + otherMesh.geometry.radius * 2;
        var distance = starMesh.position.distanceTo(otherMesh.position);
        
        if (distance <= range) {
          var biggerStar;
          if (starMesh.radius >= otherMesh.radius) {
            biggerStar = star;
          } else {
            biggerStar = otherStar;
            otherStar = star;
          }
          
          var distance2 = Math.pow(distance, 2) || 1;
          var gravityPower = biggerStar.gravity * 0.001 * distance2;

          var geom, mat,
            bigGeom = biggerStar.mesh.geometry,
            smallGeom = otherStar.mesh.geometry;
          
          var newBig = new Star(universe, {
            radius: bigGeom.radius + gravityPower,
            position: biggerStar.mesh.position
          });
          
          var newSmall = new Star(universe, {
            radius: smallGeom.radius - gravityPower,
            position: otherStar.mesh.position
          });
          
          universe.scene.remove(biggerStar);
          universe.scene.remove(otherStar);
          
          delete universe.stars[i];
          delete universe.stars[j];
          
          universe.stars.splice(i, 1);
          universe.stars.splice(j, 1);
          universe.stars.push(newBig);
          universe.stars.push(newSmall);
          
          newSmall.mesh.lookAt(newBig.mesh);
          newSmall.mesh.translateZ(gravityPower);
        }
      }
    }
    
  }
  
  return Star;
});
