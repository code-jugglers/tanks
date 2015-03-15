var Level = require('../entities/Level');
var Player = require('../entities/Player');
var CannonBall = require('../entities/CannonBall');

function Game() {
  this.player = null;
}

Game.prototype.create = function create() {
	// Give the world gravity, number appears to be arbitrary, 200 taken from examples
	this.game.physics.arcade.gravity.y = 200;

  this.level = new Level(this.game);

  var x = (this.game.width / 2) - 100;
  var y = (this.game.height / 2) - 50;

  this.player = new Player(this.game, x, y);
  this.player.anchor.setTo(0.5, 0.5);

  this.input.onDown.add(this.onInputDown, this);

  //CMH: Temporary, balls shouldn't be game global, attached to player/tank
  this.balls = [];
};

Game.prototype.update = function update() {
	//CMH: The Arcade collision mechanisms isn't exactly great, need better system to apply
	//generically to the world
	this.game.physics.arcade.collide(this.player, this.level);
	
	//CMH: don't like this but the array wouldn't work for some reason
	this.game.physics.arcade.collide(this.player, this.level.groundLayer);
	this.game.physics.arcade.collide(this.player, this.level.barrierLayer);

	//CMH: so looping through all balls in play, really only one (maybe?) in final play so may
	//not need all this crap and it may need to be moved elsewhere, here now for physics engine
	var ball;
	for (var i = 0; i < this.balls.length; i++) {
		ball = this.balls[i];
		this.game.physics.arcade.collide(ball, this.player); // this will need a callback to indicate something bad happened
		this.game.physics.arcade.collide(ball, this.level.barrierLayer, ball.terrainCollision);
		this.game.physics.arcade.collide(ball, this.level.groundLayer, ball.terrainCollision);
	}
};

Game.prototype.onInputDown = function onInputDown() {
	//CMH: Just proof-of-concept, need to integrate this with player/tank
  var ball = new CannonBall(this.game, this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);

  //CMH: not a huge fan of this style cleanup, probably should use a "Group" and use object recycling like good little engrs
  ball.gameObj = this;
  ball.events.onDestroy.add(function() {
  	var balls = ball.gameObj.balls;
  	//remove from game array
  	balls.splice(balls.indexOf(ball),1);
  	//remove reference to gameObj from ball for GC
  	delete ball.gameObj;
  }, ball);

  //source of shot, destination of shot, this shoots up and to the right
  ball.shoot(100, 100, 200, 0);
  this.balls.push(ball);
};

module.exports = Game;
