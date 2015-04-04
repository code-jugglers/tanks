function PhysicsMgr(gameState, game) {
  this.gameState = gameState;
  this.game = game;

  this.entities = [];
}

PhysicsMgr.prototype = Object.create(Object.prototype);
PhysicsMgr.constructor = PhysicsMgr;

PhysicsMgr.prototype.register = function(entity, collisionGroupId, collisionFlags, callback, thisArg) {
  this.entities.push({entity:entity, cgid:collisionGroupId, cf:collisionFlags, cb:callback, thisArg:thisArg})
}

PhysicsMgr.prototype.unregister = function(entity) {

}

PhysicsMgr.prototype.update = function() {
  var entityLen = this.entities.length;
  var first;
  var second;

  // This loop will compare each object with every other exactly once... I think.
  for (var i = 0; i < entityLen; i++) {
    first = this.entities[i];
    for (var j = i+1; j < entityLen; j++) {
      second = this.entities[j];
      if (first.cf & second.cf) {
        this.game.physics.arcade.collide(first.entity, second.entity, function() {
          if (first.cb) {
            first.cb.call((first.thisArg ? first.thisArg : first.entity), second.entity, second.cgid);
          }
          if (second.cb) {
            second.cb.call((second.thisArg ? second.thisArg : second.entity), first.entity, first.cgid);
          }
        }, null, this);
      }
    }
  }
}

module.exports = PhysicsMgr;