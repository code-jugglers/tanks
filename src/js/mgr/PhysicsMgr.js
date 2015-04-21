var LinkedList = require('../util/LinkedList');

function PhysicsMgr(gameState, game) {
  this.gameState = gameState;
  this.game = game;
  this.entities = new LinkedList();
}

PhysicsMgr.prototype = Object.create(Object.prototype);
PhysicsMgr.constructor = PhysicsMgr;

/**
 * @name register
 *
 * @description
 * Register an Arcade physics body with the manager so collisions can be automatically detected.
 *
 * @param {object} entity - reference to a physics game object
 * @param {int} collisionGroupId - bit flag identifier for this physics entity
 * @param {int} collisionFlags - bit flag of identifiers this object should collide with
 * @param {function} callback - optional callback function to be called within context of entity
 * @param {object} thisArg - optional context to overwrite default callback context
 *
 * @memberof PhysicsMgr
 */
PhysicsMgr.prototype.register = function(entity, collisionGroupId, collisionFlags, callback, thisArg) {
  entity.pmdata = {kill:false};
  this.entities.push({entity:entity, cgid:collisionGroupId, cf:collisionFlags, cb:callback, thisArg:thisArg})
}

PhysicsMgr.prototype.unregister = function(entity) {
  // set a flag so we can lazy delete during the update iterations
  this.entity.pmdata.kill = true;
}

PhysicsMgr.prototype.update = function() {
  var firstNode, first;
  var secondNode, second;

  // Get the first node in the linkedlist of entities
  firstNode = this.entities.head;

  // loop through the list until we read the end
  while (firstNode != null) {
    // Get the data for the first node
    first = firstNode.data;
    // If this entity has been schedule for kill, need to remove it from the list
    if (first.entity.pmdata.kill) {
      this.entities.remove(firstNode);
    }
    else {
      // otherwise start comparing against the other entities in the list
      secondNode = firstNode.next;
      // loop through the list until we read the end
      while (secondNode != null) {
        // Get the data for the second node
        second = secondNode.data;
        // If this entity has been scheduled for kill, remove it from the list
        if (second.entity.pmdata.kill) {
          this.entities.remove(secondNode);
        }
        // Otherwise, check the collisions flags to see if we need to check for a collision
        // The flags are bitwise and'd, only if they share at least one bit, do we compare them
        else if (first.cgid & second.cf) {
          // Check for a collision and then fire the provided callbacks (if any)
          this.game.physics.arcade.collide(first.entity, second.entity, function() {
            if (first.cb) {
              first.cb.call((first.thisArg ? first.thisArg : first.entity), second.entity, second.cgid);
            }
            if (second.cb) {
              second.cb.call((second.thisArg ? second.thisArg : second.entity), first.entity, first.cgid);
            }
          }, null, this);
        }
        // Move onto the next node in the list
        secondNode = secondNode.next;    
      }
    }
    // Move onto the next node in the list
    firstNode = firstNode.next;
  }
}

module.exports = PhysicsMgr;