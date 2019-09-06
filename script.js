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

  const reset = function() {
    current = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
    _activateButtons()
    _render()
  }

  const _activateButtons = function() {
    const buttons = document.querySelectorAll('button')
    buttons.forEach((btn) => btn.addEventListener('click', _makeMove))
  }

  const _deactivateButton = function(button) {
    button.removeEventListener('click', _makeMove)
  }

  const _parseCoord = function(button) {
    return button.dataset.coord.split(",").map((n) => parseInt(n))
  }

  const _makeMove = function(e) {
    const currentPlayer = Game.getCurrentPlayer();
    const button = e.target;
    const coord = _parseCoord(button) 
    _deactivateButton(button)
    _addMove(currentPlayer.symbol, coord)
    _render()
    if (_hasDraw()) Game.endGame('draw');
    else if (_hasWinner(currentPlayer.symbol)) Game.endGame('win');
    else Game.switchPlayer();
  }

  const _addMove = function(playerSymbol, coords) {
    let [x, y] = coords
    current[y][x] = playerSymbol
  }

  const _render = function(board) {
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

  const _hasDraw = function() {
    const boardFull = current.every((row) => row.every((cell) => cell))
    return boardFull && !hasWinner()
  }

  const _animateWinningSeries = function(series) {
    // TODO: change color of winning cells
    console.log('Winning series: (TODO: Replace with animation)')
    console.log(JSON.stringify(series))
  }

  const _hasWinner = function(playerSymbol, board) {
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
      return true;
    } else {
      return false;
    };
  };

  return {
    reset
  }
})();


/* ---------------------------------------- */

const Player = function(name, symbol) {
  let score = 0;

  return {
    symbol,
    score,
    name,
  }
};


/* ---------------------------------------- */

const Game = (function () {
  // TODO: Set up players (human or AI)
  const player1 = Player('Player one', 'X')
  const player2 = Player('Player two', 'O')
  let currentPlayer = player1;

  const newGame = function() {
    currentPlayer = player1;
    Gameboard.reset()
  }

  // A solution to an interesting problem:
  const getCurrentPlayer = () => currentPlayer;
  // Some tests and their results:
  // Game.currentPlayer  -->  (player1)
  // Game.switchPlayer()
  // Game.currentPlayer --> (player1)  -- Why?
  // Game.getCurrentPlayer() --> (player2)
  // Game.currentPlayer = 1
  // Game.currentPlayer   (-->  1)
  // Game.getCurrentPlayer()   --> (still player2)

  const switchPlayer = function () {
    currentPlayer = (currentPlayer == player1) ? player2 : player1;
  }

  const endGame = function(condition) {
    if (condition == 'win') currentPlayer.score += 1
    const message = ((condition == 'win') ? `${currentPlayer.name} wins!` : 
      "It's a draw!") + "\n\nPlay again?"
    if (confirm(message)) newGame();
  }

  return {
    newGame,
    getCurrentPlayer,
    switchPlayer,
    endGame
  }
})();

Game.newGame();