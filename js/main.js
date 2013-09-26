UniverseA = null;

require([
  "jquery-2.0.3", "three.min", "PointerLockControls", "stats", "universe", "star",
  "ship"
], function ($, three, PointerLockControls, Stats, Universe, Star, Ship) {
  var universeA = new Universe();
  
  for (var i = 0; i < 10; i++) {
    var star = new Star(universeA);
    universeA.stars.push(star);
  }
  universeA.ship = new Ship(universeA);
  universeA.camera.lookAt(universeA.ship.mesh);
  
  universeA.postPopulate();
  universeA.animate();
  console.log("YO");
  UniverseA = universeA;
});
