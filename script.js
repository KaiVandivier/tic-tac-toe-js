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

  const addMove = function(player, coords) {
    // TODO
  }

  const render = function(board) {
    // working
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

  // Do these two actually need to be private?
  const _determineDraw = function() {
    // TODO
  }
  const _determineWinner = function() {
    // TODO
  }

  render(sample)

  return {
    current,
    render,
    addMove
  }
})();

/* ---------------------------------------- */

const Game = (function () {
  // TODO
  // Draw board
  Gameboard.render()

  // Set up players (human or AI)
  const player1 = Player('player one')
  const player2 = Player('player two')

  // First player's turn
  let currentPlayer = player1

  // Get player move (and validate)
  let playerChoice = currentPlayer.getMove();

  // Add move (check for ties and winners)
  Gameboard.addMove(playerChoice)
  // (check for ties and winners)

  // Draw board
  Gameboard.render()

  // Switch player
  currentPlayer = (currentPlayer == player1) ? player2 : player1;

  // ... repeat ...
  while (!Gameboard.hasDraw() && !Gameboard.hasWinner()) {
    // ... logic goes here ...
  }

  // When there is a draw or a winner, 
    // end game w/ message
    // update scores
    // offer to play again?

  if (Gameboard.hasDraw()) { 
    // do stuff 
  } else if (Gameboard.hasWinner()) {
    // do other stuff
  }
  
})();

/* ---------------------------------------- */

const Player = function(name) {
  let score = 0;
  let name = name;

  const getMove = function () {
    // TODO
  }

  return {
    score,
    name,
    getMove
  }
};

