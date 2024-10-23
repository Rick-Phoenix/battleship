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



export function placeShip(element, location, cells) {
  element.onmousedown = dragShip;
  let shipAngle = 0;

  function dragShip(e) {
    e.preventDefault();
    document.onmousemove = dragMove
    document.onclick = closeDrag
    nodes.dialog.append(nodes.board);
    const test = new Image();
    test.className = 'car';
    test.src = location;
    nodes.board.append(test);
    nodes.dialog.showModal();
    const dialogRect = nodes.dialog.getBoundingClientRect();
    const shipRect = test.getBoundingClientRect();
    document.onkeyup = rotateShip;

    
    function rotateShip(e) {
      console.log(shipRect);
      if (e.key == 'q') {
        test.style.transform = `rotate(${shipAngle - 45}deg)`;
        shipAngle -= 45 % 360;
        if (shipAngle === -90) shipAngle = 45;
      };
    }

    function dragMove(e) {
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
      document.removeEventListener('onkeypress', rotateShip);
      element.style.opacity = '0.5';
      element.onmousedown = null;
    }
    
    function isOverlapping(rect1, rect2) {
      return !(rect1.right < rect2.left || 
        rect1.top > rect2.bottom || 
        rect1.left > rect2.right || 
        rect1.bottom < rect2.top || 
        rect1.bottom > rect2.top && 
        rect1.top < rect2.top);
    }
  }
}

export function cellsCalc() {
  const cells = Array.from(document.querySelectorAll('.cell'));
  const cellsData = [
    {Quadrant: 0,
      top: null,
      bottom: null,
      left: null,
      right: null,
      rows: [],
      columns: [],
    },
    {Quadrant: 1,
      top: null,
      bottom: null,
      left: null,
      right: null,
      rows: [],
      columns: [],
    },
    {Quadrant: 2,
      top: null,
      bottom: null,
      left: null,
      right: null,
      rows: [],
      columns: [],
    },
    {Quadrant: 3,
      top: null,
      bottom: null,
      left: null,
      right: null,
      rows: [],
      columns: [],
    },
  ];

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
    const quadrant = getQuadrant(infoObj);
    let arraySlotRow = cellsData[quadrant].rows.find((item) => item.id == cellRow);
    if (!arraySlotRow) {
      const newArrLength = cellsData[quadrant].rows.push({id: cellRow, cells: [], top: cellSquare.top, bottom: cellSquare.bottom, left: cellSquare.left});
      arraySlotRow = cellsData[quadrant].rows[newArrLength - 1];
    };
    let arraySlotColumn = cellsData[quadrant].columns.find((item) => item.id == cellColumn);
    if (!arraySlotColumn) {
      const newArrLength = cellsData[quadrant].columns.push({id: cellColumn, cells: [], left: cellSquare.left, right: cellSquare.right, top: cellSquare.top});
      arraySlotColumn = cellsData[quadrant].columns[newArrLength - 1];
    };
    
    if (cellsData[quadrant].rows.length === 5 && cellsData[quadrant].columns.length === 5) {
      cellsData[quadrant].columns.forEach((column) => column.bottom = cellSquare.bottom);
      cellsData[quadrant].rows.forEach((row) => row.right = cellSquare.right);
      cellsData[quadrant].bottom = cellSquare.bottom;
      cellsData[quadrant].right = cellSquare.right;
      cellsData[quadrant].top = cellsData[quadrant].columns[0].top;
      cellsData[quadrant].left = cellsData[quadrant].columns[0].left;
    }
    arraySlotRow.cells.push(infoObj);
    arraySlotColumn.cells.push(infoObj);
  }

  function getQuadrant(cell) {
    const unit = Math.sqrt(cells.length) / 2;
    if (cell.row < unit && cell.column < unit) return 0;
    else if (cell.row < unit && cell.column >= unit) return 1;
    else if (cell.row >= unit && cell.column < unit) return 2;
    else return 3;
  }

  return cellsData;
}
