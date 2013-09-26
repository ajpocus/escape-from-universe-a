require([
  "jquery-2.0.3", "three.min", "PointerLockControls", "stats", "universe", "star",
  "ship"
], function ($, three, PointerLockControls, Stats, Universe, Star, Ship) {
  var universeA = new Universe();
  
  for (var i = 0; i < 100; i++) {
    var star = new Star(universeA);
    universeA.stars.push(star);
  }
  ship = new Ship(universeA);
  universeA.camera.lookAt(ship);
  universeA.animate();
});
