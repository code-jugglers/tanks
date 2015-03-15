var Preloader = function (game) {
  this.asset = null;
  this.ready = false;
};

module.exports = Preloader;

Preloader.prototype.preload = function () {
  this.asset = this.add.sprite(320, 240, 'preloader');
  this.asset.anchor.setTo(0.5, 0.5);

  this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
  this.load.setPreloadSprite(this.asset);

  this.load.spritesheet('robot', 'assets/robot.png', 55, 100);
  this.load.image('ground', 'assets/ground.png');
  // this.load.image('barrier', 'assets/barrier.png');
  this.load.image('terrain', 'assets/terrain.png');

  this.game.tanksConfig = require('../data/TanksConfig');
};

Preloader.prototype.create = function () {
  this.asset.cropEnabled = false;
};

Preloader.prototype.update = function () {
  if (!!this.ready) {
    this.game.state.start('Menu');
  }
};

Preloader.prototype.onLoadComplete = function () {
  this.ready = true;
};
