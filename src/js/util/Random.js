var seedrandom = require('seedrandom');

function Random(seed) {
	this.rng = seedrandom(seed);
}

Random.prototype = Object.create(Object.prototype);
Random.constructor = Random;

Random.prototype.seed = function(seed) {
	this.rng = seedrandom(seed);
}

Random.prototype.coinFlip = function() {
	return (this.rng() < 0.5);
}

module.exports = Random;