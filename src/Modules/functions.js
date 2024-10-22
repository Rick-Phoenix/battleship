import * as nodes from "./selectors"

export function createElement(type, ...classes) {
  const newElement = document.createElement(type);
  newElement.classList.add(...classes);

  return newElement;
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

export function placeShip() {
  nodes.draggable.onmousedown



  function onMouseDown() {
    nodes.draggable.addEventListener('mousedown', () => {
  
      nodes.draggable.addEventListener('mousemove', (e) => {
        const height = e.target.clientHeight;
        const width = e.target.clientWidth;
        const cells = document.querySelectorAll('.cell');
        window.addEventListener('mousemove', (e) => {
          nodes.draggable.style.position = 'absolute';
          const top = e.clientY - height;
          const left = e.clientX - width;
          nodes.draggable.style.top = `${top}px`;
          nodes.draggable.style.left = `${left}px`;
          const draggableRect = nodes.draggable.getBoundingClientRect();
        })
      })
    
      document.onmouseup = function reset() {
        console.log('1');
        document.onmousemove = null;
        window.onmousemove = null;
        nodes.draggable.onmousemove = null;
        console.log(window.onmousemove);
      }
    })
    
    
    
    function isOverlapping(rect1, rect2) {
      return !(rect1.right < rect2.left || rect1.top > rect2.bottom || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.bottom > rect2.top && rect1.top < rect2.top);
    }
  }
}

