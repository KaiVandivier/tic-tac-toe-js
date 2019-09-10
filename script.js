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
    render()
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

    render()
    if (hasDraw()) Game.endGame('draw');
    else if (hasWinner()) Game.endGame('win');
    else Game.switchPlayer();
  }

  const render = function(board) {
    board = board || current
    let buttonIndex = 0
    board.forEach((row) => {
      row.forEach((cell) => {
        const button = document.getElementById(`btn${buttonIndex}`)
        button.textContent = cell || ""
        buttonIndex += 1;
      })
    })
  }

  const hasDraw = function(board, playerSymbol) {
    board = board || current;
    playerSymbol = playerSymbol || Game.getCurrentPlayer().symbol;
    const boardFull = board.every((row) => row.every((cell) => cell))
    return boardFull && !hasWinner(board, playerSymbol);
  }

  const _animateWinningSeries = function(series) {
    // To work with AI, this will have to change
    const ids = series.map((coord) => coord.join(','))
    const buttons = ids.map((id) => {
      return document.querySelector(`button[data-coord="${id}"]`)
    })
    buttons.forEach((button) => button.classList.add('winning-series'))
  }

  const hasWinner = function(board, playerSymbol) { // optional argument is useful for testing
    board = board || current
    playerSymbol = playerSymbol || Game.getCurrentPlayer().symbol

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
      // _animateWinningSeries(winningSeries) // This will have to change with AI
      return true;
    } 
    else return false;
  };

  return {
    getCurrent,
    addMove,
    reset,
    render,
    deactivate,
    hasDraw,
    hasWinner
  }
})();

/* ---------------------------------------------------------------- */

const AI = (function() {
  // Idea for aesthetics: make a small delay before submitting move?

  const getRandomMove = function() {
    const possibleMoves = _getPossibleMoves();
    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    return possibleMoves[randomIndex];
  }

  const getMinimaxMove = function(board, playerSymbol) {
    board = board || Gameboard.getCurrent();
    console.log('(TODO): getting minimax move!');

    // (Temporary: set max/min player here; tidy up later):
    playerSymbol = playerSymbol || Game.getCurrentPlayer().symbol;
    const maximizingPlayer = (playerSymbol == 'X')

    // Get possible moves (working)
    const possibleMoves = _getPossibleMoves(board);

    // For each move, get its minimax score (minimax function)
      // Make an array of objects; {coord: [x,y], score: n}
    const movesAndScores = possibleMoves.map((move) => {
      return { 
        'move': move, 
        'score': minimax(move, board, maximizingPlayer)
      };
    });

    // Sort array by value of score property; choose a move with the highest score
    console.log(movesAndScores); // Testing
    movesAndScores.sort((a, b) => a['score'] - b['score']);
    const moveChoiceIndex = (maximizingPlayer) ? movesAndScores.length - 1 : 0;
    console.log(moveChoiceIndex) // Testing
    return movesAndScores[moveChoiceIndex]['move'];
  }

  const minimax = function(coord, currentBoard, maximizingPlayer) {
    // Find state of board from possible move
    const playerSymbol = (maximizingPlayer) ? 'X' : 'O'; // TODO: Make less sloppy
    const possibleBoard = TestBoard.addMove(coord, currentBoard, playerSymbol);

    // Currently having trouble blocking winning move. Make separate function?
    // "if (move blocks winning move) return (...) ? 10 : -10"
    // How to favor corners? Win-blockers? Winning moves?

    // Bigger problem: All inital moves should be 0; most are currently 10

    // Check if winner/draw; return heuristic value if so
    if (Gameboard.hasDraw(possibleBoard, playerSymbol)) { // working?
      // console.log('draw reached');
      return 0;
    }
    if (Gameboard.hasWinner(possibleBoard, playerSymbol)) { // working
      // console.log('terminal node reached');
      // Gameboard.render(possibleBoard);
      // throw Error;
      return (maximizingPlayer) ? 10 : -10;
    }


    // If game is not over, maximize / minimize
    // An ugly solution: inverted logic from pseudocode below, but it works
    if (maximizingPlayer) {
      let value = Infinity;
      const possibleMoves = _getPossibleMoves(possibleBoard); // D R Y
      possibleMoves.forEach((possibleMove) => {
        value = Math.min(value, minimax(possibleMove, possibleBoard, false))
      });
      return value;   
    } else { /* minimizing player */
      let value = -Infinity;
      const possibleMoves = _getPossibleMoves(possibleBoard);
      possibleMoves.forEach((possibleMove) => {
        value = Math.max(value, minimax(possibleMove, possibleBoard, true));
      });
      return value; 

    }

    /* function minimax(node, depth, maximizingPlayer) is
    if depth = 0 or node is a terminal node then
        return the heuristic value of node
    if maximizingPlayer then
        value := −∞
        for each child of node do
            value := max(value, minimax(child, depth − 1, FALSE))
        return value
    else (* minimizing player *)
        value := +∞
        for each child of node do
            value := min(value, minimax(child, depth − 1, TRUE))
        return value */
  }

  const _getPossibleMoves = function(board) {
    // Maybe this can live in the Gameboard
    const currentBoard = board || Gameboard.getCurrent();
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
    getMinimaxMove,
    minimax,
  }
})();

const TestBoard = (function() {
  // Hmm; maybe instead move display elements out of gameboard and into display controller?  Handle page things from there? I think that's a good idea
  const currentBoard = [];

  const newBoard = function() {
    currentBoard = [
      [null,null,null],
      [null,null,null],
      [null,null,null]
    ];
  }

  const addMove = function(coord, board, symbol) { // working
    const newBoard = board.map((row) => [...row]);
    const [x, y] = coord;
    newBoard[y][x] = symbol;
    return newBoard;
  }

  return {
    addMove
  }
})();

/* ---------------------------------------- */

const Player = function(symbol, name, type) {
  let score = 0;

  const getMove = function() {
    let coord;
    switch (type) {
      case 'human':
        return;
      case 'randAI':
        coord = AI.getRandomMove();
        Gameboard.addMove(coord)
        break;
      case 'minimaxAI':
        // TODO: get minimaxed move
        coord = AI.getMinimaxMove();
        Gameboard.addMove(coord);
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

const testBoard1 = [
  ['O', null, null],
  [null, null, null],
  [null, 'X', 'X']
]
Gameboard.render(testBoard1);
console.log('Testboard 1:');
console.log(testBoard1);
let testVal1 = AI.minimax([2,0], testBoard1, false);
console.log(`Move 2,0: ${testVal1} (Expect 10)`);
let testVal2 = AI.minimax([0,2], testBoard1, false);
console.log(`Move 1,2: ${testVal2} (Expect ?)`);



const testBoard2 = [
  ['X', null, null],
  ['O', null, null],
  [null, null, null]
]
console.log('Testboard 2:');
console.log(testBoard2);
let move = AI.getMinimaxMove(testBoard2, 'X');
console.log('Move on testboard 2: ' + JSON.stringify(move));

const testBoard3 = [
  ['O','X','O'],
  ['X','X',null],
  ['X','O',null],
]
console.log('Testboard 3:');
console.log(testBoard3);
move = AI.getMinimaxMove(testBoard3, 'O');
console.log('Move on testboard 3: ' + JSON.stringify(move));

const testBoard4 = [
  ['O','X','O'],
  ['X',null,null],
  ['X','O',null],
]
console.log('Testboard 4:');
console.log(testBoard4);
move = AI.getMinimaxMove(testBoard4, 'X');
console.log('Move on testboard 4: ' + JSON.stringify(move));