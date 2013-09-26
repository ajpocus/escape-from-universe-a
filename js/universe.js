define([
  "jquery-2.0.3", "three.min", "stats", "PointerLockControls", "star",
], function (jquery, three, stats, PointerLockControls, Star) {
  function Universe() {
    var angle = 75,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 100000;
	  this.camera = new THREE.PerspectiveCamera(angle, aspect, near, far);
	  this.scene = new THREE.Scene();
    // this.scene.fog = new THREE.Fog(0xffffff, 5000, 10000);
    this.time = Date.now();
    this.stars = [];
    
    // create a point light
    this.light = new THREE.AmbientLight(0xffffff);
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
  }
  
  Universe.prototype.postPopulate = function () {
    this.controls = new THREE.PointerLockControls(this.camera);
    this.controls.enabled = true;
	  this.scene.add(this.controls.getObject());
	
	  this.renderer = new THREE.WebGLRenderer();
	  this.renderer.setSize(window.innerWidth, window.innerHeight);

	  document.body.appendChild(this.renderer.domElement);
	  window.addEventListener('resize', this.onWindowResize.bind(this), false);
  };
	
	Universe.prototype.makeEdge = function makeEdge() {
    var geom = new THREE.SphereGeometry(50000, 50, 50);
    var mat = new THREE.MeshBasicMaterial({ color: 0x00cc00, wireframe: true });
    this.edge = new THREE.Mesh(geom, mat);

    this.scene.add(this.edge);
    console.log(this.edge);
  };

  Universe.prototype.followShip = function followShip() {
    var pos = this.controls ? this.controls.getObject().position : this.camera.position;
	  ship.mesh.position.set(pos.x, pos.y - 50, pos.z - 100);
  };

  Universe.prototype.onWindowResize = function onWindowResize() {
	  this.camera.aspect = window.innerWidth / window.innerHeight;
	  this.camera.updateProjectionMatrix();
	  this.renderer.setSize( window.innerWidth, window.innerHeight );
  };

  Universe.prototype.animate = function animate() {
	  requestAnimationFrame(this.animate.bind(this));
    
	  // update field of stars
	  Star.updateStars(this);
    
	  this.controls.update(Date.now() - this.time);
	  this.followShip();
    
	  this.renderer.render(this.scene, this.camera);
	  this.time = Date.now();
	  this.stats.update();
  };

  return Universe;
});
