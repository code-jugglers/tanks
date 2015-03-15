var Character = require('./Character');

/**
 * @class Player
 *
 * @extends Character
 *
 * @description
 * Create the player character with keyboard controls
 *
 * @param {object} game - reference to the game object
 * @param {number} x - the x position of the player
 * @param {number} y - the y position of the player
 *
 *
 * @constructor
 */
function Player(game, x, y) {
  Character.call(this, game, x, y, 'robot');

  this.cursors = game.input.keyboard.createCursorKeys();

  this.body.collideWorldBounds = true;

  // Left animation
  this.animations.add('player-left', [0, 1], 12, true);

  // Idle animation
  this.animations.add('player-idle', [2, 3], 12, true);

  // Right animation
  this.animations.add('player-right', [4, 5], 12, true);

  game.add.existing(this);
}

Player.prototype = Object.create(Character.prototype);
Player.prototype.constructor = Player;

/**
 * @name update
 *
 * @description
 * Automatically called by World.update
 * Sets keyboard controls for the player
 */
Player.prototype.update = function() {
  var cursors = this.cursors;

  if (key('left')) {
    this.body.velocity.x = -200;

    this.animations.play('player-left');
  }
  else if (key('right')) {
    this.body.velocity.x = 200;

    this.animations.play('player-right');
  }
  else {
    this.body.velocity.x = 0;

    this.animations.play('player-idle');
  }

  if (key('up')) {
    this.body.velocity.y = -200;
  }
  else if (key('down')) {
    this.body.velocity.y = 200;
  }
  else {
    this.body.velocity.y = 0;
  }

  /**
   * @name key
   *
   * @param {string} dir - the key direction to check
   *
   * @return {boolean}
   */
  function key(dir) {
    return cursors[dir].isDown;
  }

  if (this.game.tanksConfig.debug) {
    this.game.debug.body(this);  
  }
  
};

module.exports = Player;
