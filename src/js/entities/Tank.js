var Character = require('./Character'),
    CannonBall = require('./CannonBall');

/**
 * @class Tank
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
 * @constructor
 */
function Tank(game, x, y) {
  Character.call(this, game, x, y, 'tank');

  this.cursors = game.input.keyboard.createCursorKeys();

  this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.body.collideWorldBounds = true;

  this.balls = [];

  game.add.existing(this);
}

Tank.prototype = Object.create(Character.prototype);
Tank.prototype.constructor = Tank;

/**
 * @name update
 *
 * @memberof Tank
 *
 * @description
 * Automatically called by World.update
 * Sets keyboard controls for the player
 */
Tank.prototype.update = function() {
  var cursors = this.cursors;

  if(cursors['left'].isDown) {
    this.body.velocity.x = -200; // move left
  }
  else if(cursors['right'].isDown) {
    this.body.velocity.x = 200; // move right
  }
  else {
    this.body.velocity.x = 0; // stop
  }

  if(this.spaceBar.isDown) {
    this.fire(); // fire cannon ball
  }

  if(this.game.tanksConfig.debug) {
    this.game.debug.body(this);
  }
};

/**
 * @name fire
 *
 * @memberof Tank
 *
 * @description
 * Fire a cannonball
 */
Tank.prototype.fire = function fire() {
  if(!this.balls.length) {
    var ball = new CannonBall(this.game, this.body.x + 135, this.body.y);

    //TODO: this event does not seem to be firing
    ball.events.onDestroy.add(function() {
      var balls = this.balls;

      alert('test');

      //remove from game array
      balls.splice(balls.indexOf(ball),1);
    }.bind(this), ball);

    ball.shoot(100, 200, 200, 0);

    this.balls.push(ball);
  }
};

module.exports = Tank;
