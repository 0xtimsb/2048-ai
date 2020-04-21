class Board {
  constructor() {
    this.score = 0;
    this.matrix = [];
    this.hasMoved = false;
    this.direction = new p5.Vector();

    // Making 2D Matrix.
    for (let i = 0; i < matSize; i++) {
      this.matrix.push([]);
      for (let j = 0; j < matSize; j++) {
        this.matrix[i].push(null);
      }
    }
  }
  makeVirtualFrom(board) {
    this.score = board.score;
    this.direction = board.direction;
    this.hasMoved = board.hasMoved;
    for (let i = 0; i < matSize; i++) {
      for (let j = 0; j < matSize; j++) {
        if (board.matrix[i][j]) {
          this.matrix[i][j] = new VirtualTile(i, j, board.matrix[i][j].num);
        } else {
          this.matrix[i][j] = null;
        }
      }
    }
  }
}

class Tile {
  constructor(x, y, num) {
    this.num = num;
    this.pos = new p5.Vector(x, y); 
    this.drawPos = new p5.Vector(x, y);
    this.scale = 0;
    this.doublingWait = 0;
    this.spawningWait = 0;
    this.isDoubled = false;
    this.reference = null;
    this.color;
    this.setColor(); //Call at very start.
  }

  draw() {
    // Draw reference tile, until it's null again.
    if (this.reference) {
      this.reference.draw();
    }

    if (this.spawningWait < 1) {
      this.spawningWait += 0.025 * speed;
    } else {
      this.spawningWait = 1;
      // Scaling at very first spawn.
      if (this.scale < 1) {
        this.scale += 0.025 * speed;
      } else {
        this.scale = 1;
      }
    }
    
    // When doubling.
    if (this.isDoubled == true) { 
      if (this.doublingWait < 1) {
        this.doublingWait += 0.025 * speed;
      } else {
        this.doubleUp();
      }
    }
    
    // Here lies transition code.
    if (this.pos.equals(this.drawPos) == false) {
      const x = (this.pos.x - this.drawPos.x) * 0.1 * speed;
      const y = (this.pos.y - this.drawPos.y) * 0.1 * speed;
      this.drawPos.set(this.drawPos.x + x, this.drawPos.y + y);
    } else {
      this.drawPos.set(this.pos);
    }
    fill(this.color);
    square(this.drawPos.x * factor, this.drawPos.y * factor, factor * 0.95 * this.scale, factor * 0.95 * this.scale, roundedCorner);
    fill(0);
    textSize(20 * this.scale * factor / 70);
    text(this.num, this.drawPos.x * factor, this.drawPos.y * factor - 3);
  }

  move() {
    // If will transitioning user clicked move.
    if (this.isDoubled) {
      this.doubleUp();
    }
    let dx = this.pos.x + gameBoard.direction.x;
    let dy = this.pos.y + gameBoard.direction.y;
    while ((-1 < dx && dx < matSize) && (-1 < dy && dy < matSize)) {
      // If next tile is null.
      if (!gameBoard.matrix[dx][dy]) {
        gameBoard.matrix[dx][dy] = gameBoard.matrix[this.pos.x][this.pos.y];
        gameBoard.matrix[this.pos.x][this.pos.y] = null;
        this.pos.set(dx, dy);
        // Calculating delta for next step.
        dx = this.pos.x + gameBoard.direction.x;
        dy = this.pos.y + gameBoard.direction.y;
        // Enabling has moved toggle.
        gameBoard.hasMoved = true;
      } else { // If next tile is not null.
        if (gameBoard.matrix[dx][dy].num == this.num) { // It is of same number.
          if (gameBoard.matrix[dx][dy].isDoubled == false) { // To stop repeated doubles.
            gameBoard.score += gameBoard.matrix[dx][dy].num * 2; // Add double up score.
            gameBoard.matrix[dx][dy].isDoubled = true; // Toggle double for next tile.
            gameBoard.matrix[dx][dy].reference =  this; // Keep reference on this tile in next one.
            gameBoard.matrix[this.pos.x][this.pos.y] = null; // Remove current reference.
            gameBoard.matrix[dx][dy].reference.pos.set(dx, dy); //Set to new location to animate there.
            // Enabling has moved toggle.
            gameBoard.hasMoved = true;
          }
        }
        break;
      }
    }
  }

  setColor() {
    let num = this.num;
    let index = 0;
    while (num / 2 != 1) {
      index++;
      num /= 2;
    }
    this.color = colors[index % colors.length];
  }

  doubleUp() {
    this.num *= 2;
    this.setColor();
    this.reference = null;
    this.doublingWait = 0;
    this.isDoubled = false;
  }
}

class VirtualTile {
  constructor(x, y, num) {
    this.num = num;
    this.pos = new p5.Vector(x, y);
  }

  move(board) {
    let dx = this.pos.x + board.direction.x;
    let dy = this.pos.y + board.direction.y;
    while ((-1 < dx && dx < matSize) && (-1 < dy && dy < matSize)) {
      // If next tile is null.
      if (!board.matrix[dx][dy]) {
        board.matrix[dx][dy] = board.matrix[this.pos.x][this.pos.y];
        board.matrix[this.pos.x][this.pos.y] = null;
        this.pos.set(dx, dy);
        // Calculating delta for next step.
        dx = this.pos.x + board.direction.x;
        dy = this.pos.y + board.direction.y;
        // Enabling has moved toggle.
        board.hasMoved = true;
      } else { // If next tile is not null.
        if (board.matrix[dx][dy].num == this.num) { // It is of same number.
          board.matrix[dx][dy].num *= 2;
          board.score += board.matrix[dx][dy].num; // Add double up score.
          board.matrix[this.pos.x][this.pos.y] = null; // Remove current reference.
          // Enabling has moved toggle.
          board.hasMoved = true;
        }
        break;
      }
    }
  }
}