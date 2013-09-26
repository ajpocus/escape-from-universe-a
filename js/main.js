UniverseA = null;

require([
  "jquery-2.0.3", "three.min", "PointerLockControls", "stats", "universe", "star",
  "ship"
], function ($, three, PointerLockControls, Stats, Universe, Star, Ship) {
  var universeA = new Universe();
  
  for (var i = 0; i < 100; i++) {
    var star = new Star(universeA);
    universeA.stars.push(star);
  }
  
  universeA.ship = new Ship(universeA);
  var vec = new THREE.Vector3(0, -10, -100);
  vec.applyMatrix4(universeA.camera.matrixWorld);
  universeA.ship.mesh.position.set(vec.x, vec.y, vec.z);
  universeA.camera.lookAt(universeA.ship.mesh);
  
  universeA.postPopulate();
  universeA.animate();
  UniverseA = universeA;
});
