import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, placeShip, getImages, cellsCalc, isOverlapping, } from "./Modules/functions";

let cells; 
const images = getImages();

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board);
  cells = cellsCalc();
  const ship = document.querySelectorAll('img.ship');
  ship.forEach((ship) => {
    const shipType = ship.dataset.type;
    placeShip(ship, shipType, images[`${shipType}-hor.png`], cells)
  });
  console.log(cells);

});


