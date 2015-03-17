var CharacterGroup = require('./CharacterGroup'),
    CannonBall = require('./CannonBall');

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
function Tank(game, x, y) {
  CharacterGroup.call(this, game); //, x, y, 'tank');

  this.cursors = game.input.keyboard.createCursorKeys();
  this.spaceBar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  this.tank = this.create(x, y, 'tank');
  game.physics.arcade.enable(this.tank);
  this.tank.anchor.setTo(0.5, 0.5);
  this.tank.body.allowGravity = false;
  this.tank.body.collideWorldBounds = true;

  this.barrel = this.create(x+1, y-18, 'tank_barrel');
  // game.physics.arcade.enable(this.barrel);
  this.barrel.anchor.setTo(0, 0.5);
  // this.barrel.body.allowGravity = false;

  this.balls = [];

  game.add.existing(this);
}

Tank.prototype = Object.create(CharacterGroup.prototype);
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

  var dt = this.game.time.physicsElapsedMS;

  if (cursors['up'].isDown) {
    this.barrel.angle = Math.max(this.barrel.angle + -0.2*dt, -90);
  }
  else if (cursors['down'].isDown) {
    this.barrel.angle = Math.min(this.barrel.angle + 0.2*dt, 0);
  }
  
  if(cursors['left'].isDown) {
    this.tank.body.velocity.x = -200; // move left
    this.barrel.x = this.tank.x-6; // so this updates the barrel to match the tank, but neg here pos to go right, lag? should just be an offset
  }
  else if(cursors['right'].isDown) {
    this.tank.body.velocity.x = 200; // move right
    this.barrel.x = this.tank.x+6;
  }
  else {
    this.tank.body.velocity.x = 0; // stop
    // this.barrel.body.velocity.x = 0; // stop
  }

  if(this.spaceBar.isDown) {
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

    var ball_x = this.barrel.x + cos_res * barrel_len;
    var ball_y = this.barrel.y + sin_res * barrel_len;

    var ball = new CannonBall(this.game, ball_x, ball_y);

    ball.events.onDestroy.add(function() {
      var balls = this.balls;
      balls.splice(balls.indexOf(ball),1);
    }.bind(this), ball);

    ball.shoot(ball_x, ball_y, ball_x + cos_res * ball_power, ball_y + sin_res * ball_power);

    this.balls.push(ball);
  }
};

module.exports = Tank;
