# tic-tac-toe-js

This is a simple Tic-Tac-Toe game in which the players can be humans or AI. It includes a minimax AI algorithm for the AI, which is unbeatable!  It was made as an exercise in practicing JavaScript.


TODO:

-Speed up execution with caching

-Form~: Find a way to avoid using JS in the HTML

-Immediately display the move a player chooses, i.e. before performing calculations to get AI move
  -Also, make a small delay before playing move for aesthetic purposes

-Better compartmentalize logic in Gameboard.addMove(), perhaps by better handling how to get moves from players and AI

-Simplify and tidy up "current player"/"maximizing player" logic in AI.getMinimaxMove()

-Change "play again?" dialog to something nicer than "confirm"



DONE:
-Move testMove() into Gameboard. 
-Move getPossibleMoves() into Gameboard. 
-Alphabetize functions. 
-Sort out "deactivateButton()" logic; maybe it's fine
  -Maybe make a "getButtonByCoord()" function in PageDisplay
-Sort display elements into Page Display (scores, buttons, etc)
  -submitForm()
  -newGameButton
  -resetGameButton
  -toggleForm()
  -toggleScores()
  -updateScores()
-Sort many of the board display features into PageDisplay
-Get Minimax AI working
-Animate winning series
-Optimize "Gameboard.hasWinner()" a bit