class Environment_Absorb extends Action {
  constructor() {
    super()
  }

  perform(actor, intensity) {
    if (actor.absorbing) {
      actor.seedEnergy(actor.width * actor.height/50)
    } else {
      actor.absorbing = true
    }
  }

  getCostForActorAndIntensity(actor, intensity) {
    if (actor.wasAbsorbing) {
      //costs nothing the other turns
    } else {
      //costs 2 the first turn you're absorbing
      return 2
    }
  }

  getTimeToActAgainForActorAndIntensity() {
    return 50
  }

}
