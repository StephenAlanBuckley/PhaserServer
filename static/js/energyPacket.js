class EnergyPacket {
  constructor(valence) {
    this.valence = valence
    this.energyValue = this.calculateEnergyValue()
    this.weight = 1
    this.used = false
  }

  consumedBy(creature) {
    creature.energy += this.energyValue
    this.energyValue = 0
    this.valence = 0
    this.used = true
  }

  calculateEnergyValue() {
    let current_valence = 0
    let tempValue = 0
    let previousEnergyValue = 0
    let energyValue = 1
    while (current_valence < this.valence) {
      tempValue = energyValue
      energyValue += previousEnergyValue
      previousEnergyValue = tempValue
      current_valence += 1
    }
    return energyValue
  }
}
