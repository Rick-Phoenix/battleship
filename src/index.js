import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard } from "./Modules/functions";

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board)
});

nodes.draggable.addEventListener('click', () => {
  window.addEventListener('mousemove', (e) => {
    nodes.draggable.style.position = 'absolute';
    console.log(e.clientY);
    nodes.draggable.style.top = `${e.clientY}px`;
    nodes.draggable.style.left = `${e.clientX}px`;
  })
})

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