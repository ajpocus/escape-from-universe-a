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
      mesh.translateZ(150);
	  }
	  
	  //Star.checkCollisions(universe);
  };
  
  Star.checkCollisions = function (universe) {
    var stars = universe.stars.slice(0);

    var newStars = [];
    var positions = [];
    
    var i,
      directions = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 1, 1),
        new THREE.Vector3(1, 1, 0),
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(0, 0, -1),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(0, -1, -1),
        new THREE.Vector3(-1, -1, 0),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(0, -1, 1),
        new THREE.Vector3(0, 1, -1),
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(1, -1, 0),
        new THREE.Vector3(-1, -1, 1),
        new THREE.Vector3(-1, 1, -1),
        new THREE.Vector3(1, -1, -1)
      ];
    
    // increase precision
    var newDirections = [];
    for (i = 0; i < directions.length; i++) {
      var dir = directions[i];
      newDirections.push(new THREE.Vector3(dir.x/2, dir.y/2, dir.z/2));
    }
    for (i = 0; i < newDirections.length; i++) { 
      directions.push(newDirections[i]); 
    }
    
    for (i = 0; i < stars.length; i++) {
      positions.push(stars[i].mesh.position);
    }
    
    var caster = new THREE.Raycaster();
    for (i = 0; i < stars.length; i++) {
      var star = stars[i];
      if (!star) { continue; }
      var starMesh = star.mesh;
      
      caster.far = starMesh.radius * 3;
      
      for (var j = 0; j < directions.length; j++) {
        caster.set(star, directions[j]);
        var intersects = caster.intersectObjects(positions);
        if (intersects.length > 0) { console.log(intersects); }
      }
    }
    
    //universe.stars = newStars;
    
  };
  
  Star.applyGravity = function (biggerStar, otherStar) {
    var universe = biggerStar.universe;
    var distance2 = Math.pow(biggerStar.mesh.position.distanceTo(otherStar.mesh.position), 2);
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
    
    newSmall.mesh.lookAt(newBig.mesh);
    newSmall.mesh.translateZ(gravityPower);
    
    return [biggerStar, otherStar];
  };
  
  return Star;
});
