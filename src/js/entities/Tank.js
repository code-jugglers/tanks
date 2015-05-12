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

  var masks = game.tanksConfig.masks;
  game.physicsmgr.register(this.tank, masks.TANK, masks.BALL | masks.BARRIER, this.postCollision, this);
  game.add.existing(this);
  this.masks = masks;
  this.powerMeter = new PowerMeter(this.game, this);
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
    this.fire();
  }

  //Moar Power!
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.UNDERSCORE)) {
      this.powerMeter.powerManager.lessPower(dt);
  }
  if (this.game.input.keyboard.isDown(Phaser.Keyboard.EQUALS)) {
      this.powerMeter.powerManager.morePower(dt);
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

    //calculate and save, trig can be expensive
    var cos_res = Math.cos(this.barrel.rotation);
    var sin_res = Math.sin(this.barrel.rotation);

    // convert barrel coordinate (group) system to world coordinates as ball is in the world not tank group
    var ball_x = this.x + (this.barrel.x + cos_res * barrel_len) * this.scale.x;
    var ball_y = this.y + this.barrel.y + sin_res * barrel_len;

    var ball = new CannonBall(this.game, ball_x, ball_y);
    ball.owner = this;

    ball.events.onDestroy.add(function() {
      var balls = this.balls;

      balls.splice(balls.indexOf(ball),1);
    }.bind(this), ball);

    ball.shoot(
      ball_x,
      ball_y,
      ball_x + (cos_res * this.powerMeter.powerManager.getPower()) * this.scale.x,
      ball_y + sin_res * this.powerMeter.powerManager.getPower()
    );

    this.balls.push(ball);
  }
};

Tank.prototype.postCollision = function(other, otherCGID) {
  if (otherCGID & this.masks.BARRIER) {
    //need to collide with barrier to prevent people from driving through them, potential
    //if we generate the level properly then this may become a non-issue
  }
  else if (otherCGID & this.masks.BALL) {
    if (other.owner == this) {
      alert("You fucking idiot!");
    }
    else {
      alert("HIT! Points!");
    }
  }
};

/**
*   Power!
*/
function PowerMeter(game, tankGroup) {
  var power = 400;
  var min = 100;    //Adjust me?
  var max = 800;
  var powerVel = 0.5; //== 0.5 power points/ms

  var width = 100;
  var height = 10;

  var xpos = -58;
  var ypos = -44;

  var mask = game.add.graphics(0, 0);
  var maskRect;
  var bmd = game.add.bitmapData(width, height);
  
  function init() {
    for (var i = 0; i < width; i++) {
      var c = Phaser.Color.interpolateColor(0xff0000, 0x00ff00, width, i);
      bmd.rect(i, 0, 1, height, Phaser.Color.getWebRGB(c));
    }

    mask.beginFill(0xffffff);
    maskRect = mask.drawRect(xpos, ypos, getMaskWidth(), height);
  }

  function morePower(dt) {
    power = Math.min(power + powerVel * dt, max);
    update();
  }

  function lessPower(dt) {
    power = Math.max(power - powerVel * dt, min);
    update();
  }

  function update() {
    mask.clear();
    mask.beginFill(0xffffff);
    mask.drawRect(xpos, ypos, getMaskWidth(), height);
  }

  function getPower() {
    return power;
  }

  function getMaskWidth() {
    return (power/max) * width;
  }

  var powerManager = {
    morePower: morePower,
    lessPower: lessPower,
    getPower: getPower
  };

  tankGroup.add(mask);
  var sprite = tankGroup.create(xpos, ypos, bmd);
  //need to assign the mask to the actual sprite
  sprite.mask = mask;

  //so the update code works
  sprite.powerManager = powerManager;

  init();
  return sprite;
}