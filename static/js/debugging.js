class Debugger {
  constructor(game) {
    this.game = game
    this.creaturesInfoDisplay = false
    this.creaturesInfo = {}
    this.creaturesInfo['creaturesAlive'] = []

    this.trendsInfoDisplay = false
    this.trends = {}
    this.trends['fps'] = []
    this.trends['creaturesAlive'] = []
    this.trends['currentGeneration'] = []
    this.trends['gameTimeElapsed'] = []
    this.timeBetweenTrendSnapshots = 1000
    this.timeOfLastTrendSnapshot = 0
  }

  toggleCreaturesInfoDisplay() {
   this.creaturesInfoDisplay = !this.creaturesInfoDisplay
  }

  toggleTrendsDisplay() {
   this.trendsInfoDisplay = !this.trendsInfoDisplay
  }

  update() {
    this.getTrendsUpdate()
    this.getCreaturesUpdate()
  }

  getTrends() {
    if (this.game.time.now - this.timeBetweenTrendSnapshots > this.timeOfLastTrendSnapshot) {
      this.trends['fps'].push(this.game.time.fps)
      this.trends['creaturesAlive'].push(this.game.creatureManager.creaturesAlive.length)
      this.trends['gameTimeElapsed'].push(this.game.time.totalElapsedSeconds())
      this.timeOfLastTrendSnapshot = this.game.time.now
    }
  }

  getCreaturesUpdate() {
    if (this.game.time.now - this.timeBetweenCreatureSnapshot > this.timeOfLastCratureSnapshot) {
      this.creaturesInfo['creaturesAlive'].push(this.game.creatureManager.creaturesAlive.length)
      this.creaturesInfo['averageLivingWeight'] = this.game.creatureManager.averageLivingWeight()
      this.timeOfLastCratureSnapshot = this.game.time.now
    }
  }
}
