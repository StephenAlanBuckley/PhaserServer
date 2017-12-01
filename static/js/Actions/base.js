//This is an abstract class meant to be extended by all actions
class Action {

  constructor() {
  }

  perform(actor, intensity) {
    console.log("performed base Action!")
    return
  }

  getCostForActorAndIntensity(actor, intensity) {
    console.log("got cost of base Action!")
    return
  }

  getTimeToActAgainForActorAndIntensity() {
    console.log("got time to act again for base Action!")
    return
  }

  _log(actor, intensity) {
  }
}
