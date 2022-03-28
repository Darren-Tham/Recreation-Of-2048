const ROWS = 4;
const COLS = 4;
const DURATION = parseInt(window.getComputedStyle(document.documentElement).getPropertyValue("--DURATION"));
const board = document.getElementById("board");
let tiles = new Array(ROWS).fill().map(() => new Array(COLS).fill(null));
let nums = new Array(ROWS).fill().map(() => new Array(COLS).fill(0));

// -------------------- Main Method --------------------

begin();

// -------------------- Functions --------------------

document.documentElement.style.setProperty("--ROWS", ROWS);
document.documentElement.style.setProperty("--COLS", COLS);

// Setting up tiles array and HTML document
function setup() {
  tiles.forEach((row, i) => {
    for (let j in row) {
      const tile = document.createElement("div");
      tile.classList.add("tile-setup");
      board.append(tile);
      tiles[i][j] = tile;
    } // for
  });
}

// Adds a random tile
function randomTile() {
  const i = Math.floor(Math.random() * 4);
  const j = Math.floor(Math.random() * 4);
  const tile = tiles[i][j];
  if (tile.firstChild) {
    return randomTile();
  } else {
    const tileChild = document.createElement("div");
    tileChild.classList.add("tile", "popout");
    const num = Math.random() <= 0.1 ? 4 : 2;
    nums[i][j] = num;
    tileChild.innerText = num;
    addColor(tileChild);
    tile.append(tileChild);
    setTimeout(() => (tileChild.className = "tile"), DURATION);
  } // if-else
} // randomTile

// Setup the board using setup() and add two random tiles in the board
// If two tiles are 4, then the game will restart
function begin() {
  setup();
  randomTile();
  randomTile();

  let fourCount = 0;
  tiles.forEach((row, i) => {
    for (let j in row) {
      const tile = tiles[i][j];
      if (tile.innerText === "4") {
        fourCount++;
      } // if
    } // for
    if (fourCount === 2) {
      restartGame();
      begin();
    } // if
  }); // forEach
} // begin

// Restarts the game
function restartGame() {
  board.innerHTML = "";
  tiles = new Array(ROWS).fill(null).map(() => new Array(COLS).fill(null));
} // restartGame

// Adds a color to the tile
function addColor(tile) {
  tile.style.background = "hsl(200, 100%, " + (100 - +tile.innerText * 5) + "%)";
} // addColor

// Adds the slide effect to the tile
function addSlide(tile, distance) {
  switch (distance) {
    case 1:
      tile.classList.add("slide-one");
      break;
    case 2:
      tile.classList.add("slide-two");
      break;
    case 3:
      tile.classList.add("slide-three");
  } // switch
} // addSlide

// Adds a new tile DOM element
function addNewTile(num) {
  const newTileChild = document.createElement("div");
  newTileChild.classList.add("tile");
  newTileChild.innerText = num;
  addColor(newTileChild);
  return newTileChild;
} // addNewTile

// Adds a random tile after each move
function addRandomTileAfterMoves(maxDelay, validMove) {
  if (!validMove) return;

  setTimeout(() => {
    randomTile();
  }, maxDelay);
} // addRandomTileAfterMoves

// Updates the new merged tile
function newMergedTile(tile, delay) {
  setTimeout(() => {
    tile.classList.add("merge");
    tile.innerText *= 2;
    addColor(tile);
    tile.previousSibling.remove();
  }, delay); // setTimeout
} // newMergedTile

