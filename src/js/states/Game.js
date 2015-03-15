var Level = require('../entities/Level');
var Player = require('../entities/Player');

function Game() {
  this.player = null;
}

Game.prototype.create = function create() {

  this.level = new Level(this.game);

  var x = (this.game.width / 2) - 100;
  var y = (this.game.height / 2) - 50;


  this.player = new Player(this.game, x, y);

  this.player.anchor.setTo(0.5, 0.5);

  this.input.onDown.add(this.onInputDown, this);
};

Game.prototype.update = function update() {
	this.game.physics.arcade.collide(this.player, this.level);
	
	//CMH: don't like this but the array wouldn't work for some reason
	this.game.physics.arcade.collide(this.player, this.level.groundLayer);
	this.game.physics.arcade.collide(this.player, this.level.barrierLayer);
};

Game.prototype.onInputDown = function onInputDown() {
  this.game.state.start('Menu');
};

module.exports = Game;
