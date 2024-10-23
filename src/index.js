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
  console.log(sortingAlgo(cells));

});

function sortingAlgo(cells) {
  let mockRect = {
    top: 346,
    bottom: 446,
    left: 313,
    right: 413
  }

  let toHighlight = [cells.filter((quadrant) => {
    if (quadrant.left < mockRect.left &&
      quadrant.right > mockRect.right &&
      quadrant.top < mockRect.top &&
      quadrant.bottom > mockRect.bottom
    ) return true;

  })];

  return toHighlight

  
}

function sortingRec(array) {

}



