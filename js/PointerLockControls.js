define(["jquery-2.0.3.min", "three.min"], function (j$, three) {
  THREE.PointerLockControls = function ( universe ) {
    var camera = universe.camera;
    var ship = universe.ship;
  	var scope = this;

    // initialize with neutral rotation
  	camera.rotation.set(0, 0, 0);
    ship.mesh.rotation.set(0, 0, 0);
    camera.rotation.order = "YXZ";
    ship.mesh.rotation.order = "YXZ";
    
    // initialize movement flags for the update loop
  	var moveForward = false;
  	var moveBack = false;
  	var moveLeft = false;
  	var moveRight = false;
  
    // initialize an empty velocity vector
  	var velocity = new THREE.Vector3();
    
    // save pi/2 for later calculation; represents 180-degree view (-pi/2, pi/2)
  	var PI_2 = Math.PI / 2;
  
    // captures relative mouse movements using the mouse capture API
  	var onMouseMove = function ( event ) {
      // do nothing if controls are disabled
  		if ( scope.enabled === false ) return;
  
      // get the relative mouse movement
  		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
      
      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
  		camera.rotation.y -= movementX * 0.001;
  		camera.rotation.x -= movementY * 0.001;
  		camera.rotation.x = Math.max( - PI_2, Math.min( PI_2, camera.rotation.x ) );
  	};
  
  	var onKeyDown = function ( event ) {
  
  		switch ( event.keyCode ) {
  
  			case 38: // up
  			case 87: // w
  				moveForward = true;
  				break;
  
  			case 37: // left
  			case 65: // a
  				moveLeft = true; break;
  
  			case 40: // down
  			case 83: // s
  				moveBack = true;
  				break;
  
  			case 39: // right
  			case 68: // d
  				moveRight = true;
  				break;
  		}
  
  	};
  
  	var onKeyUp = function ( event ) {
  
  		switch( event.keyCode ) {
  
  			case 38: // up
  			case 87: // w
  				moveForward = false;
  				break;
  
  			case 37: // left
  			case 65: // a
  				moveLeft = false;
  				break;
  
  			case 40: // down
  			case 83: // a
  				moveBack = false;
  				break;
  
  			case 39: // right
  			case 68: // d
  				moveRight = false;
  				break;
  
  		}
  
  	};
  
  	document.addEventListener( 'mousemove', onMouseMove, false );
  	document.addEventListener( 'keydown', onKeyDown, false );
  	document.addEventListener( 'keyup', onKeyUp, false );
  
  	this.enabled = false;
  
  	this.getObject = function () {
  		return camera;
  	};
  
  	this.update = function ( delta ) {
  		if ( scope.enabled === false ) return;
  
  		delta *= 0.1;
  
  		velocity.x += ( - velocity.x ) * 0.8 * delta;
  		velocity.z += ( - velocity.z ) * 0.8 * delta;
  
      var speed = 50.0;
  		if ( moveForward ) velocity.z -= speed * delta;
  		if ( moveBack ) velocity.z += speed * delta;
  
  		if ( moveLeft ) velocity.x -= speed * delta;
  		if ( moveRight ) velocity.x += speed * delta;

      camera.translateX(velocity.x);		
  		camera.translateZ(velocity.z);
  	};
  
  };
  
  $(function () {
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );
    
    // http://www.html5rocks.com/en/tutorials/pointerlock/intro/
    
    var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
    
    if ( havePointerLock ) {
    	var element = document.body;
    	var pointerlockchange = function ( event ) {
    		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
    			blocker.style.display = 'none';
    		} else {
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
  });
});
