$(function () {
  var camera, scene, renderer, controls, ray, stats,
	  time = Date.now(),
	  objects = [],
	  stars = [],
    frameCount = 0,
    starMin = 6000,
    starMax = 10000;

	

	init();
	animate();

	function init() {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000 );
		scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5000, 10000)
    
    // create a point light
    var light = new THREE.AmbientLight(0x404040);
    light.position.set(0, 50, 130);
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
      
    for (var i = 0; i < 100; i++) {
      makeStar();
    }
    
    // player's triangle
    var geom = new THREE.Geometry();
    var v1 = new THREE.Vector3(0,0,0);
    var v2 = new THREE.Vector3(20,0,0);
    var v3 = new THREE.Vector3(10,20,0);
    
    console.log(geom.vertices)
    geom.vertices.push(new THREE.Vertex(v1));
    geom.vertices.push(new THREE.Vertex(v2));
    geom.vertices.push(new THREE.Vertex(v3));
    
    geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
    geom.computeFaceNormals();
    
    var triangle = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
    triangle.position.x = camera.position.x;
    triangle.position.y = camera.position.y;
    
    scene.add(triangle);

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
	
	function makeStar() {
	  var starMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCC00 });
    var starRadius = Math.floor(Math.random() * (500 - 250) + 250);
    var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
    star = new THREE.Mesh(starGeometry, starMaterial);
    
    var width = window.innerWidth;
    var height = window.innerHeight;
    var minX = camera.position.x - width * 8,
      maxX = camera.position.x + width * 8,
      minY = camera.position.y + height * 8,
      maxY = camera.position.y - height * 8;
    
    star.position.x = Math.floor(Math.random() * (maxX - minX) + minX);
    star.position.y = Math.floor(Math.random() * (maxY - minY) + minY);
    star.position.z = -1 * Math.floor(Math.random() * (starMax - starMin) + starMin);
  
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
		controls.isOnObject( false );
    
		ray.ray.origin.copy(controls.getObject().position);
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );
		if ( intersections.length > 0 ) {
			var distance = intersections[0].distance;
			if (distance > 0 && distance < 10) {
				controls.isOnObject( true );
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
	    
      star.position.z += 30;	    
		}
		
		controls.update( Date.now() - time );
		renderer.render( scene, camera );
		time = Date.now();
		stats.update();
	}
});
