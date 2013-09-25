$(function () {
  // set the scene size
  var WIDTH = 1024,
    HEIGHT = 768;

  // set some camera attributes
  var VIEW_ANGLE = 45,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 0.1,
    FAR = 10000;

  // get the DOM element to attach to
  // - assume we've got jQuery to hand
  var $container = $('#container');

  // create a WebGL renderer, camera
  // and a scene
  var renderer = new THREE.WebGLRenderer();
  var camera =
    new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR);

  var scene = new THREE.Scene();
  scene.add(camera);
  camera.position.y = 300;
  camera.position.z = 300;
  renderer.setSize(WIDTH, HEIGHT);
  $container.append(renderer.domElement);

  // create a point light
  var ambientLight = new THREE.AmbientLight(0x404040);

  // set its position
  ambientLight.position.x = 0;
  ambientLight.position.y = 50;
  ambientLight.position.z = 130;

  // add to the scene
  scene.add(ambientLight);
  
  // draw!
  renderer.render(scene, camera);
  
  var stars = [],
    clock = new THREE.Clock();
  var COLORS = [0xCC0000, 0x00CC00, 0x0000CC]; 
  
  (function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, camera);
  })();
});
