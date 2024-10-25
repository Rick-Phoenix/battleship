import { blastImgSource, computerShips, splashImgSource } from "./functions";

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

  hit() {
    this.hits++;
    if (this.hits === this.length) this.sunk = true;
  }

}

export class GameBoard {
  constructor(playerBoard, computerBoard, playerShips, computerShips) {
    this.players = {
      player: {
        name: 'Player',
        board: playerBoard,
        ships: playerShips,
        oppBoard: computerBoard,
        oppShips: computerShips,
        hits: [],
      },

      computer: {
        name: 'Computer',
        board: computerBoard,
        ships: computerShips,
        oppBoard: playerBoard,
        oppShips: playerShips,
        hits: [],
      }
    }

    this.gameOver = false;
  }

  attack(player, cell) {
    const attacker = this.players[player]
    const targetShip = cell.occupyingShip;
    if (targetShip) {
      targetShip.hit();
      attacker.hits.push(cell);
      const blastImg = new Image();
      blastImg.src = blastImgSource;
      blastImg.className = 'blastImg';
      cell.node.append(blastImg)
      if (targetShip.sunk === true) {
        attacker.oppShips = attacker.oppShips.filter((ship) => ship !== targetShip)
        if (attacker.oppShips.length < 1) this.win(attacker.name);
      }
    }
    
    if (!targetShip) {
      const splashImg = new Image();
      splashImg.src = splashImgSource;
      splashImg.className = 'splashImg';
      console.log(cell);
      cell.node.append(splashImg);
    }
    
    cell.hit = true;
  }

  win(winner) {
    this.gameOver = true;
    this.winner = winner;
  }

}