$(function () {
  var camera, scene, renderer, controls, ray, stats,
	  time = Date.now(),
	  objects = [],
	  stars = [],
    frameCount = 0,
    starMin = 1000,
    starMax = 10000;

	var blocker = document.getElementById( 'blocker' );
	var instructions = document.getElementById( 'instructions' );

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		var element = document.body;
		var pointerlockchange = function ( event ) {
			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
				controls.enabled = true;
				blocker.style.display = 'none';
			} else {
				controls.enabled = false;
				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';
				instructions.style.display = '';
			}
		};

		var pointerlockerror = function ( event ) {
			instructions.style.display = '';
		};

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {
			instructions.style.display = 'none';

			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {
				var fullscreenchange = function ( event ) {
					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {
						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}
				};

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || 
				  element.mozRequestFullscreen || 
				  element.mozRequestFullScreen || 
				  element.webkitRequestFullscreen;
				element.requestFullscreen();
			} else {
				element.requestPointerLock();
			}
		}, false );
	} else {
		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
	}

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
      var starMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCC00 });
		  var starRadius = Math.floor(Math.random() * (500 - 250) + 250);
      var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
      var star = new THREE.Mesh(starGeometry, starMaterial);
      
      var minX = camera.position.x - width * 8,
        maxX = camera.position.x + width * 8,
        minY = camera.position.y + height * 8,
        maxY = camera.position.y - height * 8;
      
      star.position.x = Math.floor(Math.random() * (maxX - minX) + minX);
      star.position.y = Math.floor(Math.random() * (maxY - minY) + minY);
      star.position.z = -1 * Math.floor(Math.random() * (starMax - starMin) + starMin);
  
      scene.add(star);
      stars.push(star);
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
		scene.add( controls.getObject() );

		ray = new THREE.Raycaster();
		ray.ray.direction.set( 0, -1, 0 );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );

		document.body.appendChild( renderer.domElement );
		window.addEventListener( 'resize', onWindowResize, false );
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

	      var starMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCC00 });
	      var starRadius = Math.floor(Math.random() * (500 - 250) + 250);
        var starGeometry = new THREE.SphereGeometry(starRadius, 16, 16);
        star = new THREE.Mesh(starGeometry, starMaterial);
        
        var maxZ = camera.position.x + (width * 4),
          minZ = camera.position.x - (width * 4);
        
        star.position.x = Math.floor(Math.random() * (maxZ - minZ) + minZ);
        star.position.y = height / 8;
        star.position.z = -1 * Math.floor(Math.random() * (starMax - starMin) + starMin);
    
        scene.add(star);
        stars.push(star);
	    }
	    
      star.position.z += 20;	    
		}
		
		
		
		controls.update( Date.now() - time );
		renderer.render( scene, camera );
		time = Date.now();
		stats.update();
	}
});
