'use strict';

var game = new Phaser.Game(1025, 600, Phaser.AUTO, 'robo-game');

window.playerState = {
  currentLevel: 'Game'
};

game.state.add('Boot', require('./states/Boot'));
game.state.add('Splash', require('./states/Splash'));
game.state.add('Preloader', require('./states/Preloader'));
game.state.add('Menu', require('./states/Menu'));
game.state.add('Game', require('./states/Game'));

game.state.start('Boot');
