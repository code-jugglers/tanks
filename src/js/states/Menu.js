function Menu() {
  this.text = null;
}

Menu.prototype.create =function () {
  var x = this.game.width / 2;
  var y = this.game.height / 2;

  var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

  this.text = this.add.text(x - 200, y - 100, "Press to Start", style);

  this.input.onDown.add(this.onDown, this);
};

Menu.prototype.update = function () {
};

Menu.prototype.onDown = function () {
  this.game.state.start(playerState.currentLevel);
};

module.exports = Menu;
