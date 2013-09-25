$(function () {
  var camera, scene, renderer, controls, ray, stats, ship,
	  time = Date.now(),
	  objects = [],
	  stars = [],
    frameCount = 0,
    spawnMin = 6000,
    spawnMax = 10000,
    dirs = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(1, 0, 1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(1, 0, -1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(-1, 0, -1),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(-1, 0, 1)
    ];

	init();
	animate();

	function init() {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
		scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5000, 10000)
    
    // create a point light
    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    document.body.appendChild( stats.domElement );
    
    // create field of stars
    var width = window.innerWidth,
      height = window.innerHeight;
      
    for (var i = 0; i < 10; i++) {
      makeStar();
    }
    makeShip();
    camera.lookAt(ship);
	  controls = new THREE.PointerLockControls( camera );
	  controls.enabled = true;
		scene.add( controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
	}
	
	function makeShip() {
	  var geom = new THREE.Geometry();
	  
	  var bottomLeft = new THREE.Vector3(-50, 0, 0);
	  var bottomRight = new THREE.Vector3(50, 0, 0);
	  var bottomFront = new THREE.Vector3(0, 0, 72);
	  var topBack = new THREE.Vector3(0, 50, 10);
	  geom.vertices.push(bottomLeft);
	  geom.vertices.push(bottomRight);
	  geom.vertices.push(bottomFront);
	  geom.vertices.push(topBack);
	  
	  geom.faces.push(new THREE.Face3(0, 1, 2));
	  geom.faces.push(new THREE.Face3(0, 1, 3));
	  geom.faces.push(new THREE.Face3(0, 2, 3));
	  geom.faces.push(new THREE.Face3(0, 1, 2));
	  
	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00 });
	  ship = new THREE.Mesh(geom, mat);
	  
	  ship.position.set(0, 0, -10);
	  scene.add(ship);
	}
	
	function makeStar() {
	  var starMaterial = new THREE.MeshBasicMaterial({ color: 0xcccc00 });
	  var sizeMin = 80,
	    sizeMax = 1000;
    var starRadius = Math.floor(Math.random() * (sizeMax - sizeMin) + sizeMin);
    var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
    var star = new THREE.Mesh(starGeometry, starMaterial);
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var minX = camera.position.x - width * 4,
      maxX = camera.position.x + width * 4,
      minY = camera.position.y + height * 4,
      maxY = camera.position.y - height * 4;
    
    star.position.x = Math.floor(Math.random() * (maxX - minX) + minX);
    star.position.y = Math.floor(Math.random() * (maxY - minY) + minY);
    star.position.z = -1 * Math.floor(Math.random() * (spawnMax - spawnMin) + spawnMin);
  
    scene.add(star);
    stars.push(star);
    return star;
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( window.innerWidth, window.innerHeight );
	}
	
	function animate() {
		requestAnimationFrame( animate );

		ray.ray.origin.copy(controls.getObject().position);
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );
		if ( intersections.length > 0 ) {
			var distance = intersections[0].distance;
			if (distance > 0 && distance < 10) {

			}
		}
		
		// update field of stars
    var width = window.innerWidth;
    var height = window.innerHeight;
    
		for (var i = 0; i < stars.length; i++) {
      var star = stars[i];
		  
		  if (star.position.z >= 0) {
		    scene.remove(stars[i]);
		    delete stars[i];
	      stars.splice(i, 1);
	      star = makeStar();
	    }
	    
      star.position.z += 40;	    
		}
		
		ship.position.set(0, 0, -10);
		
		controls.update( Date.now() - time );
		renderer.render( scene, camera );
		time = Date.now();
		stats.update();
	}
});
