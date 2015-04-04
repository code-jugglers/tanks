var Level = require('../entities/Level');
var Tank = require('../entities/Tank');

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

  // create the game keys. directional arrow ans space bar
  this.game.cursors = this.game.input.keyboard.createCursorKeys();
  this.game.cursors.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.level = new Level(this.game); // create the level

  this.game.events = {}; // empty events object

  this.game.events.turnEnded = new Phaser.Signal(); // create new signal for a turn ending

  var x = (this.game.width / 2) - 100;
  var y = (this.game.height / 2) - 50;

  // Players object, contains all potential players
  this.players = {
    1: new Tank(this.game, x, this.game.height-75, true),
    2: new Tank(this.game, x + 300, this.game.height-75, false)
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
  for(var player in this.players) {
    if(this.players.hasOwnProperty(player)) {
      _playerPhysics(this.game, this.level, this.players[player]);
    }
  }
};

/**
 * @name _playerPhysics
 *
 * @description
 * Add collisions to the players, the connon balls, and the level environment
 *
 * @param {object} game - the game object
 * @param {object} level - the generated level
 * @param {object} player - the player object
 *
 * @memberof Game
 *
 * @private
 */
function _playerPhysics(game, level, player) {
  //CMH: The Arcade collision mechanisms isn't exactly great, need better system to apply
  //DRB: What is this bit actually doing? it doesn't seem to do anything if I comment it out...
  //generically to the world
  game.physics.arcade.collide(player, level);

  //same down here
  _levelCollision(game, level, player);

  var ball;

  for (var i = 0, len = player.balls.length; i < len; i++) {
    ball = player.balls[i];

    game.physics.arcade.collide(ball, player); // this will need a callback to indicate something bad happened\

    _levelCollision(game, level, ball, ball.terrainCollision);
  }
}

/**
 * @name _levelCollision
 *
 * @description
 * set collisions with all things in the level and something else
 *
 * @param {object} game - the game object
 * @param {level} level - the level object
 * @param {object} thingy - something to collide with
 * @param {function} [cb] - OPTIONAL callback to be called when collision occurs
 *
 * @memberof Game
 *
 * @private
 */
function _levelCollision(game, level, thingy, cb) {
  for(var platform in level) {
    if(level.hasOwnProperty(platform)) {
      game.physics.arcade.collide(thingy, level[platform], (cb || null));
    }
  }
}
