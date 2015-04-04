var Character = require('./Character');

var MAX_HITS = 3;

function CannonBall(game, x, y) {
  Character.call(this, game, x, y, 'ball');

  this.game = game;

  this.hits = 0;
  this.tankHit = false;

  this.anchor.setTo(0.5, 0.5);

  // Start arbitrary, it feels like a cannon ball physics
  this.body.bounce.setTo(0.7, 0.7);
  this.body.drag.x = 10;
  this.body.drag.y = 10;
  this.body.mass = 10;		// 10x more massive than player
  // End arbitrary, i am god

  this.checkWorldBounds = true;
  // this.outOfBoundsKill = true;

  this.masks = game.tanksConfig.masks;
  game.physicsmgr.register(this, this.masks.BALL, this.masks.BALL, this.postCollision);

  game.add.existing(this);
}

CannonBall.prototype = Object.create(Character.prototype);
CannonBall.prototype.constructor = CannonBall;

module.exports = CannonBall;

CannonBall.prototype.update = function() {
  if (this.game.tanksConfig.debug) {
    this.game.debug.body(this);
  }

  if(!this.inWorld || this.hits >= MAX_HITS) {
    this.game.events.turnEnded.dispatch(this);
    this.destroy();
  }
  else if (this.tankHit) {
    // Maybe do something different here eventually
    // Hit/damage logic should happen in tank collision handler
    this.game.events.turnEnded.dispatch(this);
    this.destroy(); 
  }
};

CannonBall.prototype.postCollision = function(other, otherCGID) {
  if (otherCGID & this.masks.GROUND || otherCGID & this.masks.BARRIER) {
    this.hits++;
  }
  else if (otherCGID & this.masks.TANK) {
    this.tankHit = true;
  }
};

/**
 * @name shoot
 *
 * @description
 * Given the source of the cannon ball (x1,y1), shoot it
 * towards the destination (x2,y2) in world coordinates.
 */
CannonBall.prototype.shoot = function(x1, y1, x2, y2) {
  //CMH: Right now, simple vector calc, can apply multiplier for MOAR POWER!
  this.body.velocity.setTo(x2-x1, y2-y1);
};