// Tic tac toe ~

/* ***** Planning: *****

GAMEBOARD:
-Stores state of board
-Renders board
-Handles interaction
-Adds move
-Determines winner/draw

PLAYER:
-Stores a score, name, and symbol (X or O)

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
    buttons.forEach((btn) => {
      btn.addEventListener('click', _makeMove);
      btn.classList.remove('winning-series');
    });
  }

  const _deactivateButton = function(button) {
    button.removeEventListener('click', _makeMove)
  }

  const _parseCoord = function(button) {
    return button.dataset.coord.split(",").map((n) => parseInt(n))
  }

  const _makeMove = function(e) {
    const button = e.target;
    const coord = _parseCoord(button) 
    _deactivateButton(button)
    _addMove(coord)
    _render()
    if (_hasDraw()) Game.endGame('draw');
    else if (_hasWinner()) Game.endGame('win');
    else Game.switchPlayer();
  }

  const _addMove = function(coords) {
    const [x, y] = coords
    const playerSymbol = Game.getCurrentPlayer().symbol
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
    return boardFull && !_hasWinner()
  }

  const _animateWinningSeries = function(series) {
    const ids = series.map((coord) => coord.join(','))
    const buttons = ids.map((id) => {
      return document.querySelector(`button[data-coord="${id}"]`)
    })
    buttons.forEach((button) => button.classList.add('winning-series'))
  }

  const _hasWinner = function(board) { // optional argument is useful for testing
    board = board || current
    playerSymbol = Game.getCurrentPlayer().symbol

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
    } 
    else return false;
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
  // TODO: Set up players (choose human or AI)

  const player1 = Player('Player one', 'X')
  const player2 = Player('Player two', 'O')
  let currentPlayer = player1;

  // A solution to an interesting problem, see notes at bottom
  const getCurrentPlayer = () => currentPlayer;

  const newGame = function() {
    currentPlayer = player1;
    Gameboard.reset();
    updateScores();
  }

  const switchPlayer = function () {
    currentPlayer = (currentPlayer == player1) ? player2 : player1;
  }

  const updateScores = function() {
    const scoreboard = document.getElementById('scores');
    const message = `${player1.name}: ${player1.score}. ` +
      `${player2.name}: ${player2.score}.`;
    scoreboard.textContent = message;
  }

  const endGame = function(condition) {
    if (condition == 'win') currentPlayer.score += 1
    updateScores();
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

// Puzzle mentioned above:
  // Some tests and their results:
  // Game.currentPlayer  -->  (player1)
  // Game.switchPlayer()
  // Game.currentPlayer --> (player1)  -- Why?
  // Game.getCurrentPlayer() --> (player2)
  // Game.currentPlayer = 1
  // Game.currentPlayer   (-->  1)
  // Game.getCurrentPlayer()   --> (still player2)