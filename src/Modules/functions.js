import { Ship } from "./classes";
import * as nodes from "./selectors"

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



export function placeShip(element, type, location, cells) {
  const ship = new Ship(type, null);

  element.onmousedown = dragShip;
  element.onmouseover = changeCursor;
  let shipAngle = 0;
  let mouseX;
  let mouseY;
  
  const shipImg = new Image();
  shipImg.classList.add('gameIcon', type);
  shipImg.src = location;
  shipImg.style.width = `${50 * ship.length}px`

  function changeCursor(e) {
    element.style.cursor = 'grab';
  }

  function rotateShip(e) {
    if (e.key == 'q') {
      shipImg.style.transform = `rotate(${shipAngle - 45}deg)`;
      shipAngle -= 45 % 360;
      if (shipAngle === -90) shipAngle = 45;
    };
    dragMove(e)
  }

  function closeDrag(e) {
    nodes.dialog.close();
    nodes.main.prepend(nodes.board)
    document.onmouseup = null;
    document.onmousemove = null;
    document.removeEventListener('onkeypress', rotateShip);
    element.style.opacity = '0.5';
    element.onmousedown = null;
    element.onmouseover = null;
    element.style.cursor = 'auto';
  }

  function dragShip(e) {
    e.preventDefault();
    document.onmousemove = dragMove
    document.onmouseup = closeDrag;
    
    nodes.board.append(shipImg);
    nodes.dialog.append(nodes.board);
    nodes.dialog.showModal();
    nodes.dialog.focus();
    document.onkeyup = rotateShip;
  }

  function dragMove(e) {
    const boardRect = nodes.board.getBoundingClientRect();
    const shipRect = shipImg.getBoundingClientRect();
    mouseX = e.clientX || mouseX;
    mouseY = e.clientY || mouseY;
    shipImg.style.position = 'absolute';
    if (shipAngle === 0) {
      shipImg.style.top = `${mouseY - boardRect.top - (shipRect.height / 2) - 15}px`;
      shipImg.style.left = `${mouseX - boardRect.left}px`;
    }

    if (shipAngle === -45) {
      shipImg.style.top = `${mouseY - boardRect.top - (shipRect.height / 2) - 15}px`;
      shipImg.style.left = `${mouseX - boardRect.left - (shipRect.width / 4)}px`;
    }
    
    if (shipAngle === 45) {
      shipImg.style.top = `${mouseY - boardRect.top - (shipRect.height / 2) - 15}px`;
      shipImg.style.left = `${mouseX - boardRect.left - (shipRect.width * 2.5)}px`;
    }

    let column = Math.floor(((mouseX - boardRect.left + 1) / boardRect.width) * 10); 
    let row = Math.floor(((mouseY - boardRect.top + 1) / boardRect.height) * 10); 
    console.log(row);
    console.log(column);

    function sortingAlgo(e, cells) {
      let column;
      let row;

    }
  }

}

// export function isOverlapping(rect1, rect2) {
//   return !(rect1.right < rect2.left || 
//     rect1.top > rect2.bottom || 
//     rect1.left > rect2.right || 
//     rect1.bottom < rect2.top || 
//     rect1.bottom > rect2.top && 
//     rect1.top < rect2.top);
// }

export function cellsCalc() {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const cellsData = {
    rows: Array.from({length: 10}, () => []),
    columns: Array.from({length: 10}, () => []),
  };

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const cellSquare = cell.getBoundingClientRect();
    const cellRow = cell.dataset.row;
    const cellColumn = cell.dataset.column;
    let infoObj = {
      id: i,
      row: cellRow,
      column: cellColumn,
      node: cell,
      left: cellSquare.left,
      right: cellSquare.right,
      top: cellSquare.top,
      bottom: cellSquare.bottom
    }
    cellsData.rows[cellRow].push(infoObj);
    cellsData.columns[cellColumn].push(infoObj);
  }

  return cellsData;
}
