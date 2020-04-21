let font;
const randomSeed = Math.random();

let gameBoard = new Board(); // Uses 'Tile'
let virtualBoard = new Board(); // Uses 'Virtual Tile'

function preload() {
  font = loadFont('assets/Montserrat-ExtraBold.ttf');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  textFont(font);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);

  spawnRandomTile(gameBoard);
  spawnRandomTile(gameBoard);
}

function draw() {
  background(20);
  drawBase();
  drawTiles();
  drawVisualization();
}

// Draw base. And show score of gameBoard.
function drawBase() {
  push();
  translate((width + (factor * (1 - matSize))) / 2, (height + (factor * (1 - matSize))) / 2);
  fill(30);
  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize; j++) {
      square(i * factor, j * factor, factor * 0.95, factor * 0.95, roundedCorner);
    }
  }
  pop();
}

// Drawing tiles on gameBoard.
function drawTiles() {
  push();
  translate((width + (factor * (1 - matSize))) / 2, (height + (factor * (1 - matSize))) / 2);
  for (let i = 0; i < matSize; i++) {
    for (let j = 0; j < matSize; j++) {
      if (gameBoard.matrix[i][j]) {
        gameBoard.matrix[i][j].draw();
      }
    }
  }
  pop();
}

function drawVisualization() {

  push();
    fill(255);
    textSize(50);
    translate(width / 2, 50);
    text('2048 AI', 0, 0);
  pop();

  push();
    fill(170);
    textSize(25);
    translate(width / 2, 135);
    text('REWARDED POINTS : ' + rewardedPoints.toFixed(2), 0, 0);
  pop();

  push();
    fill(255);
    textSize(30);
    translate(width / 2, 190);
    text('SCORE : ' + gameBoard.score, 0, 0);
  pop();

  push();
    fill(170);
    textSize(25);
    push();
      translate(width / 2, height - 180);
      text('MAX DEPTH : ' + maxDepth, 0, 0);
    pop();

    push();
      translate(width / 2, height - 120);
      text('TARGETED TILES : ' + targetTile1 + ' , ' +  targetTile2, 0, 0);
    pop();

    push();
      fill(255);
      translate(width / 2, height - 50);
      text('@smitbarmase', 0, 0);
    pop();
  pop();
}