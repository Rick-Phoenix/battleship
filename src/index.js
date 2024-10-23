import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, placeShip, getImages, cellsCalc, } from "./Modules/functions";

let cells; 
let quadrants;
const images = getImages();

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board);
  cells = cellsCalc();
  const ship = document.querySelectorAll('img.ship');
  ship.forEach((ship) => {
    const shipType = ship.dataset.type;
    placeShip(ship, images[`${shipType}-hor.png`], cells)
  });
  console.log(cells);
});





