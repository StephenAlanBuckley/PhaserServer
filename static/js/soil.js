const MAX_RANDOM_VALENCE = 10

//this is still 10 times a second that it'll make an energy packet even at minimum fertility
//I'm gonna have to put soil on a slower update cycle, I think
//Ooooor drastically expand the length of the cycle (thinking in minutes instead of milliseconds)

const CYCLE_LENGTH = 100
class Soil {
  constructor(myX, myY, fertility = 10, game) {
    this.game = game
    this.fertility = fertility
    this.energyPackets = []
    this.x = myX
    this.y = myY
    this.cycle = 1
  }

  removeRandomEnergyPacket() {
    if (this.energyPackets.length > 0) {
      let energyIndex = Math.floor(Math.random() * (this.energyPackets.length + 1))
      let packet = this.energyPackets[energyIndex]
      this.energyPackets.splice(energyIndex, 1)
      return packet
    } else {
      return false
    }
  }

  produceRandomEnergyPacket() {
    let random_valence = Math.random() * (MAX_RANDOM_VALENCE + 1)
    this.energyPackets.push(new EnergyPacket(random_valence))
  }

  update() {
    if (this.cycle <= this.fertility) {
      this.produceRandomEnergyPacket()
    }
    this.cycle = (this.cycle + 1) % CYCLE_LENGTH
  }

}
