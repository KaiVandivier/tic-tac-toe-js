// Tic tac toe ~

const PageDisplay = (function() {
  /* ------------ Public functions ------------------- */

  const activateButtons = function() {
    const buttons = document.querySelectorAll('#board button')
    buttons.forEach((btn) => {
      btn.addEventListener('click', _chooseMove);
      btn.classList.remove('winning-series');
    });
  };

  const animateWinningSeries = function(series) {
    series = series || Gameboard.winningSeries();
    const ids = series.map((coord) => coord.join(','))
    const buttons = ids.map((id) => {
      return document.querySelector(`button[data-coord="${id}"]`)
    })
    buttons.forEach((button) => button.classList.add('winning-series'))
  }

  const deactivateBoard = function() {
    const buttons = document.querySelectorAll('#board button');
    buttons.forEach((button) => deactivateButton(button));
  }

  const deactivateButton = function(button) {
    button.removeEventListener('click', _chooseMove)
  };

  const findButtonByCoord = function(coord) {
    return document.querySelector(`button[data-coord="${coord.join(',')}"]`);
  };

  const renderBoard = function(board) {
    board = board || Gameboard.getCurrent()
    let buttonIndex = 0
    board.forEach((row) => {
      row.forEach((cell) => {
        const button = document.getElementById(`btn${buttonIndex}`)
        button.textContent = cell || ""
        buttonIndex += 1;
      })
    })
  };

  const submitForm = function() {
    const formContents = document.getElementById('options').elements
    const p1Name = formContents['p1-name'].value;
    const p1Type = formContents['p1-type'].value;
    const p2Name = formContents['p2-name'].value; 
    const p2Type = formContents['p2-type'].value;
    Game.setUpPlayers(p1Name, p1Type, p2Name, p2Type);
    Game.newGame();
    toggleForm();
    toggleScores();
  };

  const toggleForm = function() {
    document.getElementById('options').classList.toggle('hidden');
  };

  const toggleScores = function() {
    document.getElementById('scores-div').classList.toggle('hidden');
  };

  const updateScores = function() {
    const scoreboard = document.getElementById('scores');
    const message = `${Game.getPlayer1().name}: ${Game.getPlayer1().score}, ` +
      `${Game.getPlayer2().name}: ${Game.getPlayer2().score}.`;
    scoreboard.textContent = message;
  }

  /* ------------ Private functions ------------------- */

  const _chooseMove = function(e) { // callback for board clicks
    Gameboard.addMove(_parseCoord(e.target))
  }

  const _parseCoord = function(button) { // helper for _chooseMove
    return button.dataset.coord.split(",").map((n) => parseInt(n))
  }

  /*  ----------- Set up buttons on page -------------- */

  // New Game button
  document.getElementById('new-game').addEventListener('click', () => {
    if (confirm('Are you sure you want to start this game over?')) Game.newGame()
  });

  // Reset Players and Scores button
  document.getElementById('reset').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset?')) Game.resetGame()
  });
  
  return {
    activateButtons,
    animateWinningSeries,
    deactivateBoard,
    deactivateButton,
    findButtonByCoord,
    renderBoard,
    submitForm,
    toggleForm,
    toggleScores,
    updateScores,
  }
})();

/* ------------------------------------------------------ */

const Gameboard = (function() {
  let current = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]

  const getCurrent = () => current;

  const addMove = function(coord) {
    const [x, y] = coord
    const playerSymbol = Game.getCurrentPlayer().symbol
    current[y][x] = playerSymbol

    PageDisplay.deactivateButton(PageDisplay.findButtonByCoord(coord))
    PageDisplay.renderBoard()

    if (hasDraw()) Game.endGame('draw');
    else if (hasWinner()) Game.endGame('win');
    else Game.switchPlayer();
  }

  const getPossibleMoves = function(board) {
    const currentBoard = board || current;
    let possibleMoves = [];
    currentBoard.forEach((row, y) => {
      row.forEach((val, x) => {
        if (val === null) possibleMoves.push([x,y])
      })
    });
    return possibleMoves;
  }

  const hasDraw = function(board) {
    board = board || current;
    const boardFull = board.every((row) => row.every((cell) => cell))
    return boardFull && !hasWinner(board);
  }

  const hasWinner = function(board) {
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
    return possibleSeries.some((series) => {
      return series.every((coord) => {
        let [x, y] = coord
        return board[y][x] == 'X'
      }) || series.every((coord) => {
        let [x, y] = coord;
        return board[y][x] == 'O'
      });
    }); 
  };
  
  const reset = function() {
    current = [
      [null, null, null],
      [null, null, null],
      [null, null, null]
    ]
    PageDisplay.activateButtons()
    PageDisplay.renderBoard(current)
  }

  const testMove = function(coord, board, symbol) { // Used by AI
    const newBoard = board.map((row) => [...row]);
    const [x, y] = coord;
    newBoard[y][x] = symbol;
    return newBoard;
  }

  const winningSeries = function(board, playerSymbol) {
    board = board || current;
    playerSymbol = playerSymbol || Game.getCurrentPlayer().symbol;
    const possibleSeries = [
      [ [0,0],[1,0],[2,0] ], /* Rows */
      [ [0,1],[1,1],[2,1] ],
      [ [0,2],[1,2],[2,2] ],
      [ [0,0],[0,1],[0,2] ], /* Columns */
      [ [1,0],[1,1],[1,2] ],
      [ [2,0],[2,1],[2,2] ],
      [ [0,0],[1,1],[2,2] ], /* Diagonals */
      [ [0,2],[1,1],[2,0] ]
    ];
    return possibleSeries.find((series) => {
      return series.every((coord) => {
        let [x, y] = coord
        return board[y][x] == playerSymbol
      });
    });
  }

  return {
    addMove,
    getCurrent,
    getPossibleMoves,
    hasDraw,
    hasWinner,
    reset,
    testMove,
    winningSeries,
  }
})();

