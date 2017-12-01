class ActionManager {
  constructor(game) {
    this.game = game
    this.game.actionManager = this
    this.actionRegistry = []
    this.actionRegistry.push(new Environment_Forage)
    this.actionRegistry.push(new Environment_Absorb)
    this.actionRegistry.push(new Self_Rotate)
    this.actionRegistry.push(new Self_Move)
  }

  getActionAtIndex(index) {
    index = index % this.actionRegistry.length
    return this.actionRegistry[index]
  }

}
