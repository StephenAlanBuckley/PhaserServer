class Environment_Forage extends Action {
  constructor() {
    super()
  }

  perform(actor, intensity) {
    let soil = actor.game.soilManager.getSoilForPosition(actor.sprite.position)
    let energyIGot = false
    let soilHasEnergyLeft = true
    if (soil) {
      while (intensity > 0 && soilHasEnergyLeft) {
        energyIGot = soil.removeRandomEnergyPacket()
        if (energyIGot) {
          actor.energyPackets.push(energyIGot)
        } else {
          soilHasEnergyLeft = false
        }
        intensity -= 20
      }
    }
  }

  getCostForActorAndIntensity(actor, intensity) {
    return 1
  }

  getTimeToActAgainForActorAndIntensity() {
    return 25
  }

}
