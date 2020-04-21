let prevMaxPoints;
let nextDirIndex;
let playStarted = false;

// Visualization text.
let rewardedPoints = 0;
let targetTile1 = 0;
let targetTile2 = 0;
let maxDepth = 4;


function calculate() {
  let winDir = -1;
  let maxPoints = 0;
  for (let i = 0; i < 4; i++) {
    const points = nextMove(gameBoard, i, maxDepth);
    if (points > maxPoints) {
      maxPoints = points;
      winDir = i;
    }
  }

  if (prevMaxPoints == maxPoints) {
    winDir = Math.floor(Math.random() * 4);
  }
  
  prevMaxPoints = maxPoints;
  nextDirIndex = winDir;
}

function nextMove(sourceBoard, dirIndex, depth) {
  // Make new copy of current state.
  let targetBoard = new Board();
  targetBoard.makeVirtualFrom(sourceBoard);
  // Make move in that direction.
  makeMove(targetBoard, dirIndex);
  // Spawn new tile.
  if (targetBoard.hasMoved) {
    targetBoard.hasMoved = false;
    spawnRandomTile(targetBoard);
  }

  // Check if depth reached.
  if (depth == 0 || isGameOver(targetBoard) == true) {
    // If reached.
    const maxList = getMaxTiles(targetBoard);
    const dist = p5.Vector.dist(maxList[0].pos, maxList[1].pos);
    const reward = maxList[0].num + maxList[1].num + targetBoard.score;
    targetTile1 = maxList[0].num;
    targetTile2 = maxList[1].num;
    rewardedPoints = (reward / 10) + (1 / dist);
    return rewardedPoints;
  } else {
    // If not reached.
    let maxPoints = 0;
    for (let i = 0; i < 4; i++) {
      const points = nextMove(targetBoard, i, depth - 1);
      if (points > maxPoints) {
        maxPoints = points;
      }
    }
    return maxPoints;
  }
}

async function play() {
  while (isGameOver(gameBoard) == false) {
    calculate();
    makeMove(gameBoard, nextDirIndex);
    if (gameBoard.hasMoved) {
      gameBoard.hasMoved = false;
      spawnRandomTile(gameBoard);
      await sleep(500);
    }
  }
}