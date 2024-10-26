import { playerShips } from "..";
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

export const blastImgSource = getImages()[`blast.png`];
export const splashImgSource = getImages()[`splash.png`];



export function populateBoard(target, type) {
  for (let i = 0; i < 100; i++) {
    const cell = createElement('div', `${type}Cell`);
    cell.id = i;
    const cellRow = Math.floor(i / 10);
    const cellColumn = Math.floor(i % 10);
    cell.setAttribute('data-row', cellRow);
    cell.setAttribute('data-column', cellColumn);
    cell.style.setProperty('--row', `'${cellRow}'`);
    cell.style.setProperty('--col', `'${cellColumn}'`);
    target.append(cell);
  }
}


export let playerShipsList = [];
export let computerShips = [];

export function placeShip(element, type, location, cells) {
  const ship = new Ship(type, null);

  element.onclick = dragShip;
  element.onmouseover = changeCursor;
  let shipAngle = 0;
  let mouseX;
  let mouseY;
  
  const shipImg = new Image();
  shipImg.classList.add('gameIcon', type);
  shipImg.src = location;

  function changeCursor(e) {
    element.style.cursor = 'grab';
  }

  function rotateShip(e) {
    if (e.key == 'q') {
      if (shipAngle === 0) {
        shipImg.style.transform = `rotate(${shipAngle - 90}deg)`;
        shipAngle -= 90;
        dragMove(e)
        return;
      }
      
      if (shipAngle === -90) {
        shipImg.style.transform = `rotate(${0}deg)`;
        shipAngle = 0;
        dragMove(e)
      }
    };

    
  }

  function closeDrag(targetCells) {
    nodes.dialog.close();
    nodes.dialog.style.cursor = 'auto';
    nodes.main.prepend(nodes.board)
    document.onmousemove = null;
    element.style.opacity = '0.5';
    element.onclick = null;
    element.onmouseover = null;
    element.style.cursor = 'auto';
    document.onclick = null;
    document.onkeyup = null;
  }

  function dragShip(e) {
    e.preventDefault();
    document.onmousemove = dragMove;
    
    nodes.board.append(shipImg);
    nodes.dialog.append(nodes.board);
    nodes.dialog.showModal();
    nodes.dialog.focus();
    nodes.dialog.style.cursor = 'grabbing';
    nodes.dialog.style.setProperty('--instructions', "'Press Q to rotate the ship'");
    shipImg.style.position = 'absolute';
    document.onkeyup = rotateShip;
  }

  function dragMove(e) {
    const boardRect = nodes.board.getBoundingClientRect();
    let shipRect = shipImg.getBoundingClientRect();
    let offset;
    const offsetTop = boardRect.top - cells.rows[0][0].top;

    mouseX = e.clientX || mouseX
    mouseY = e.clientY || mouseY

    if (shipAngle === 0) {
      let newTop = mouseY - boardRect.top - (shipRect.height / 2) - 15;
      newTop = Math.max(0, newTop);
      newTop = Math.min(newTop, boardRect.height - shipRect.height);

      let newLeft = mouseX - boardRect.left - 15;
      newLeft = Math.max(0, newLeft);
      newLeft = Math.min(newLeft, boardRect.width - shipRect.width - 1);
      shipImg.style.top = `${newTop}px`;
      shipImg.style.left = `${newLeft}px`;
    }

    if (shipAngle === -90) {
      let newRect = shipImg.getBoundingClientRect()
      offset = newRect.height / 2 - newRect.width / 2;
      let newTop = mouseY - boardRect.top - (newRect.height / 2);

      newTop = Math.max(offset, newTop);
      newTop = Math.min(newTop, boardRect.bottom - boardRect.top + offset - newRect.height);

      let newLeft = mouseX - boardRect.left - (shipRect.height / 2) - 15;
      newLeft = Math.max(newLeft, -offset);
      newLeft = Math.min(newLeft, boardRect.right - boardRect.left - offset - newRect.width);
      shipImg.style.top = `${newTop}px`;
      shipImg.style.left = `${newLeft}px`;
    }
    

    let column = Math.floor(((mouseX - boardRect.left + 1) / boardRect.width) * 10); 
    let row = Math.floor(((mouseY - boardRect.top + 1) / boardRect.height) * 10); 
    sortingAlgo(column,row)

    function sortingAlgo(startColumn, startRow) {
      if (startColumn < 0) startColumn = 0;
      if (startRow < 0) startRow = 0;
      if (startRow > 9) startRow = 9;

      cells.rows.forEach((row) => row.forEach((cell) => cell.node.classList.remove('hover-effect')));
      let targetCells;

      if (shipAngle === 0) {
        if (startColumn + ship.length > 9) startColumn = 10 - ship.length;
        const row = cells.rows[startRow]
        if (row) {
          targetCells = row.slice(startColumn, startColumn + ship.length);
          for (let cell of targetCells) {
            cell.node.classList.add('hover-effect')
          }
        }
      }

      if (shipAngle === -90) {
        if (startRow - ship.length < 0) startRow = ship.length - 1;
        if (startColumn > 9) startColumn = 9;
        const column = cells.columns[startColumn]
        if (column) {
          targetCells = column.slice(startRow - ship.length + 1, startRow + 1);
          for (let cell of targetCells) {
            cell.node.classList.add('hover-effect')
          }
        }
      }
      

      if (targetCells.length === ship.length) {
        document.onclick = occupyCells;
      }

      function checkFilledStatus() {
        const check = targetCells.find((cell) => cell.filled === true);
        if (check !== undefined) return true;
        else return false;
      }

      function occupyCells() {
        if (!checkFilledStatus()) {

          targetCells.forEach((cell) => {
            cell.filled = true;
            cell.occupyingShip = ship;
            ship.place(targetCells);
          });

          const firstCell = targetCells[0];

          if (shipAngle === 0) {
            const areaLength = 50 * ship.length;
            const areaHeight = 50;
            const freeSpaceX = areaLength - shipRect.width;
            const freeSpaceY = areaHeight - shipRect.height;
  
            shipImg.style.left = `${(firstCell.left + freeSpaceX / 2 - boardRect.left)}px`
            shipImg.style.top = `${(firstCell.top - boardRect.top + offsetTop + freeSpaceY / 2)}px`
  
          }

          if (shipAngle === -90) {
            const areaLength = 50;
            const areaHeight = 50 * ship.length;
            const freeSpaceX = areaLength - shipRect.width;
            const freeSpaceY = areaHeight - shipRect.height;
  
            shipImg.style.left = `${(firstCell.left + freeSpaceX / 2 - boardRect.left - offset)}px`
            shipImg.style.top = `${(firstCell.top - boardRect.top + offsetTop + freeSpaceY / 2 + offset)}px`

          }

          
          playerShipsList.push(ship);
          if (playerShipsList.length > 5) playerShipsList = [ship];
          closeDrag(targetCells);
        }
      }
    }
  }
}

