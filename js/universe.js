define([
  "jquery-2.0.3", "three.min", "stats", "PointerLockControls"
], function (jquery, three, stats, PointerLockControls) {
  var Universe = {
    
    init: function init() {
      var angle = 45,
        aspect = window.innerWidth / window.innerHeight,
        near = 0.1,
        far = 100000;
		  this.camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
		  this.scene = new THREE.Scene();
      // scene.fog = new THREE.Fog(0x000000, 5000, 10000);
      this.time = Date.now();
      this.stars = [];
      
      // create a point light
      this.light = new THREE.AmbientLight(0x404040);
      this.scene.add(this.light);

      this.stats = new Stats();
      this.stats.setMode(0); // 0: fps, 1: ms
      
      // Align top-left
      this.stats.domElement.style.position = 'absolute';
      this.stats.domElement.style.left = '0px';
      this.stats.domElement.style.top = '0px';
      
      document.body.appendChild(this.stats.domElement);
      
      // create field of stars
      var width = window.innerWidth,
        height = window.innerHeight;
      
      this.makeEdge();
      
	    this.controls = new THREE.PointerLockControls(this.camera);
	    this.controls.enabled = true;
		  this.scene.add(this.controls.getObject());
		
		  this.renderer = new THREE.WebGLRenderer();
		  this.renderer.setSize(window.innerWidth, window.innerHeight);

		  document.body.appendChild(this.renderer.domElement);
		  window.addEventListener('resize', this.onWindowResize, false);
	  },
	
	  makeEdge: function makeEdge() {
	    var geom = new THREE.SphereGeometry(50000, 50, 50);
	    var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00, wireframe: true });
	    this.edge = new THREE.Mesh(geom, mat);
	    this.edge.position.set(0, 0, 0);
	    this.scene.add(this.edge);
	  },
	
	  followShip: function followShip() {
	    var pos = this.controls ? this.controls.getObject().position : this.camera.position;
		  ship.mesh.position.set(pos.x, pos.y - 50, pos.z - 100);
	  },
	
	  onWindowResize: function onWindowResize() {
		  this.camera.aspect = window.innerWidth / window.innerHeight;
		  this.camera.updateProjectionMatrix();
		  this.renderer.setSize( window.innerWidth, window.innerHeight );
	  },
	
	  animate: function animate() {
		  requestAnimationFrame( animate );

		  // update field of stars
      var width = window.innerWidth;
      var height = window.innerHeight;
      
		  for (var i = 0; i < this.stars.length; i++) {
        var star = this.stars[i].mesh;
		    
		    if (-100 <= star.position.x && star.position.x <= 100 &&
		        -100 <= star.position.y && star.position.y <= 100 &&
		        -100 <= star.position.z && star.position.z <= 100) {
		      scene.remove(this.stars[i]);
		      delete this.stars[i];
	        this.stars.splice(i, 1);
	        star = new Star(scene);
	        this.stars.push(star);
	        star = star.mesh;
	      }
	      
	      star.lookAt(new THREE.Vector3(0, 0, 0));
	      star.translateZ(100);
        
		  }
		
		  controls.update( Date.now() - this.time );
		  followShip();
		
		  renderer.render( scene, camera );
		  this.time = Date.now();
		  stats.update();
	  }
	  
  };
  
  return Universe;
});
