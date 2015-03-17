/**
 * @class CharacterGroup
 *
 * @extends Phaser.Group
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
function CharacterGroup(game) {
  Phaser.Group.apply(this, arguments);

  game.physics.arcade.enable(this);

  game.add.existing(this);
}

CharacterGroup.prototype = Object.create(Phaser.Group.prototype);
CharacterGroup.prototype.constructor = CharacterGroup;

module.exports = CharacterGroup;
