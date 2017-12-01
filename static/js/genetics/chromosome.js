/*
 * For now all chromosomes are going to be base 10
 * It probably makes more sense to store them as a series of base64 blobs
 * There's no mutations yet
 */

const BASE_DNA_LENGTH = 1000
const MIN_CROSSOVER_RATE = 15
const MAX_CROSSOVER_RATE = 35

//So 1% change would be 1.0, these are all actual perkilages
const INSERTION_PERCENTAGE = 0.1
const DELETION_PERCENTAGE = 0.1
const SUBSITUTION_PERCENTAGE = 0.2


class Chromosome {
  constructor(fromScratch = false, givenDNA = undefined) {
    if (fromScratch) {
      this.dna = this.createNewChromosome()
    }
    if (givenDNA) {
      this.dna = givenDNA
    }

    this.addMutations(this.dna)
  }

  createNewChromosome(length = BASE_DNA_LENGTH) {
    let text = ""
    let basePool = "0123456789"

    for (var i = 0; i < length; i++) {
      text += basePool.charAt(Math.floor(Math.random() * basePool.length))
    }
    return text
  }

  mate(otherChromosome) {
    let parents = [this.dna, otherChromosome.dna]

    let minLength = Math.min(parents[0].length, parents[1].length)
    let shortString
    if (parents[0].length < parents[1].length) {
      shortString = 0
    } else {
      shortString = 1
    }

    let crossoverPercentage = MIN_CROSSOVER_RATE + Math.floor(Math.random() * (MAX_CROSSOVER_RATE - MIN_CROSSOVER_RATE))
    let numberOfCrossovers = Math.floor((crossoverPercentage * minLength) /100)
    let crossovers = []

    for (var i = 1; i <= numberOfCrossovers; i++) {
      crossovers.push(Math.floor(Math.random() * minLength))
    }

    crossovers.sort(function(a, b) {
      return (a - b)
    })

    let tempCrossovers = []
    for (var j = 1; j < crossovers.length; j++) {
      if (crossovers[j] !== crossovers[j - 1]) {
        tempCrossovers.push(crossovers[j])
      }
    }

    crossovers = tempCrossovers
    if (crossovers[0] !== 0) {
      crossovers.unshift(0)
    }

    let newChromosome = ""
    let readingFromParent = Math.floor(Math.random() * 10) % 2
    for (var i = 1; i< crossovers.length; i++) {
      newChromosome += parents[readingFromParent].slice(crossovers[i-1], crossovers[i])
      readingFromParent = (readingFromParent + 1) % 2
    }

    //let's get the tail of whichever parent we ended on. No sweat if this is an empty string being added at the tail
    newChromosome += parents[readingFromParent].slice(crossovers[crossovers.length -1])

    return newChromosome
  }

  addMutations(dna) {
    let numberOfInsertions = INSERTION_PERCENTAGE * (dna.length/100)
    let numberOfDeletions = DELETION_PERCENTAGE * (dna.length/100)
    let numberOfSubstitutions = SUBSITUTION_PERCENTAGE * (dna.length/100)

    //Insertions
    for (let i = 0; i < numberOfInsertions; i++) {
      let randIndex = Math.floor(Math.random() * (dna.length))
      let randNewNumber = Math.floor(Math.random() * 9.9) //Can't actually be 10, so we get nice and close
      let tempDna = dna.slice(0,randIndex) + randNewNumber.toString() + dna.slice(randIndex)
      dna = tempDna
    }

    //Deletions
    for (let i = 0; i < numberOfDeletions; i++) {
      let randIndex = Math.floor(Math.random() * (dna.length))
      let tempDna = dna.slice(0,randIndex) + dna.slice(randIndex + 1)
      dna = tempDna
    }

    //Subsitutions
    for (let i = 0; i < numberOfSubstitutions; i++) {
      let randIndex = Math.floor(Math.random() * (dna.length))
      let randNewNumber = Math.floor(Math.random() * 9.9) //Can't actually be 10, so we get nice and close
      let tempDna = dna.slice(0,randIndex) + randNewNumber.toString() + dna.slice(randIndex + 1)
      dna = tempDna
    }

    //Let's replace the dna in here
    this.dna = dna
    return dna
  }

  getSequence(startPosition, endPosition) {
    return this.dna.slice(startPosition, endPosition)
  }
}
