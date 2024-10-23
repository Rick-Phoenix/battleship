export const body = document.querySelector('body');
export const main = document.querySelector('main');
export const nav = document.querySelector('nav');
export const board = document.querySelector('div.board');
export const draggable = document.querySelector('div.draggable');
export const cells = () => {
  window.addEventListener('DOMContentLoaded', () => {
    return Array.from(document.querySelectorAll('.cell'));
  })
}