// Tic tac toe ~

/* ***** Planning: *****

GAMEBOARD:
-Stores state of board
-Adds move
-Determines winner

PLAYER:
-Makes move
-Switches to other player
-Stores a score?

GAME:
-Prompts a player for a move
-Switches player
-Calls to display board
-Displays winner
-Keeps score

DISPLAY ADAPTER: (Done, achieved in Gameboard module)
-Prints gameboard out using DOM
*/

const Gameboard = (function() {
  let current = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
  let sample = [
    ['X', 'O', 'X'],
    ['O', 'X', 'X'],
    ['O', 'O', 'X']
  ]

  const reset = function() {
    current = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
  }

  const addMove = function(playerSymbol, coords) {
    let [x, y] = coords
    current[y][x] = playerSymbol
  }

  const render = function(board) {
    let buttonIndex = 0
    board = board || current
    board.forEach((row) => {
      row.forEach((cell) => {
        const button = document.getElementById(`btn${buttonIndex}`)
        button.textContent = cell || ""
        buttonIndex += 1;
      })
    })
  }

  const hasDraw = function() {
    const boardFull = current.every((row) => row.every((cell) => cell))
    return boardFull && !hasWinner()
  }

  const _animateWinningSeries = function(series) {
    // TODO: change color of winning cells
    console.log('Winning series: (TODO: Replace with animation)')
    console.log(series)
  }

  const hasWinner = function(playerSymbol, board) {
    /* Note: this could be optimized slightly by taking coord and player as args and filtering possible series by those */
    board = board || current

    const possibleSeries = [
      [ [0,0],[1,0],[2,0] ], /* Rows */
      [ [0,1],[1,1],[2,1] ],
      [ [0,2],[1,2],[2,2] ],
      [ [0,0],[0,1],[0,2] ], /* Columns */
      [ [1,0],[1,1],[1,2] ],
      [ [2,0],[2,1],[2,2] ],
      [ [0,0],[1,1],[2,2] ], /* Diagonals */
      [ [0,2],[1,1],[2,0] ]
    ]

    const winningSeries = possibleSeries.find((series) => {
      return series.every((coord) => {
        let [x, y] = coord
        return board[y][x] == playerSymbol
      });
    });

    if (winningSeries) {
      _animateWinningSeries(winningSeries)
      return true
    }
    return false
  }

  return {
    current,
    reset,
    render,
    addMove,
    hasDraw,
    hasWinner,
  }
})();


/* ---------------------------------------- */

const Player = function(name, symbol) {
  let score = 0;

  const makeMove = function (coord) {
    // Maybe this doesn't need to be in a player object
    Gameboard.addMove(symbol, coord)
  }

  return {
    symbol,
    score,
    name,
    makeMove
  }
};


/* ---------------------------------------- */

const Game = (function () {
  // TODO: Set up players (human or AI)
  const player1 = Player('player one', 'X')
  const player2 = Player('player two', 'O')
  let currentPlayer;

  const newGame = function() {
    currentPlayer = player1;
    Gameboard.reset()
    Gameboard.render()
    activateButtons()
  }

  const activateButtons = function() {
    const buttons = document.querySelectorAll('button')
    buttons.forEach((btn) => btn.addEventListener('click', makeMove))
  }

  const makeMove = function(e) {
    e.target.removeEventListener('click', makeMove)
    let coord = e.target.dataset.coord.split(",").map((n) => parseInt(n))
    currentPlayer.makeMove(coord)
    Gameboard.render()
    // TODO: Compartmentalize logic here
    if (Gameboard.hasDraw()) { 
      const drawPrompt = "It's a draw!\n\nPlay again?"
      if (confirm(drawPrompt)) newGame();
    } else if (Gameboard.hasWinner(currentPlayer.symbol)) {
      currentPlayer.score += 1
      const winPrompt = `${currentPlayer.name} wins!\n\nPlay again?`;
      if (confirm(winPrompt)) newGame();
      // TODO: show winning play
    }
    switchPlayer()
  }

  const switchPlayer = function () {
    currentPlayer = (currentPlayer == player1) ? player2 : player1;
  }

  return {
    newGame,
  }
})();

Game.newGame();