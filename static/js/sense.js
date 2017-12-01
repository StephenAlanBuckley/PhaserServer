/*
 * A constant list of the levels of sense precision
 */
const PRESENCE = 0
const CROWD = 1
const GOOD = 2

class Sense {

  constructor(creature, width, height, precision, senseDuration, game) {
    this.game = game
    this.width = Math.max(width, 1)
    this.height = Math.max(height, 1)

    this.precision = precision
    //How long do we keep tabs on any sensed creature?
    this.senseDuration

    this.visible = true
    if (this.visible) {
      let my_canvas = game.add.bitmapData(this.width, this.height)
      let canvas_context = my_canvas.context
      canvas_context.strokeStyle = 'white'
      canvas_context.strokeRect(1,1,this.width -2, this.height -2)
      canvas_context.strokeStyle = 'black'
      canvas_context.strokeRect(2,2,this.width -4, this.height -4)
      canvas_context.strokeStyle = 'white'
      canvas_context.strokeRect(3,3,this.width -6, this.height -6)
      this.sprite = game.make.sprite(0, 0, my_canvas)
    } else {
      this.sprite = game.make.sprite(0, 0, null)
    }
    this.sprite.width = this.width
    this.sprite.height = this.height
    this.owner = creature
    creature.sprite.addChild(this.sprite)
    this.sensedCreatures = {}
  }

  update() {
    //resetting closest creature before checking overlaps
    this.closestCreature = null
    this.closestCreatureDistance = Infinity //so it'll always be farther away than any creature
    this.game.physics.arcade.overlap(this.game.creatures, this.sprite, this.senseOnOverlap, this.checkNotOwner, this)
    this.clearCreaturesSensedBefore(this.senseDuration)
  }

  //we'll only actually call the senseOnOverlap function if this returns true
  checkNotOwner(sense, sensedCreature) {
    if (sensedCreature === this.owner) {
      return false
    }
    return true
  }

  //if we're here we can be confident that the sensed creature is someone else!
  senseOnOverlap(sense, sensedCreature) {
    let senseTime = this.game.time.now
    let distanceTo = this.game.physics.arcade.distanceBetween(this.owner, sensedCreature)

    this.sensedCreatures[sensedCreature.uniqueId] = lastSensedAt
    if (this.closestCreature = null || distanceTo < this.closestCreatureDistance) {
      this.closestCreature = sensedCreature;
      this.closestCreatureDistance = distanceTo
    }
  }

  clearCreaturesSensedBefore(lastXSeconds) {
    //pinning time so shit doesn't get too zany
    let baseTime = this.game.time.now
    for (creatureId in this.sensedCreatures) {
      if (baseTime - this.sensedCreatures[creatureId] > lastXSeconds) {
        delete this.sensedCreatures.creatureId
      }
    }
  }

  anyCreaturesSensed() {
    if (Object.keys(this.sensedCreatures).length > 0) {
      return true
    }
    return false
  }

  getNumberOfCreaturesSensed() {
    if (this.precision < CROWD) {
      return false
    }
    return Object.keys(this.sensedCreatures).length
  }

  getClosestCreature() {
    if (this.precision < GOOD) {
      return false
    }
    return this.closestCreature
  }

  /*
   * So, the cost is a bit dicey here
   * Ideally at some point we move all of the cost constants into a file that the game can use to evolve itself
   * So, we want every pixel of sense to cost some amount based on its precision per second
   * On the creature side, this will be paid once every second, not every single update
   *
   * COSTS BY PRECISION PER PIXEL PER SECOND
   * PRESENCE - 0.01
   * CROWD - 0.03
   * GOOD - 0.05
   */
  getPassiveEnergyCost() {
    let cost = this.width * this.height //number of pixels
    cost *= 0.01 + (this.precision * 0.02) //cost per precision
    return cost
  }

}
