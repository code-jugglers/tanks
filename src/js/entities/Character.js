/**
 * @class Character
 *
 * @extends Phaser.Sprite
 *
 * @description
 * Create a character sprite with arcade physics turned on and add it to the game
 *
 * @param {object} game - reference to the game object
 * @param {number} x - x position of character
 * @param {number} y - y position of character
 * @param {string} spriteName - the name of the loaded sprite
 *
 * @constructor
 */
function Character(game, x, y, spriteName) {
  Phaser.Sprite.apply(this, arguments);

  game.physics.arcade.enable(this);
  

  game.add.existing(this);
}

Character.prototype = Object.create(Phaser.Sprite.prototype);
Character.prototype.constructor = Character;

module.exports = Character;
