$(function () {
  var camera, scene, renderer, controls, ray,
	  time = Date.now(),
	  objects = [],
	  cubes = [],
    frameCount = 0,
    COLORS = [0xCC0000, 0x00CC00, 0x0000CC];

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

    // create a point light
    var light = new THREE.AmbientLight(0x404040);
    light.position.set(0, 50, 130);
    scene.add(light);

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
    frameCount++;
		controls.isOnObject( false );
    var width = window.innerWidth;
    var height = window.innerHeight;
    
		ray.ray.origin.copy(controls.getObject().position);
		ray.ray.origin.y -= 10;

		var intersections = ray.intersectObjects( objects );
		if ( intersections.length > 0 ) {
			var distance = intersections[0].distance;
			if (distance > 0 && distance < 10) {
				controls.isOnObject( true );
			}
		}
		
		if (frameCount % 2 === 0) {
      frameCount = 0;
      var cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xCCCC00 });
      var cubeGeometry = new THREE.CubeGeometry(64, 64, 64);
      var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      
      var maxX = camera.position.x + (width * 4),
        minX = camera.position.x - (width * 4);
      
      cube.position.x = Math.floor(Math.random() * (maxX - minX) + minX);
      
      cube.position.y = height / 8;
      cube.position.z = Math.floor(Math.random() * (maxX - minX) + minX);
  
      scene.add(cube);
      cubes.push(cube);  
    }
    

		controls.update( Date.now() - time );
		renderer.render( scene, camera );
		time = Date.now();
	}
});
