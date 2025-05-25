let cells = [];
let currentPlayer = "X";
let gameOver = false;

const board = document.getElementById("board");
const statusText = document.getElementById("gameStatus");

function createBoard() {
  board.innerHTML = "";
  cells = [];
  gameOver = false;
  currentPlayer = "X";
  statusText.textContent = "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleClick(i));
    board.appendChild(cell);
    cells.push(cell);
  }
}

function handleClick(i) {
  if (gameOver || cells[i].textContent) return;

  cells[i].textContent = currentPlayer;

  if (checkWinner()) {
    statusText.textContent = `🎉 Player ${currentPlayer} wins!`;
    gameOver = true;
  } else if (cells.every(cell => cell.textContent)) {
    statusText.textContent = "🤝 It's a draw!";
    gameOver = true;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = `Player ${currentPlayer}'s turn`;
  }
}

function checkWinner() {
  const combos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  return combos.some(([a,b,c]) =>
    cells[a].textContent &&
    cells[a].textContent === cells[b].textContent &&
    cells[b].textContent === cells[c].textContent
  );
}

window.resetGame = function () {
  createBoard();
};

// Auto-create on load
createBoard();
