export class Ship {
  constructor(type, coordinates) {
    let shipTable = {
      car: {name: 'Aircraft Carrier', length: 5},
      bat: {name: 'Battleship', length: 4},
      sub: {name: 'Submarine', length: 3},
      cru: {name: 'Cruiser', length: 3},
      des: {name: 'Destroyer', length: 2},
    }

    this.length = shipTable[type]['length'];
    this.name = shipTable[type]['name'];
    this.hits = 0;
    this.sunk = false;
    this.coordinates = coordinates;
  }

  place(coordinates) {
    this.coordinates = coordinates;
  }

  hit(cell) {
    cell.hit = true;
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