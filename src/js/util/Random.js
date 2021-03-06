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

Random.prototype.range = function(start, end) {
	return Math.floor(this.rng() * (end - start) + start);
}

Random.prototype.string = function(len) {
	var str = "";
	for (var i = 0; i < len; i++) {
		str += String.fromCharCode(this.range(65, 91));
	}
	return str;
}

module.exports = Random;