define([
  "jquery-2.0.3", "three.min", "stats", "PointerLockControls", "ship", "star"
], function (jquery, three, stats, PointerLockControls, Ship, Star) {
  var camera, scene, renderer, controls, ray, stats, ship, edge,
	  time = Date.now(),
	  objects = [],
	  stars = [],
    frameCount = 0;
    
	init();
	animate();

	function init() {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100000 );
		scene = new THREE.Scene();
    // scene.fog = new THREE.Fog(0x000000, 5000, 10000);
    
    // create a point light
    var light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    document.body.appendChild(stats.domElement);
    

    // create field of stars
    var width = window.innerWidth,
      height = window.innerHeight;
    
    makeEdge(); 
    scene.edge = edge;
    for (var i = 0; i < 100; i++) {
      star = new Star(scene);
      stars.push(star);
    }
    ship = new Ship(scene);
    camera.lookAt(ship);
	  
	  controls = new THREE.PointerLockControls(camera);
	  controls.enabled = true;
		scene.add(controls.getObject());
		
		ray = new THREE.Raycaster();
		ray.ray.direction.set(0, -1, 0);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);

		document.body.appendChild(renderer.domElement);
		window.addEventListener('resize', onWindowResize, false);
	}
	
	function makeEdge() {
	  var geom = new THREE.SphereGeometry(50000, 50, 50);
	  var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00, wireframe: true });
	  edge = new THREE.Mesh(geom, mat);
	  edge.position.set(0, 0, 0);
	  scene.add(edge);
	}
	
	function followShip() {
	  var pos = controls ? controls.getObject().position : camera.position;
		ship.mesh.position.set(pos.x, pos.y - 50, pos.z - 100);
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
    var pos = controls ? controls.getObject().position : camera.position;

    var vecIdx = Math.floor(Math.random() * edge.geometry.vertices.length);
    var vec = edge.geometry.vertices[vecIdx];
    
    var zSub = 20000;
    var randZ = vec.z - Math.floor(Math.random() * zSub);
    star.position.set(vec.x, vec.y, randZ);
    
    scene.add(star);
    
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
      var star = stars[i].mesh;
		  
		  if (-100 <= star.position.x && star.position.x <= 100 &&
		      -100 <= star.position.y && star.position.y <= 100 &&
		      -100 <= star.position.z && star.position.z <= 100) {
		    scene.remove(stars[i]);
		    delete stars[i];
	      stars.splice(i, 1);
	      star = makeStar();
	    }
	    
	    star.lookAt(new THREE.Vector3(0, 0, 0));
	    star.translateZ(100);
      
		}
		
		controls.update( Date.now() - time );
		followShip();
		
		renderer.render( scene, camera );
		time = Date.now();
		stats.update();
	}
});
