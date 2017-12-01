class Self_Move extends Action {
  constructor() {
    super()
  }

  perform(actor, intensity) {
		actor.currentSpeed += intensity
		if (actor.currentSpeed < 0) {
			actor.currentSpeed = 0
		}

		if (actor.currentSpeed > MAX_SPEED) {
      actor.currentSpeed = MAX_SPEED
    }
  }

  getCostForActorAndIntensity(actor, intensity) {
    let cost = Math.abs(Math.floor(intensity * actor.weight * 0.01))
    return cost
  }

  getTimeToActAgainForActorAndIntensity(actor, intensity) {
    return 2.5 * intensity;
  }
}
