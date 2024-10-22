import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, reset } from "./Modules/functions";

let cells; 
let cellData;

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board);
  cells = Array.from(document.querySelectorAll('.cell'));
  cellsCalc()
  cellTest()
});

function cellsCalc() {
  const arr = [];
  for (let i = 0; i < cells.length; i++) {
    const cellSquare = cells[i].getBoundingClientRect();
    arr[i] = {
      cellCount: i,
      left: cellSquare.left,
      right: cellSquare.right,
      top: cellSquare.top,
      bottom: cellSquare.bottom
    }
  }

  cellData = arr;
}

function cellTest() {
  const n = 400
  cellData.forEach((cell) => cell.right < n ? console.log(cell):null)
}

class Ship {
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

class GameBoard {
  constructor() {
    this.rows = [0,1,2,3,4,5,6,7,8,9];
    this.columns = [0,1,2,3,4,5,6,7,8,9];
  }


}