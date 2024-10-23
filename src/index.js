import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, placeShip, getImages, } from "./Modules/functions";

let cells; 
let cellData;
const images = getImages();

document.addEventListener('DOMContentLoaded', (e) => {
  populateBoard(nodes.board);
  cellsCalc()
  const ship = document.querySelector('img.ship');
  console.log(images);
  placeShip(ship, images['car-hor.png']);
});


function cellsCalc() {
  cells = Array.from(document.querySelectorAll('.cell'));
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


