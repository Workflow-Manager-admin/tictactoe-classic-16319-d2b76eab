import './style.css'
import { TicTacToeApp } from './tictactoe'

// Replace #app contents with a new div for our game
const appRoot = document.querySelector<HTMLDivElement>('#app')
if (appRoot) {
  appRoot.innerHTML = `<div id="ttt-app"></div>`;
  // Mount the TicTacToe game
  new TicTacToeApp("ttt-app");
}
