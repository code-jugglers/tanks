var Level = require('../entities/Level');
var Tank = require('../entities/Tank');
var PhysicsMgr = require('../mgr/PhysicsMgr');

/**
 * @name Game
 *
 * @description
 * The main game stage
 *
 * @constructor
 */
function Game() {
  this.players = {};
}

module.exports = Game;

/**
 * @name create
 *
 * @memberof Game
 */
Game.prototype.create = function create() {
	// Give the world gravity, number appears to be arbitrary, 200 taken from examples
	this.game.physics.arcade.gravity.y = 200;

  this.game.stage.backgroundColor = '#71c5cf'; // set background color

  // Create physics manager/helper
	this.game.physicsmgr = new PhysicsMgr(this, this.game);

  // create the game keys. directional arrow ans space bar
  this.game.cursors = this.game.input.keyboard.createCursorKeys();
  this.game.cursors.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.level = new Level(this.game); // create the level

  this.game.events = {}; // empty events object

  this.game.events.turnEnded = new Phaser.Signal(); // create new signal for a turn ending

  // Players object, contains all potential players
  this.players = {
    1: new Tank(this.game, 100, this.game.height-50, true),
    2: new Tank(this.game, this.game.width-100, this.game.height-50, false)
  };

  this.players[Math.floor(Math.random() * 2) + 1].active = true; // randomly select the first player

  this.game.events.turnEnded.add(swapActivePlayer.bind(this)); // listen for the turn ended event and swap active player

  /**
   * @name swapActivePlayer
   *
   * @description
   * swap which player is active
   *
   * @memberof create
   */
  function swapActivePlayer() {
    this.players['1'].active = !this.players['1'].active;
    this.players['2'].active = !this.players['2'].active;
  }
};

/**
 * @name update
 *
 * @memberof Game
 */
Game.prototype.update = function update() {
	this.game.physicsmgr.update();
};