export function getShips() {
  return [computerShips, playerShipsList];
}

export function computerShipPlacement(type, cells) {
  const ship = new Ship (type, null);
  const randomizer = Math.random();
  let direction;
  if (randomizer > 0.5) direction = 'vertical';
  else direction = 'horizontal';

  let startRow = Math.floor(randomizer * 9);
  let startColumn = Math.floor(randomizer * 9);
  let targetCells;

  if (direction === 'horizontal') {
    if (startColumn + ship.length > 9) return computerShipPlacement(type,cells);
    targetCells = cells.rows[startRow].slice(startColumn, startColumn + ship.length);
    const check = targetCells.find((cell) => cell.filled === true);
    if (check) return computerShipPlacement(type, cells);
  }

  if (direction === 'vertical') {
    if (startRow + ship.length > 9) return computerShipPlacement(type,cells);
    targetCells = cells.columns[startColumn].slice(startRow, startRow + ship.length);
    const check = targetCells.find((cell) => cell.filled === true);
    if (check) return computerShipPlacement(type, cells);
  }

  ship.place(targetCells);
  computerShips.push(ship);
  if (computerShips.length > 5) computerShips = [ship];

  targetCells.forEach((cell) => {
    cell.filled = true;
    cell.occupyingShip = ship;
  })
}

export function cellsCalc(player) {
  const cells = Array.from(document.querySelectorAll(`.${player}Cell`));
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
