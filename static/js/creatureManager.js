class CreatureManager {
  constructor(game) {
    this.game = game

    this.creatures = this.game.add.group()
    this.creatures.name = 'creatures'
    this.game.creatures = this.creatures
    this.creaturesAlive = []
    this.creaturesTotal = 0
    this.creaturesDict = {}
    this.generation = 1

    this.maxGenerationTime = 1000 * 120
    this.percentageThreshold = 25

    //For the Debugger
    this.game.creatureManager = this
  }

  createMoreCreatures(numberNewCreatures) {
    let c;
    for (var i = 0; i < numberNewCreatures; i++) {
      c = new Creature(this.game)
      c.sprite = this.creatures.add(c.sprite)
      this.creatures.bringToTop(c.sprite)
      this.creaturesDict[c.uniqueId] = c
      this.creaturesAlive.push(c)
      this.creaturesTotal += 1;
    }
    this.timeOfLastGeneration = 0
  }

  getCreatureWithId(creatureId) {
    if (this.creaturesDict.hasOwnProperty(creatureId)) {
      return this.creaturesDict[creatureId]
    }
    return false
  }

  bulletHitCreature(creature, bullet) {
    bullet.kill()
    //need a way to take the sprite name and find the creature with that name using the unique id
    //Also do we need a game group? we don't have one for enemies and it seems to work out
  }

  update() {
    //this.game.world.bringToTop(this.creatures)
    let newLivingCreatures = []
    let c = null
    let forceNewGen = false
    for (var creatureId in this.creaturesDict) {
      c = this.creaturesDict[creatureId]
      c.update()
      if (!c.dead) {
        newLivingCreatures.push(c)
      }
    }
    //if everything just died, we'll take the things that lived up until the last frame for the next gen
    if (newLivingCreatures.length > 0) {
      this.creaturesAlive = newLivingCreatures
    } else {
      forceNewGen = true
    }
    this.checkForNewGeneration(forceNewGen)
  }

  postUpdate() {
    for (var creatureId in this.creaturesDict) {
      c = this.creaturesDict[creatureId]
      c.postUpdate()
    }
  }

  averageLivingWeight() {
    let totalWeight = 0
    this.creaturesAlive.forEach(function(c) {
      totalWeight += c.weight
    })
    let averageWeight = totalWeight / this.creaturesAlive.length
    console.log(averageWeight)
  }

  checkForNewGeneration(force = false) {
    if (force || this.creaturesAlive.length <= this.percentageThreshold || (this.game.time.now - this.timeOfLastGeneration) > this.maxGenerationTime) {
      this.createNewGeneration(this.creaturesAlive)
    }
  }

  createNewGeneration(breeders) {
    breeders = Phaser.ArrayUtils.shuffle(breeders)
    let newCreatures = []
    let newCreaturesDict = {}
    for (let i = 0; i < breeders.length; i++) {
      let sexHaver = breeders[i]
      if (sexHaver.dead == false) {
        newCreaturesDict[sexHaver.uniqueId] = sexHaver
        newCreatures.push(sexHaver)
      }
    }
    let luckyOther
    let currentBreederIndex = 0
    while (newCreatures.length < 100) {
      luckyOther = Phaser.ArrayUtils.getRandomItem(breeders)
      let currentBreederChromosome = breeders[currentBreederIndex].chromosome
      let newDNA = currentBreederChromosome.mate(luckyOther.chromosome)
      c = new Creature(this.game, newDNA)
      c.sprite = this.creatures.add(c.sprite)
      this.creatures.bringToTop(c.sprite)
      newCreaturesDict[c.uniqueId] = c
      newCreatures.push(c)
      currentBreederIndex = (currentBreederIndex + 1) % breeders.length
    }
    this.creaturesAlive = newCreatures
    this.creaturesDict = newCreaturesDict
    this.creaturesTotal = newCreatures.length
    this.timeOfLastGeneration = this.game.time.now
    this.generation += 1
  }

}
