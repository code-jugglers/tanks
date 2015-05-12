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
  this.mapRowsHalfWay = Math.floor(this.mapRows/2);

  this.debounce = false;

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
  game.physicsmgr.register(this.groundLayer, masks.GROUND, masks.BALL | masks.TANK);
  game.physicsmgr.register(this.barrierLayer, masks.BARRIER, masks.BALL | masks.TANK);
  
  game.add.existing(this);
}

Level.prototype = Object.create(Phaser.Group.prototype);
Level.prototype.constructor = Level;

Level.prototype.update = function() {
  var dt = this.game.time.physicsElapsedMS;

  if (this.debounce) {
    this.elapsed += dt;
    if (this.elapsed > 500) {
      this.debounce = false;
    }
  }

  if (this.game.input.keyboard.isDown(Phaser.Keyboard.R) && !this.debounce) {
    this.elapsed = 0;
    this.debounce = true;
    for (var i = 0; i < this.mapCols; i++) {
      for (var j = 0; j < this.mapRows; j++) {
        this.terrainMap.removeTile(i, j, this.barrierLayer);    
      }
    }
    var newDeterministicSeed = this.random.string(16);
    this.generateLevel(newDeterministicSeed);
    console.log("Generated with: " + newDeterministicSeed);
  }
};

Level.prototype.generateLevel = function(seed) {
  this.random = new Random(seed);

  var numClusters = this.random.range(10, 20);
  // console.log("Number of Clusters: " + numClusters);
  for (var cluster = 0; cluster < numClusters; cluster++) {
    // console.log("Cluster #" + cluster);
    var startRow = this.random.range(0, this.mapRows);
    var startCol = this.random.range(0, this.mapCols);

    this.buildCluster(startCol, startRow);
  }
}

Level.prototype.buildCluster = function(x, y) {
  var clusterSize = this.random.range(6, 14);
  // console.log("  Size: " + clusterSize);
  this.mirror(x, y);
  // console.log("  Block 0: (" + x + "," + y + ")");
  for (var i = 1; i < clusterSize; i++) {
    switch (this.random.range(0,4)) {
      case 0: x++; break;
      case 1: x--; break;
      case 2: y++; break;
      case 3: y--; break;
    }
    // console.log("  Block " + i + ": (" + x + "," + y + ")");
    this.mirror(x, y);
  }
}

/**
 * Mirror a block placement if it isn't in the middle of the level.
 */
Level.prototype.mirror = function(column, row) {
  this.safePut(1, column, row, this.barrierLayer);
  if (column !== this.mapColsHalfWay) {
    this.safePut(1, this.mapCols-column-1, row, this.barrierLayer);
  }
}

Level.prototype.safePut = function(tile, x, y, layer) {
  // stay on the game map
  if (x < 0 || x > this.mapCols || y < 0 || y > (this.mapRows-2)) {
    return;
  }
  // protect tank space
  if ((x < 12 || x > (this.mapCols-13)) && y > (this.mapRows-10)) {
    return;
  }

  if (this.terrainMap.getTile(x, y) === null) {
    this.terrainMap.putTile(tile, x, y, layer);
  }
}

module.exports = Level;