/* ---------------------------------------------------------------- */

const AI = (function() {
  const getMinimaxMove = function(board, playerSymbol) {
    board = board || Gameboard.getCurrent();
    // (Temporary: set max/min player here; tidy up later):
    playerSymbol = playerSymbol || Game.getCurrentPlayer().symbol;
    const maximizingPlayer = (playerSymbol == 'X')
    // For each move, get its minimax score (minimax function), set up an object
    const possibleMoves = Gameboard.getPossibleMoves(board);
    const movesAndScores = possibleMoves.map((move) => {
      return { 
        'move': move, 
        'score': _minimax(move, board, maximizingPlayer)
      };
    });
    // Sort array by value of score property; choose move with the highest score
    movesAndScores.sort((a, b) => a['score'] - b['score']);
    const moveChoiceIndex = (maximizingPlayer) ? movesAndScores.length - 1 : 0;
    return movesAndScores[moveChoiceIndex]['move'];
  }

  const getRandomMove = function() {
    const possibleMoves = Gameboard.getPossibleMoves();
    const randomIndex = Math.floor(Math.random() * possibleMoves.length)
    return possibleMoves[randomIndex];
  }

  const _minimax = function(coord, currentBoard, maximizingPlayer) {
    // Find state of board from possible move
    const playerSymbol = (maximizingPlayer) ? 'X' : 'O';
    const possibleBoard = Gameboard.testMove(coord, currentBoard, playerSymbol);
    // Check if winner/draw; return heuristic value if so:
    if (Gameboard.hasDraw(possibleBoard)) return 0;
    if (Gameboard.hasWinner(possibleBoard)) return (maximizingPlayer) ? 10 : -10;
    // If game is not over, maximize / minimize
    const possibleMoves = Gameboard.getPossibleMoves(possibleBoard);
    if (maximizingPlayer) {
      let value = Infinity;
      possibleMoves.forEach((possibleMove) => {
        value = Math.min(value, _minimax(possibleMove, possibleBoard, false))
      });
      return value;   
    } else { /* minimizing player */
      let value = -Infinity;
      possibleMoves.forEach((possibleMove) => {
        value = Math.max(value, _minimax(possibleMove, possibleBoard, true));
      });
      return value; 
    }
  }

  return {
    getMinimaxMove,
    getRandomMove,
  }
})();

/* ---------------------------------------- */

const Player = function(symbol, name, type) {
  let score = 0;

  const getMove = function() {
    let coord = null;
    switch (type) {
      case 'human':
        return;
      case 'randAI':
        coord = AI.getRandomMove();
        break;
      case 'minimaxAI':
        coord = AI.getMinimaxMove();
    }
    Gameboard.addMove(coord)
  }

  return {
    getMove,
    name,
    score,
    symbol,
  }
};


/* ---------------------------------------- */

const Game = (function () {
  let player1 = Player('X', 'Player one', 'human')
  let player2 = Player('O', 'Player two', 'human')
  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;
  const getPlayer1 = () => player1;
  const getPlayer2 = () => player2;

  const endGame = function(condition) {
    PageDisplay.deactivateBoard();
    if (condition == 'win') {
      currentPlayer.score += 1;
      PageDisplay.animateWinningSeries();
    };
    PageDisplay.updateScores();
    const message = ((condition == 'win') ? `${currentPlayer.name} wins!` : 
      "It's a draw!") + "\n\nPlay again?";
    if (confirm(message)) newGame();
  }

  const newGame = function() {
    Gameboard.reset();
    PageDisplay.updateScores();
    currentPlayer = player1;
    currentPlayer.getMove();
  }

  const resetGame = function() {
    Gameboard.reset();
    PageDisplay.deactivateBoard();
    PageDisplay.toggleScores();
    PageDisplay.toggleForm();
  }

  const setUpPlayers = function(p1Name, p1Type, p2Name, p2Type) {
    player1 = Player('X', p1Name, p1Type);
    player2 = Player('O', p2Name, p2Type);
  }

  const switchPlayer = function () {
    currentPlayer = (currentPlayer == player1) ? player2 : player1;
    currentPlayer.getMove(); 
    // Maybe move this into a "takeTurn()" function
    // "takeTurn()"" will also check for a winner and stuff
  }

  return {
    endGame,
    newGame,
    getCurrentPlayer,
    getPlayer1,
    getPlayer2,
    resetGame,
    setUpPlayers,
    switchPlayer,
  }
})();