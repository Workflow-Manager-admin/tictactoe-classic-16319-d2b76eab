//
// Main TicTacToe Classic game container -- TypeScript, in-browser only
// Implements: 3x3 clickable grid, turn/status/result, win/draw detection, reset button, styled to app colors/theme
//

// Board and play state
type Player = "X" | "O";
type CellValue = Player | "";
type GameStatus = "playing" | "won" | "draw";

// Helper: winning line indices
const WIN_LINES: number[][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6],            // Diagonals
];

// --- PUBLIC_INTERFACE
export class TicTacToeApp {
  private container: HTMLElement;
  private board: CellValue[];
  private current: Player;
  private status: GameStatus;
  private winner: Player | null;
  private winningLine: number[] | null;

  constructor(containerId: string) {
    const el = document.getElementById(containerId);
    if (!el) throw new Error(`Container #${containerId} not found`);
    this.container = el;
    this.board = Array(9).fill("");
    this.current = "X";
    this.status = "playing";
    this.winner = null;
    this.winningLine = null;

    this.render();
  }

  // PUBLIC_INTERFACE
  /** Resets the game to initial state. */
  public resetGame(): void {
    this.board = Array(9).fill("");
    this.current = "X";
    this.status = "playing";
    this.winner = null;
    this.winningLine = null;
    this.render();
  }

  /** Handler: when a square is clicked. */
  private handleCellClick(index: number): void {
    if (this.status !== "playing" || this.board[index]) return;
    this.board[index] = this.current;
    this.checkGameEnd();
    if (this.status === "playing") {
      this.current = this.current === "X" ? "O" : "X";
    }
    this.render();
  }

  /** Check for win or draw. */
  private checkGameEnd(): void {
    // Win check
    for (const line of WIN_LINES) {
      const [a, b, c] = line;
      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.status = "won";
        this.winner = this.board[a] as Player;
        this.winningLine = line;
        return;
      }
    }
    // Draw?
    if (this.board.every(cell => !!cell)) {
      this.status = "draw";
      this.winner = null;
      this.winningLine = null;
    }
  }

  /** Render the board, status, and controls to the container. */
  private render(): void {
    this.container.innerHTML = `
      <div class="ttt-outer">
        <div class="ttt-board">
          ${this.board.map((cell, i) =>
            `<button class="ttt-cell${this.isWinningCell(i) ? " ttt-cell-win" : ""}"
                     data-index="${i}" ${cell || this.status !== "playing" ? "disabled" : ""}>
               ${cell}
            </button>`
          ).join("")}
        </div>
        <div class="ttt-status">
          ${this.getStatusMessage()}
        </div>
        <button class="ttt-reset" id="ttt-reset-btn">Reset</button>
      </div>
    `;
    this.registerEvents();
  }

  /** Helper: status message html */
  private getStatusMessage(): string {
    if (this.status === "won" && this.winner)
      return `<span class="ttt-winmsg">Winner: <b>${this.winner}</b></span>`;
    if (this.status === "draw")
      return `<span class="ttt-drawmsg">It's a draw!</span>`;
    return `Turn: <b>${this.current}</b>`;
  }

  private isWinningCell(i: number): boolean {
    return (this.winningLine && this.winningLine.includes(i)) || false;
  }

  /** Register click handlers for cells and reset. */
  private registerEvents(): void {
    const btns = Array.from(this.container.querySelectorAll<HTMLButtonElement>(".ttt-cell"));
    btns.forEach(btn => {
      const idx = btn.dataset.index;
      if (idx && !this.board[+idx] && this.status === "playing") {
        btn.onclick = () => this.handleCellClick(+idx);
      } else {
        btn.onclick = null;
      }
    });
    const resetBtn = this.container.querySelector<HTMLButtonElement>("#ttt-reset-btn");
    if (resetBtn) resetBtn.onclick = () => this.resetGame();
  }
}
