import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, placeShip, getImages, cellsCalc, isOverlapping, computerShipPlacement, } from "./Modules/functions";
import { Ship } from "./Modules/classes";

let cells; 
let computerCells;

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board, 'player');
  populateBoard(nodes.computerBoard, 'computer');
  cells = cellsCalc('player');
  computerCells = cellsCalc('computer');
  const ship = document.querySelectorAll('img.ship');
  ship.forEach((ship) => {
    const shipType = ship.dataset.type;
    placeShip(ship, shipType, getImages()[`${shipType}-hor.png`], cells);
    computerShipPlacement(shipType, computerCells)
  });


});


