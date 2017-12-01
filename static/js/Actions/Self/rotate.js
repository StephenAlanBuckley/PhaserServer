class Self_Rotate extends Action {
  constructor() {
    super()
  }

  perform(actor, intensity) {
    let radiansFromDegrees = (intensity * Math.PI) / 180
    actor.sprite.rotation += radiansFromDegrees
  }

  getCostForActorAndIntensity(actor, intensity) {
    let cost = Math.abs(Math.floor(intensity))
    return cost
  }

  getTimeToActAgainForActorAndIntensity(actor, intensity) {
    return 50;
  }
}
