require([
  "jquery-2.0.3", "three.min", "PointerLockControls", "stats", "universe", "star",
  "ship"
], function ($, three, PointerLockControls, Stats, Universe, Star, Ship) {
  Universe.init();
  
  for (var i = 0; i < 100; i++) {
    star = new Star(Universe.scene);
    Universe.stars.push(Universe.star);
  }
  ship = new Ship(Universe.scene);
  Universe.camera.lookAt(ship);
  
  Universe.animate();
});
