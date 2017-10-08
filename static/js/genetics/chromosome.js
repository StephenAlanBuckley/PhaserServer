/*
 * For now all chromosomes are going to be base 10
 * It probably makes more sense to store them as a series of base64 blobs
 * There's no mutations yet
 */

const BASE_DNA_LENGTH = 100
const MIN_CROSSOVER_RATE = 15
const MAX_CROSSOVER_RATE = 35

/* UNUSED
const MUTATIONS = {
  this.INSERTION_PERCENTAGE = .1
  this.DELETION_PERCENTAGE = .1
  this.SUBSITUTION_PERCENTAGE = .2
}
*/


class Chromosome {
  constructor(fromScratch = false) {
    if (fromScratch) {
      this.dna = this.createNewChromosome()
    }
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
}

/*
let dad = new Chromosome(true)
let mom = new Chromosome(true)
let child = new Chromosome(false)
child.dna = dad.mate(mom)

printDadColor(dad.dna)
printMomColor(mom.dna)

let colorChildString = ''
for (var i = 0; i< child.dna.length; i++) {
  if (child.dna.charAt(i) == mom.dna.charAt(i)) {
    if (child.dna.charAt(i) == dad.dna.charAt(i)) {
      colorChildString += '\x1b[37m' + child.dna.charAt(i) + '\x1b[0m'
    } else {
      colorChildString += '\x1b[34m' + child.dna.charAt(i) + '\x1b[0m'
    }
  } else {
    colorChildString += '\x1b[31m' + child.dna.charAt(i) + '\x1b[0m'
  }
}

console.log(colorChildString)



function printDadColor(character) {
  console.log('\x1b[31m%s\x1b[0m', character)
}

function printMomColor(character) {
  console.log('\x1b[34m%s\x1b[0m', character)
}

function printBothColor(character) {
  console.log('\x1b[37m%s\x1b[0m', character)
}
*/
