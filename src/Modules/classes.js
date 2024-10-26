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
        attacker.hits = attacker.hits.filter((cell) => cell.occupyingShip.sunk === false);
        attacker.oppShips = attacker.oppShips.filter((ship) => ship !== targetShip)
        if (attacker.oppShips.length < 1) this.win(attacker.name);
      }
    }
    
    if (!targetShip) {
      const splashImg = new Image();
      splashImg.src = splashImgSource;
      splashImg.className = 'splashImg';
      cell.node.append(splashImg);
    }
    
    cell.hit = true;
  }

  win(winner) {
    this.gameOver = true;
    this.winner = winner;
  }

  computerTurn(index = 1) {
    const hits = this.players.computer.hits;
    if (hits.length === 0) return this.attack('computer', this.randomChoice());
    if (hits.length > 0) {
      const lastHit = hits[hits.length - index];
      if (!lastHit) return this.attack('computer', this.randomChoice());
      let direction = null;
      if (hits.length > index) {
        const previousHit = hits[hits.length - index - 1];
        if (previousHit.row === lastHit.row) direction = 'horizontal';
        else if (previousHit.column === lastHit.column) direction = 'vertical';
      }

      const target = this.findNearShip(lastHit, direction);
      if (target) return this.attack('computer', target);
      else return this.computerTurn(index + 1);
    } 
  }

  findNearShip(cell, direction = null) {
    const row = +cell.row;
    const column = +cell.column;
    const cells = this.players.computer.oppBoard;
    let targetsList;

    if (direction === null) {
      targetsList = [
        cells.rows[row + 1]?.[column],
        cells.rows[row - 1]?.[column],
        cells.columns[column + 1]?.[row],
        cells.columns[column - 1]?.[row],
      ]
    }

    else if (direction === 'horizontal') {
      targetsList = [
        cells.columns[column + 1]?.[row],
        cells.columns[column - 1]?.[row]
      ]
    }

    else {
      targetsList = [
        cells.rows[row + 1]?.[column],
        cells.rows[row - 1]?.[column],
      ]
    }
    
    const potentialTargets = targetsList.filter((cell) => cell && this.checkCell(cell) === true)

    if (potentialTargets.length === 0) return false;

    else {
      const randomizer = Math.floor(Math.random() * potentialTargets.length);
      const target = potentialTargets[randomizer];
      return target;
    }
  }

  checkCell(cell) {
    return !(cell.hit === true || cell.row < 0 || cell.row > 9 || 
      cell.column < 0 || cell.column > 9
    );
  }

  randomChoice() {
    const randomRow = Math.round(Math.random() * 9);
    const randomColumn = Math.round(Math.random() * 9);
    const randomCell = this.players.computer.oppBoard.rows[randomRow][randomColumn];
    if (randomCell.hit) return this.randomChoice();
    else return randomCell;
  }
}