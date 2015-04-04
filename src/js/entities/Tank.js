var CharacterGroup = require('./CharacterGroup');
var CannonBall = require('./CannonBall');

/**
 * @class Tank
 *
 * @extends CharacterGroup
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
function Tank(game, x, y, faceEast) {
  CharacterGroup.call(this, game); //, x, y, 'tank');

  this.x = x;
  this.y = y;
  this.faceEast = faceEast;

  this.game = game;

  this.tank = this.create(0, 0, 'tank');

  this.game.physics.arcade.enable(this.tank);

  this.tank.anchor.setTo(0.5, 0.5);
  this.tank.body.allowGravity = false;
  this.tank.body.collideWorldBounds = true;
  this.tank.body.immovable = true;

  this.barrel = this.create(1, -18, 'tank_barrel');

  // game.physics.arcade.enable(this.barrel);
  this.barrel.anchor.setTo(0, 0.5);

  // this.barrel.body.allowGravity = false;

  this.balls = [];

  if (!this.faceEast) {
    this.scale.x = -1;
  }

  game.add.existing(this);
}

Tank.prototype = Object.create(CharacterGroup.prototype);
Tank.prototype.constructor = Tank;

module.exports = Tank;

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
  // Don't allow movement if it is not the current tanks turn or if a shot has been fired already
  // YOU MUST LIVE WITH THE CONSEQUENCES
  if(!this.active || this.balls.length) { return false; }

  var cursors = this.game.cursors;

  var dt = this.game.time.physicsElapsedMS;

  if (cursors.up.isDown) {
    this.barrel.angle = Math.max(this.barrel.angle + -0.2*dt, -90);
  }
  else if (cursors.down.isDown) {
    this.barrel.angle = Math.min(this.barrel.angle + 0.2*dt, 0);
  }
  
  if(cursors.left.isDown) {
    this.x = Math.max(this.x - 0.2 * dt, 68); //150;
  }
  else if(cursors.right.isDown) {
    this.x = Math.min(this.x + 0.2 * dt, this.game.width-68);
  }

  if(cursors.spaceBar.isDown) {
    this.fire(); // fire cannon ball
  }

  if(this.game.tanksConfig.debug) {
    this.forEach(function(item) {
      this.game.debug.body(item);
    }, this);
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

    var barrel_len = 60;
    var ball_power = 350;
    
    //calculate and save, trig can be expensive
    var cos_res = Math.cos(this.barrel.rotation);
    var sin_res = Math.sin(this.barrel.rotation);

    // convert barrel coordinate (group) system to world coordinates as ball is in the world not tank group
    var ball_x = this.x + (this.barrel.x + cos_res * barrel_len) * this.scale.x;
    var ball_y = this.y + this.barrel.y + sin_res * barrel_len;

    var ball = new CannonBall(this.game, ball_x, ball_y);

    ball.events.onDestroy.add(function() {
      var balls = this.balls;

      balls.splice(balls.indexOf(ball),1);
    }.bind(this), ball);

    ball.shoot(ball_x, ball_y, ball_x + (cos_res * ball_power) * this.scale.x, ball_y + sin_res * ball_power);

    this.balls.push(ball);
  }
};
