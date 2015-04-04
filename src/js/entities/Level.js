var Random = require('../util/Random');

var TERRAIN_WIDTH = 25;
var TERRAIN_HEIGHT = 25;

function Level(game) {
  Phaser.Group.apply(this, arguments);

  // Pull out of reference for local use, faster
  var debug = game.tanksConfig.debug;

  // Calculate grid for current world size
  this.mapCols = game.math.snapToCeil(game.width, TERRAIN_WIDTH) / TERRAIN_WIDTH;
  this.mapRows = game.math.snapToCeil(game.height, TERRAIN_HEIGHT) / TERRAIN_HEIGHT;
  this.mapColsHalfWay = Math.floor(this.mapCols/2);

  // Build Tilemap for constructing level
  this.terrainMap = new Phaser.Tilemap(game, null, TERRAIN_WIDTH, TERRAIN_HEIGHT, this.mapCols, this.mapRows);
  this.terrainMap.addTilesetImage('terrain', 'terrain');

  // Build Ground
  this.groundLayer = this.terrainMap.createBlankLayer('ground', this.mapCols, this.mapRows, TERRAIN_WIDTH, TERRAIN_HEIGHT, this);
  this.groundLayer.debug = debug;
  for (var i = 0; i < this.mapCols; i++) {
    this.terrainMap.putTile(0, i, this.mapRows-1, this.groundLayer);    
  }

  // Build Barriers
  this.barrierLayer = this.terrainMap.createBlankLayer('barrier', this.mapCols, this.mapRows, TERRAIN_WIDTH, TERRAIN_HEIGHT, this);
  this.barrierLayer.debug = debug;
  this.generateLevel("this is a seed!");

  // Build array for looping on collision calculations
  this.tileLayers = [this.groundLayer, this.barrierLayer];
  
  // Tiles 0 to 1 are 'collidable'
  this.terrainMap.setCollision([0,1], true, this.groundLayer, false);
  this.terrainMap.setCollision([0,1], true, this.barrierLayer, false);

  var masks = game.tanksConfig.masks;
  game.physicsmgr.register(this.groundLayer, masks.GROUND, masks.BALL);
  game.physicsmgr.register(this.barrierLayer, masks.BARRIER, masks.BALL | masks.TANK);
  
  game.add.existing(this);
}

Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

Level.prototype.update = function() { };

Level.prototype.generateLevel = function(seed) {
  var random = new Random(seed);
  for (var row = 0; row < this.mapRows; row++) {
    if (random.coinFlip()) {
      this.terrainMap.putTile(1, this.mapColsHalfWay, row, this.barrierLayer);
    }
  }
}

module.exports = Level;
