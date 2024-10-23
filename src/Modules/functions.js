import * as nodes from "./selectors"
import carrier from "../Images/car-hor.png"

export function createElement(type, ...classes) {
  const newElement = document.createElement(type);
  newElement.classList.add(...classes);

  return newElement;
}

export function getImages(index) {
  index = require.context('../Images', false, /\.(png|jpe?g|svg)$/);
  let imagesObj = {};
  index.keys().forEach((key) => {
    imagesObj[key.replace('./', '')] = index(key)
  });
  return imagesObj;
}



export function populateBoard(target) {
  for (let i = 0; i < 100; i++) {
    const cell = createElement('div', 'cell');
    const cellRow = Math.floor(i / 10);
    const cellColumn = Math.floor(i % 10);
    cell.setAttribute('data-row', cellRow);
    cell.setAttribute('data-column', cellColumn);
    cell.style.setProperty('--row', `'${cellRow}'`);
    cell.style.setProperty('--col', `'${cellColumn}'`);
    target.append(cell);
  }
}



export function placeShip(element, location) {
  element.onmousedown = dragShip;

  function dragShip(e) {
    e.preventDefault();
    nodes.dialog.append(nodes.board);
    const test = new Image();
    test.className = 'car';
    test.src = location;
    nodes.board.append(test);
    nodes.dialog.showModal();
    const dialogRect = nodes.dialog.getBoundingClientRect();
    const shipRect = test.getBoundingClientRect();

    document.onmousemove = dragMove
    document.onmouseup = closeDrag

    function dragMove(e) {
      console.log(shipRect);
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      test.style.position = 'absolute';
      test.style.top = `${mouseY - dialogRect.top - shipRect.height}px`;
      test.style.left = `${mouseX - dialogRect.left}px`;
    }

    function closeDrag() {
      nodes.dialog.close();
      nodes.main.prepend(nodes.board)
      document.onmouseup = null;
      document.onmousemove = null;
    }
    
    function isOverlapping(rect1, rect2) {
      return !(rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.bottom > rect2.top && rect1.top < rect2.top);
    }
  }
}

