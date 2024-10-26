import "./Styles/styles.css";
import * as nodes from "./Modules/selectors";
import { createElement, populateBoard, placeShip, getImages, cellsCalc, isOverlapping, computerShipPlacement, getShips, } from "./Modules/functions";
import { GameBoard, Ship } from "./Modules/classes";

let playerCells; 
let playerShips;
let computerCells;
let computerShips;
let gameBoard;

function gameOver() {
  nodes.dialog.style.setProperty('--instructions', "");
  nodes.dialog.showModal();
  const gameOver = createElement('h1');
  gameOver.textContent = `${gameBoard.winner} won! Press the button to start another game.`;
  const restartBtn = createElement('button');
  restartBtn.textContent = 'Restart Game';
  nodes.dialog.append(gameOver, restartBtn);
  restartBtn.addEventListener('click', () => {
    nodes.dialog.innerHTML = '';
    nodes.dialog.close();
    initializer();
  })
}

function initializer() {
  nodes.board.innerHTML = '';
  nodes.computerBoard.innerHTML = '';
  populateBoard(nodes.board, 'player');
  populateBoard(nodes.computerBoard, 'computer');
  playerCells = cellsCalc('player');
  computerCells = cellsCalc('computer');
  const ship = document.querySelectorAll('img.ship');
  ship.forEach((ship) => {
    ship.style.opacity = '1';
    const shipType = ship.dataset.type;
    placeShip(ship, shipType, getImages()[`${shipType}-hor.png`], playerCells);
    computerShipPlacement(shipType, computerCells);
    computerShips = getShips()[0];
  });

  nodes.startBtn.addEventListener('click', function startgame() {
    nodes.startBtn.removeEventListener('click', startgame);
    playerShips = getShips()[1];
    if (playerShips.length < 5) return;
    gameBoard = new GameBoard(playerCells, computerCells, playerShips, computerShips);
    const compIcons = document.querySelectorAll('.computerCell');
    compIcons.forEach((icon) => {
      icon.style.setProperty('--test', 'aquamarine');
      icon.onclick = attack;
  
      function attack(e) {
        if (e.target.nodeName !== 'DIV') return;
        const targetCell = computerCells.rows[e.target.dataset.row][e.target.dataset.column];
        if (targetCell.hit) return;
        gameBoard.attack('player', targetCell);
        if (gameBoard.gameOver === true) {
          gameOver();
        }
        if (gameBoard.gameOver === false) {
          gameBoard.computerTurn();
          if (gameBoard.gameOver === true) {
            gameOver();
          }
        }
      }
    })
  })
}

document.addEventListener('DOMContentLoaded', initializer);



