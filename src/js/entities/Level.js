var TERRAIN_WIDTH = 50;
var TERRAIN_HEIGHT = 50;

function Level(game) {
  Phaser.Group.apply(this, arguments);

  // Pull out of reference for local use, faster
  var debug = game.tanksConfig.debug;

  // Calculate grid for current world size
  this.mapCols = game.math.snapToCeil(game.width, TERRAIN_WIDTH) / TERRAIN_WIDTH;
  this.mapRows = game.math.snapToCeil(game.height, TERRAIN_HEIGHT) / TERRAIN_HEIGHT;

  // Build Tilemap for constructing level
  this.terrainMap = new Phaser.Tilemap(game, null, TERRAIN_WIDTH, TERRAIN_HEIGHT, this.mapCols, this.mapRows);
  this.terrainMap.addTilesetImage('terrain', 'terrain');

  // Tiles 0 to 1 are 'collidable'
  this.terrainMap.setCollisionBetween(0, 1, true);

  var i;

  // Build Ground
  this.groundLayer = this.terrainMap.createBlankLayer('ground', this.mapCols, this.mapRows, TERRAIN_WIDTH, TERRAIN_HEIGHT, this);
  this.groundLayer.debug = debug;
  for (i = 0; i < this.mapCols; i++) {
    this.terrainMap.putTile(0, i, this.mapRows-1, this.groundLayer);    
  }

  // Build Barriers
  this.barrierLayer = this.terrainMap.createBlankLayer('barrier', this.mapCols, this.mapRows, TERRAIN_WIDTH, TERRAIN_HEIGHT, this);
  this.barrierLayer.debug = debug;
  for (i = 0; i < 3; i++) {
    this.terrainMap.putTile(1, Math.floor(this.mapCols/2), 3 + i, this.barrierLayer);
  }

  // Build array for looping on collision calculations
  this.tileLayers = [this.groundLayer, this.barrierLayer];
  
  game.add.existing(this);
}

Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

Level.prototype.update = function() { };

module.exports = Level;
