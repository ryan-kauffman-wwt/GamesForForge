class StrandsGame {
  constructor() {
    this.strands = [];
  }

  addStrand(strand) {
    this.strands.push(strand);
  }

  getStrands() {
    return this.strands;
  }
}

module.exports = StrandsGame;