define(["jquery-2.0.3.min", "three.min"], function (j$, three) {
  THREE.PointerLockControls = function ( universe ) {
    var camera = universe.camera;
    var ship = universe.ship;
  	var scope = this;
  
  	camera.rotation.set(0, 0, 0);
    ship.mesh.rotation.set(0, 0, 0);
    
  	var pitchObject = new THREE.Object3D();
  	pitchObject.add(camera);
    pitchObject.add(ship.mesh);
    
  	var yawObject = new THREE.Object3D();
  	yawObject.position.y = 10;
  	yawObject.add(pitchObject);
  
  	var moveForward = false;
  	var moveBack = false;
  	var moveLeft = false;
  	var moveRight = false;
  
  	var velocity = new THREE.Vector3();
  
  	var PI_2 = Math.PI / 2;
  
  	var onMouseMove = function ( event ) {
  
  		if ( scope.enabled === false ) return;
  
  		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
  		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
  
  		yawObject.rotation.y -= movementX * 0.002;
  		pitchObject.rotation.x -= movementY * 0.002;
  
  		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
  
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
  
  		return yawObject;
  
  	};
  
  	this.getDirection = function() {
  
  		// assumes the camera itself is not rotated
  
  		var direction = new THREE.Vector3( 0, 0, -1 );
  		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );
  
  		return function( v ) {
  
  			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );
  
  			v.copy( direction ).applyEuler( rotation );
  
  			return v;
  
  		}
  
  	}();
  
  	this.update = function ( delta ) {
  
  		if ( scope.enabled === false ) return;
  
  		delta *= 0.1;
  
  		velocity.x += ( - velocity.x ) * 0.8 * delta;
  		velocity.z += ( - velocity.z ) * 0.8 * delta;
  
  		if ( moveForward ) velocity.z -= 60.0 * delta;
  		if ( moveBack ) velocity.z += 60.0 * delta;
  
  		if ( moveLeft ) velocity.x -= 60.0 * delta;
  		if ( moveRight ) velocity.x += 60.0 * delta;
  
  		yawObject.translateX( velocity.x );
  		yawObject.translateZ( velocity.z);
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
