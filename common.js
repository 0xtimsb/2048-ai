// This file contains functions used by both game and ai.
function keyPressed() {
  if (isGame) {
    if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW || keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
      if (keyCode === LEFT_ARROW) {
        makeMove(gameBoard, 0);
      } else if (keyCode === RIGHT_ARROW) {
        makeMove(gameBoard, 1);
      } else if (keyCode === UP_ARROW) {
        makeMove(gameBoard, 2);
      } else if (keyCode === DOWN_ARROW) {
        makeMove(gameBoard, 3);
      }
      if (gameBoard.hasMoved) {
        gameBoard.hasMoved = false;
        spawnRandomTile(gameBoard);
      }
    }
  } else {
    if (!playStarted) {
      playStarted = true;
      play();
    }
  }
}

function makeMove(board, dirIndex) {
  board.direction.set(direction[dirIndex]);
  switch (dirIndex) {
    case 0:
      //Swipe Left. Matrix transverse right.
      for (let j = 0; j < matSize; j++) {
        for (let i = 0; i < matSize; i++) {
          if (board.matrix[i][j]) {
            board.matrix[i][j].move(board);
          }
        }
      }
      break;
    case 1:
      //Swipe Right. Matrix transverse left.
      for (let j = 0; j < matSize; j++) {
        for (let i = matSize - 1; i > -1; i--) {
          if (board.matrix[i][j]) {
            board.matrix[i][j].move(board);
          }
        }
      }
      break;
    case 2:
      //Swipe Up. Matrix transverse down.
      for (let i = 0; i < matSize; i++) {
        for (let j = 0; j < matSize; j++) {
          if (board.matrix[i][j]) {
            board.matrix[i][j].move(board);
          }
        }
      }
      break;
    case 3:
      //Swipe Down. Matrix transverse up.
      for (let i = 0; i < matSize; i++) {
        for (let j = matSize - 1; j > -1; j--) {
          if (board.matrix[i][j]) {
            board.matrix[i][j].move(board);
          }
        }
      }
      break;
  }
}

function isGameOver(board) {
  // If there are spots, then game is not over.
  if (getAvailableSpots(board).length != 0) {
    return false;
  }
  // Else, check grid to find possibility. Vertically.
  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize - 1; j++) {
      if (board.matrix[i][j].num == board.matrix[i][j + 1].num) {
        return false; // Still, game is not over.
      }
    }
  }
  // Else, check grid to find possibility. Horizontally.
  for (let j = 0; j < matSize; j++) {
    for (let i = 0; i < matSize - 1; i++) {
      if (board.matrix[i][j].num == board.matrix[i + 1][j].num) {
        return false; // Still, game is not over.
      }
    }
  }
  return true;
}

function spawnRandomTile(board) {
  let randomSeed2 = 0;
  const availableSpots = getAvailableSpots(board);

  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize; j++) {
      if (board.matrix[i][j]) {
        randomSeed2 += board.matrix[i][j].num + i + j;
      }
    }
  }
  const random =(100 * randomSeed) + randomSeed2;
  // Function creates random but certain tiles for every state.
  const index =   Math.floor(random % availableSpots.length);
  const i = availableSpots[index][0];
  const j = availableSpots[index][1];
  const num =  Math.floor(random % 10) < 9 ? 2 : 4;
  if (board == gameBoard) {
    board.matrix[i][j] = new Tile(i, j, num);
  } else {
    board.matrix[i][j] = new VirtualTile(i, j, num);
  }
}

function getAvailableSpots(board) {
  let availableSpots = [];
  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize; j++) {
      if (!board.matrix[i][j]) {
        availableSpots.push([i, j]);
      }
    }
  }
  return availableSpots;
}

function getMaxTiles(board) {
  let max = null;
  let secMax = null;
  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize; j++) {
      if (board.matrix[i][j]) {
        if (max) {
          if (max.num < board.matrix[i][j].num) {
            secMax = max;
            max = board.matrix[i][j];
          } else { // less or equal than max.
            if (secMax) {
              if (secMax.num <= board.matrix[i][j].num) {
                secMax = board.matrix[i][j];
              }
            } else {
              secMax = board.matrix[i][j];
            }
          }
        } else {
          max = board.matrix[i][j];
        }
      }
    }
  }
  return [max, secMax];
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}