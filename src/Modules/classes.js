export class Ship {
  constructor(length, name, coordinates) {
    this.length = length;
    this.hits = 0;
    this.sunk = false;
    this.name = name;
    this.coordinates = coordinates;
  }

  hit() {
    this.hits++;
  }

  isSunk() {
    if (this.hits === this.length) this.sunk = true;
  }
}

export class GameBoard {
  constructor() {
    this.rows = [0,1,2,3,4,5,6,7,8,9];
    this.columns = [0,1,2,3,4,5,6,7,8,9];
  }
}