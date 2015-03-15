var Level = require('../entities/Level');
var Tank = require('../entities/Tank');

function Game() {
  this.player = null;
}

Game.prototype.create = function create() {
	// Give the world gravity, number appears to be arbitrary, 200 taken from examples
	this.game.physics.arcade.gravity.y = 200;

  this.game.stage.backgroundColor = '#71c5cf';

  this.level = new Level(this.game);

  var x = (this.game.width / 2) - 100;
  var y = (this.game.height / 2) - 50;

  this.player = new Tank(this.game, x, y);
  this.player.anchor.setTo(0.5, 0.5);

  this.input.onDown.add(this.onInputDown, this);
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

	for (var i = 0, len = this.player.balls.length; i < len; i++) {
		ball = this.player.balls[i];

		this.game.physics.arcade.collide(ball, this.player); // this will need a callback to indicate something bad happened
		this.game.physics.arcade.collide(ball, this.level.barrierLayer, ball.terrainCollision);
		this.game.physics.arcade.collide(ball, this.level.groundLayer, ball.terrainCollision);
	}
};

Game.prototype.onInputDown = function onInputDown() {

};

module.exports = Game;
