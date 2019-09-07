// Tic tac toe ~

/* ***** Planning: *****

GAMEBOARD:
-Stores state of board
-Renders board
-Handles interaction
-Adds move
-Determines winner/draw

PLAYER:
-Gets a move (waits for a human; runs algorithm for AI)
-Stores a score, name, and symbol (X or O)

AI:
-Chooses and makes a move based on algorithm choice

GAME:
-Prompts a player for a move
-Switches player
-Calls to display board
-Ends game, displays winner
-Keeps score
*/

const Gameboard = (function() {
  let current = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]

  const getCurrent = () => current;

  const reset = function() {
    current = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
    _activateButtons()
    _render()
  }

  const deactivate = function() {
    // Logic might need to change...
    const buttons = document.querySelectorAll('#board button');
    buttons.forEach((button) => _deactivateButton(button));
  }

  const _activateButtons = function() {
    const buttons = document.querySelectorAll('#board button')
    buttons.forEach((btn) => {
      btn.addEventListener('click', _chooseMove);
      btn.classList.remove('winning-series');
    });
  }

  const _deactivateButton = function(button) {
    /*/ Maybe need to refactor to select button by coord OR button:  
    --- Note: This code sometimes throws a "button is undefined" error ---
    
    const _deactivateButton = function(id) {
    let button;
    if (id instanceof Array) { 
      id = id.join(',');
      button = document.querySelector(`button[data-coord="${id}"]`);
    }
    else if (id instanceof HTMLFormElement) { 
      button = id;
    }  
    */
    button.removeEventListener('click', _chooseMove)
  }

  const _parseCoord = function(button) {
    return button.dataset.coord.split(",").map((n) => parseInt(n))
  }

  const _chooseMove = function(e) {
    addMove(_parseCoord(e.target))
  }

  const addMove = function(coord) {
    const [x, y] = coord
    const playerSymbol = Game.getCurrentPlayer().symbol
    current[y][x] = playerSymbol

    const id = coord.join(',');
    const button = document.querySelector(`button[data-coord="${id}"]`)
    _deactivateButton(button) // Maybe move logic above to "deactivate"?

    _render()
    if (_hasDraw()) Game.endGame('draw');
    else if (_hasWinner()) Game.endGame('win');
    else Game.switchPlayer();
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
    getCurrent,
    addMove,
    reset,
    deactivate
  }
})();

const AI = (function() {
  const getRandomMove = function() {
    // WORKING
    let possibleMoves = _getPossibleMoves();
    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    return possibleMoves[randomIndex];
  }

  const getMinimaxMove = function() {
    // TODO
    console.log('(TODO): getting minimax move!');
  }

  const _getPossibleMoves = function() {
    const currentBoard = Gameboard.getCurrent();
    let possibleMoves = [];
    currentBoard.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val === null) possibleMoves.push([x,y])
      })
    });
    return possibleMoves;
  }

  return {
    getRandomMove,
    getMinimaxMove
  }
})();


/* ---------------------------------------- */

const Player = function(symbol, name, type) {
  // TODO: Handle types (Human or AI)
  // Three types: 'human', 'randAI', or 'minimaxAI'

  let score = 0;

  const getMove = function() {
    let coord;
    switch (type) {
      case 'human':
        return;
      case 'randAI':
        // WORKING: get random move
        coord = AI.getRandomMove();
        Gameboard.addMove(coord)
        break;
      case 'minimaxAI':
        // TODO: get minimaxed move
        coord = AI.getMinimaxMove();
    }
    // Gameboard.addMove(coord)
  }

  return {
    symbol,
    score,
    name,
    getMove,
  }
};


/* ---------------------------------------- */

const Game = (function () {
  // DONE: Set up players (choose human or AI; choose name)
  // TODO: Get moves from AI
  
  let player1 = Player('X', 'Player one', 'human') // Default
  let player2 = Player('O', 'Player two', 'human')
  let currentPlayer = player1;

  // A solution to an interesting problem, see notes at bottom
  const getCurrentPlayer = () => currentPlayer;

  const submitOptions = function() {
    const formContents = document.getElementById('options').elements
    player1 = Player('X', 
      formContents['p1-name'].value, 
      formContents['p1-type'].value);
    player2 = Player('O', 
      formContents['p2-name'].value, 
      formContents['p2-type'].value);
    newGame();
    _toggleForm();
    _toggleScores();
  }

  const resetGame = function() {
    Gameboard.reset();
    Gameboard.deactivate();
    _toggleScores();
    _toggleForm();
  }

  const newGame = function() {
    Gameboard.reset();
    _updateScores();
    currentPlayer = player1;
    currentPlayer.getMove();
  }

  const switchPlayer = function () {
    currentPlayer = (currentPlayer == player1) ? player2 : player1;
    currentPlayer.getMove();
  }

  const endGame = function(condition) {
    Gameboard.deactivate();
    if (condition == 'win') currentPlayer.score += 1
    _updateScores();
    const message = ((condition == 'win') ? `${currentPlayer.name} wins!` : 
      "It's a draw!") + "\n\nPlay again?"
    // TODO: Change this from a confirm dialog
    if (confirm(message)) newGame();
  }

  const _updateScores = function() {
    const scoreboard = document.getElementById('scores');
    const message = `${player1.name}: ${player1.score}, ` +
      `${player2.name}: ${player2.score}.`;
    scoreboard.textContent = message;
  }

  const _toggleForm = function() {
    document.getElementById('options').classList.toggle('hidden');
  }

  const _toggleScores = function() {
    document.getElementById('scores-div').classList.toggle('hidden');
  }

  // Question: what scope does this belong in?
  const newGameButton = document.getElementById('new-game'); 
  newGameButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to start this game over?')) newGame()
  });

  const resetButton = document.getElementById('reset');
  resetButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset?')) resetGame()
  });

  return {
    submitOptions,
    newGame,
    getCurrentPlayer,
    switchPlayer,
    endGame
  }
})();

// Puzzle mentioned above:
  // Some tests and their results:
  // Game.currentPlayer  -->  (player1)
  // Game.switchPlayer()
  // Game.currentPlayer --> (player1)  -- Why?
  // Game.getCurrentPlayer() --> (player2)
  // Game.currentPlayer = 1
  // Game.currentPlayer   (-->  1)
  // Game.getCurrentPlayer()   --> (still player2)