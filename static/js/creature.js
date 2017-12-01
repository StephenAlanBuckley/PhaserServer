const COURSE_ADJUSTMENT = (270 * Math.PI) /180
const MAX_SPEED = 1000

class Creature {

  constructor(game, givenDNA = false) {
    this.game = game
    this.basicActions = []

    if (!givenDNA) {
      this.chromosome = new Chromosome(true)
    } else {
      this.chromosome = new Chromosome(false, givenDNA)
    }

    this.chromosomeIndex = 0

    //well, that's not true at all but w/e
    this.uniqueId = Math.floor((Math.random() * 1000000000))

    this.timeToPayForSenses = 0
    this.senses = []
    this.responses = []
    this.energyPackets = []
    this.energy = 0

    this.wasAbsorbing = false
    this.absorbing = false
    this.currentSpeed = 0

    this.width = Math.max(parseInt(this.getNextNucleotideSequenceOfLength(2)), 1)
    this.height = this.width //parseInt(this.getNextNucleotideSequenceOfLength(2)
    this.dead = false

    this.createBodyImage(this.getNextNucleotideSequenceOfLength(10))
    this.createBasicActions(this.getNextNucleotideSequenceOfLength(60))
    this.seedEnergy(100)
    this.basicActionIndex = 0
    this.timeICanActAgain = 0
    this.thisTurnsCost = 0
    this.weight = this.width * this.height
    this.sprite.position.x = Math.floor(Math.random() * game.world.bounds.width) + game.world.bounds.x
    this.sprite.position.y = Math.floor(Math.random() * game.world.bounds.height) + game.world.bounds.y

    this.createSenses(this.getNextNucleotideSequenceOfLength(9))

    this.born = this.game.time.now
    this.age = 0
  }

  getNextNucleotideSequenceOfLength(sequenceLength) {
    let seq = this.chromosome.getSequence(this.chromosomeIndex, this.chromosomeIndex + sequenceLength)
    this.chromosomeIndex += sequenceLength
    return seq
  }

  seedEnergy(howMuch) {
    let counter = howMuch
    while (counter > 0) {
      this.energyPackets.push(new EnergyPacket(1))
      counter -= 1
    }
  }

  cleanUpEnergy() {
    let newEnergy = []
    let totalAvailableEnergy = 0
    for (let i = 0; i < this.energyPackets.length; i++) {
      if (this.energyPackets[i] && !this.energyPackets[i].used) {
        newEnergy.push(this.energyPackets[i])
        totalAvailableEnergy += this.energyPackets[i].energyValue
      }
    }
    this.energyPackets = newEnergy
    this.availableEnergy = totalAvailableEnergy
  }

