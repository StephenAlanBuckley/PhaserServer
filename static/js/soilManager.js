const GRID_WIDTH = 100
const GRID_HEIGHT = 100

class SoilManager {
  constructor(game) {
    if (game.soilManager != undefined) {
      return game.soilManager
    }
    this.game = game
    this.soil = []
    for (let x = 0; x < Math.floor(game.world.bounds.width/GRID_WIDTH); x++) {
      this.soil[x] = []
      for (let y = 0; y < Math.floor(game.world.bounds.height/GRID_HEIGHT); y++) {
        let random_fertility = Math.floor(Math.random() * 100)
        this.soil[x][y] = new Soil(x, y, random_fertility, this.game)
      }
    }
    game.soilManager = this
  }

  getSoilForPosition(position) {
    //So the game world can be negative- what we need to do is figure out where the position is relative to the upper left of the game world bounds
    let soil_x = Math.min(Math.floor(Math.abs(position.x - this.game.world.bounds.x) / GRID_WIDTH), 49)
    let soil_y = Math.min(Math.floor(Math.abs(position.y - this.game.world.bounds.y) / GRID_HEIGHT), 49)
    return this.soil[soil_x][soil_y]
  }

  update() {
    this.soil.forEach(function(column) {
      column.forEach(function(plot) {
        plot.update()
      })
    })
  }
}