// Resets the element's class name to only tile for aesthetic
function clearClassName(tile, delay, overlap) {
  if (overlap) {
    delay += DURATION;
  } // if

  setTimeout(() => {
    tile.className = "tile";
  }, delay); // setTimeout
} // clearClassName

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
    case "W":
    case "ArrowUp": {
      let maxDelay = 0;
      let validMove = false;
      for (let col = 0; col < COLS; col++) {
        for (let row = 1; row < ROWS; row++) {
          // if it is not a tile, continue
          if (!nums[row][col]) {
            continue;
          } // if

          const currentTile = tiles[row][col];
          let newRow = row;
          let overlap = false;

          // while loop breaks when it reaches the top of the board
          // or when it reaches a tile
          while (newRow && !nums[newRow - 1][col]) {
            newRow--;
          } // while

          // if the tile above is the same number, make the tile above the newTile
          if (newRow && nums[newRow - 1][col] === nums[row][col]) {
            newRow--;
            overlap = true;
          } // if

          const distance = row - newRow;
          if (!distance) {
            continue;
          } // if

          validMove = true;

          const num = nums[row][col];
          nums[newRow][col] = num;

          const newTile = tiles[newRow][col];
          const newTileChild = addNewTile(num);
          newTile.append(newTileChild);

          currentTile.removeChild(currentTile.firstChild);
          nums[row][col] = 0;

          // Setting up sliding duration
          document.documentElement.style.setProperty("--ONE", "translateY(calc(var(--GAP) + var(--SIZE)))");
          document.documentElement.style.setProperty("--TWO", "translateY(calc((var(--GAP) + var(--SIZE)) * 2))");
          document.documentElement.style.setProperty("--THREE", "translateY(calc((var(--GAP) + var(--SIZE)) * 3))");

          let delay = DURATION * distance;
          if (delay > maxDelay) {
            maxDelay = delay;
          } // if

          addSlide(newTileChild, distance);

          if (overlap) {
            newMergedTile(newTileChild, delay);
            nums[newRow][col] *= 2;
          } // if
          clearClassName(newTileChild, delay, overlap);
        } // for
      } // for
      addRandomTileAfterMoves(maxDelay, validMove);
      break;
    } // Up
    case "a":
    case "A":
    case "ArrowLeft": {
      let maxDelay = 0;
      let validMove = false;
      for (let row = 0; row < ROWS; row++) {
        for (let col = 1; col < COLS; col++) {
          // if it is not a tile, continue
          if (!nums[row][col]) {
            continue;
          } // if

          const currentTile = tiles[row][col];
          let newCol = col;
          let overlap = false;

          // while loop breaks when it reaches the left side of the board
          // or when it reaches a tile
          while (newCol && !nums[row][newCol - 1]) {
            newCol--;
          } // while

          // if the tile to the left is the same number, make the tile above the newTile
          if (newCol && nums[row][newCol - 1] === nums[row][col]) {
            newCol--;
            overlap = true;
          } // if

          const distance = col - newCol;
          if (!distance) {
            continue;
          } // if

          validMove = true;

          const num = nums[row][col];
          nums[row][newCol] = num;

          const newTile = tiles[row][newCol];
          const newTileChild = addNewTile(num);
          newTile.append(newTileChild);

          currentTile.removeChild(currentTile.firstChild);
          nums[row][col] = 0;

          // Setting up sliding duration
          document.documentElement.style.setProperty("--ONE", "translateX(calc(var(--GAP) + var(--SIZE)))");
          document.documentElement.style.setProperty("--TWO", "translateX(calc((var(--GAP) + var(--SIZE)) * 2))");
          document.documentElement.style.setProperty("--THREE", "translateX(calc((var(--GAP) + var(--SIZE)) * 3))");

          let delay = DURATION * distance;
          if (delay > maxDelay) {
            maxDelay = delay;
          } // if

          addSlide(newTileChild, distance);

          if (overlap) {
            newMergedTile(newTileChild, delay);
            nums[row][newCol] *= 2;
          } // if
          clearClassName(newTileChild, delay, overlap);
        } // for
      } // for
      addRandomTileAfterMoves(maxDelay, validMove);
      break;
    } // Left
    case "s":
    case "S":
    case "ArrowDown": {
      let maxDelay = 0;
      let validMove = false;
      for (let col = 0; col < COLS; col++) {
        for (let row = ROWS - 1; row >= 0; row--) {
          // if it is not a tile, continue
          if (!nums[row][col]) {
            continue;
          } // if

          const currentTile = tiles[row][col];
          let newRow = row;
          let overlap = false;

          // while loop breaks when it reaches the bottom of the board
          // or when it reaches a tile
          while (newRow !== ROWS - 1 && !nums[newRow + 1][col]) {
            newRow++;
          } // while

          // if the tile below is the same number, make the tile above the newTile
          if (newRow !== ROWS - 1 && nums[newRow + 1][col] === nums[row][col]) {
            newRow++;
            overlap = true;
          } // if

          const distance = newRow - row;
          if (!distance) {
            continue;
          }

          validMove = true;

          const num = nums[row][col];
          nums[newRow][col] = num;

          const newTile = tiles[newRow][col];
          const newTileChild = addNewTile(num);
          newTile.append(newTileChild);

          currentTile.removeChild(currentTile.firstChild);
          nums[row][col] = 0;

          // Setting up sliding duration
          document.documentElement.style.setProperty("--ONE", "translateY(calc(var(--GAP) + var(--SIZE) * -1))");
          document.documentElement.style.setProperty("--TWO", "translateY(calc((var(--GAP) + var(--SIZE)) * -2))");
          document.documentElement.style.setProperty("--THREE", "translateY(calc((var(--GAP) + var(--SIZE)) * -3))");

          let delay = DURATION * distance;
          if (delay > maxDelay) {
            maxDelay = delay;
          } // if

          addSlide(newTileChild, distance);

          if (overlap) {
            newMergedTile(newTileChild, delay);
            nums[newRow][col] *= 2;
          } // if
          clearClassName(newTileChild, delay, overlap);
        } // for
      } // for
      addRandomTileAfterMoves(maxDelay, validMove);
      break;
    } // Down
    case "d":
    case "D":
    case "ArrowRight": {
      let maxDelay = 0;
      let validMove = false;
      for (let row = 0; row < ROWS; row++) {
        for (let col = COLS - 1; col >= 0; col--) {
          // if it is not a tile, continue
          if (!nums[row][col]) {
            continue;
          } // if

          const currentTile = tiles[row][col];
          let newCol = col;
          let overlap = false;

          // while loop breaks when it reaches the bottom of the board
          // or when it reaches a tile
          while (newCol !== COLS - 1 && !nums[row][newCol + 1]) {
            newCol++;
          } // while

          // if the tile below is the same number, make the tile above the newTile
          if (newCol !== COLS - 1 && nums[row][newCol + 1] === nums[row][col]) {
            newCol++;
            overlap = true;
          } // if

          const distance = newCol - col;
          if (!distance) {
            continue;
          } // if

          validMove = true;

          const num = nums[row][col];
          nums[row][newCol] = num;

          const newTile = tiles[row][newCol];
          const newTileChild = addNewTile(num);
          newTile.append(newTileChild);

          currentTile.removeChild(currentTile.firstChild);
          nums[row][col] = 0;

          // Setting up sliding duration
          document.documentElement.style.setProperty("--ONE", "translateX(calc(var(--GAP) + var(--SIZE) * -1))");
          document.documentElement.style.setProperty("--TWO", "translateX(calc((var(--GAP) + var(--SIZE)) * -2))");
          document.documentElement.style.setProperty("--THREE", "translateX(calc((var(--GAP) + var(--SIZE)) * -3))");

          let delay = DURATION * distance;
          if (delay > maxDelay) {
            maxDelay = delay;
          } // if

          addSlide(newTileChild, distance);

          if (overlap) {
            newMergedTile(newTileChild, delay);
            nums[row][newCol] *= 2;
          } // if
          clearClassName(newTileChild, delay, overlap);
        } // for
      } // for
      addRandomTileAfterMoves(maxDelay, validMove);
      break;
    } // Down
  } // switch
}); // addEventListener