  createBodyImage(sequence) {
    let my_canvas = game.add.bitmapData(32, 32)
    let canvas_context = my_canvas.context
    canvas_context.fillStyle = 'black'
    canvas_context.fillRect(0,0, my_canvas.width, my_canvas.height)
    canvas_context.fillStyle = 'white'
    let imagePixels = parseInt(sequence).toString(2)
    let pixelIndex = 0
    for (var y = 0; y <= my_canvas.height / 4; y++) {
			for (var x = 0; x <= my_canvas.width / 8; x++) {
				if (imagePixels.charAt(pixelIndex) == 1) {
					canvas_context.fillRect(x * 4, y * 4, 4, 4)
					canvas_context.fillRect(my_canvas.width - ((x+1) * 4), y * 4, 4, 4)
				} else {
					canvas_context.fillStyle = 'black'
					canvas_context.fillRect(x * 4, y * 4, 4, 4)
					canvas_context.fillRect(my_canvas.width - ((x+1) * 4), y * 4, 4, 4)
					canvas_context.fillStyle = 'white'
				}
				pixelIndex = (pixelIndex + 1) % imagePixels.length
			}
		}
    this.sprite = game.add.sprite(0, 0, my_canvas)
    this.sprite.name = this.uniqueId
    this.sprite.anchor.setTo(0.5, 0.5)
    this.sprite.width = this.width
    this.sprite.height = this.height

    this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);
    this.sprite.inputEnabled = true;
    this.sprite.events.onInputDown.add(this.takeFocus, this)
  }

  createBasicActions(sequence) {
    let char = undefined
    let intensityOfAction = undefined
		for (var i = 0, len = sequence.length; i < len; i = i + 3) {
			char = parseInt(sequence[i])
			intensityOfAction = parseInt(sequence.slice(i+1, i + 3))
      this.basicActions.push({action: char, intensity: intensityOfAction})
		}
	}

  createSenses(sequence) {
    //we need!
    //width (3)
    //height (3)
    //precision (1)
    //senseDuration(2)
    let senseWidth = sequence.slice(0,3)
    let senseHeight = sequence.slice(3,6)
    let sensePrecision = sequence.slice(6,7)
    let senseDuration = sequence.slice(7,9)
    let newSense = new Sense(this, senseWidth, senseHeight, sensePrecision, senseDuration, this.game)
    this.senses.push(newSense)
  }

  update() {
    let moved = false
    this.energy = 0
    this.thisTurnsCost = 0
    if (this.dead) {
      return
    }

    this.calculateWeight()
    this.calculateAge()

    //let's sense some stuff before we do anything about it
    if (this.senses.length > 0) {
      for (let i = 0; i < this.senses.length; i++) {
        this.senses[i].update()
      }
    }

    this.game.physics.arcade.collide(this.game.creatures, this.sprite)

    let currentActionInput = undefined
    let currentAction = undefined

    //So, absorbing is a bit weird- absorbing doesn't cost anything IF this isn't your first turn absorbing
    this.wasAbsorbing = this.absorbing  //so if we absorbed last turn, this isn't your first turn absorbing
    this.absorbing = false              //but if we don't absorb again this turn then we'll reset wasAbsorbing next turn

    if (this.game.time.now > this.timeICanActAgain) {
      currentActionInput = this.basicActions[this.basicActionIndex]
      currentAction = this.game.actionManager.getActionAtIndex(currentActionInput.action)
      currentAction.perform(this, currentActionInput.intensity)
      this.thisTurnsCost = currentAction.getCostForActorAndIntensity(this, currentActionInput.intensity)
      this.timeICanActAgain = this.game.time.now + currentAction.getTimeToActAgainForActorAndIntensity(this, currentActionInput.intensity)

      this.basicActionIndex = (this.basicActionIndex + 1) % this.basicActions.length
    }

    //So that the top of the sprite is the direction the sprite is facing
    this.game.physics.arcade.velocityFromRotation(this.sprite.rotation + COURSE_ADJUSTMENT, this.currentSpeed, this.sprite.body.velocity);
  }

  postUpdate() {
    //We must PAY for what we've done!!
    this.tryToPayEnergy(this.thisTurnsCost)

    //Let's see if we gotta pay for our senses
    if (this.game.time.now > this.timeToPayForSenses) {
      if (this.senses.length > 0) {
        for (let i = 0; i < this.senses.length; i++) {
          let senseCost = this.senses[i].getPassiveEnergyCost()
          this.tryToPayEnergy(senseCost)
        }
      }
      this.timeToPayForSenses = this.game.time.now + 1000 //We pay every second
    }
    this.cleanUpEnergy()
  }

  calculateWeight() {
    let tempWeight = this.width * this.height
    tempWeight += this.energyPackets.length
    this.weight = tempWeight
  }

  calculateAge() {
    this.age = this.game.time.now - this.born
  }

  tryToPayEnergy(cost) {
    if (cost <= 0) {
      return
    }
    let nextPacket
    if (this.energyPackets.length == 0) {
      this.destroy()
    }

    for (let i = 0; i < this.energyPackets.length; i++) {
      nextPacket = this.energyPackets[i]
      nextPacket.consumedBy(this)
      if (this.energy >= cost) {
        break
      }
    }

    if (this.energy >= cost) {
    } else {
      //console.log(cost + " with EPs: " + this.energyPackets.length)
      this.destroy()
    }
  }

  takeFocus() {
    game.camera.follow(this.sprite)
    console.log(this)
  }

  destroy() {
    this.dead = true
    this.sprite.destroy()
  }
}
